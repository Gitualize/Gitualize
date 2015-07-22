var Promise = require('bluebird');
var db = require('../db/config');
var fs = require('fs');
var _ = require('underscore');
var Commit = require('../db/models/commit');
var Repo = require('../db/models/repo');
var Github = require('github-api');

var request = require('request');
var rp = require('request-promise');

var accessToken;
var setAccessToken = function(token) {
  accessToken = token;
};

var getCommitsFromDb = Promise.promisify(function(repoFullName, callback) {
  new Repo({
    fullName : repoFullName
  }).fetch().then(function(dbRepo) {
    if (!dbRepo) {
      var msg = 'could not find db commits of repo: ' + repoFullName;
      callback(msg, null);
      return console.error(msg);
    }
    dbRepo.commits().fetch().then(function(dbCommits) {
      var formattedCommits = _.pluck(dbCommits.models, 'attributes');
      console.log('found repo commits in db, returning ', formattedCommits.length, ' commits');
      callback(null, formattedCommits);
    });
  })
  .catch(function(error) {
    console.log('error fetching db repo: ', error);
    callback(error, null);
  });
});

var addCommitsToRepo = function(dbRepo, commits, callback) { //helper for saveCommitsToDb
  if (!dbRepo) {
    var msg = 'could not save db commits';
    console.error(msg);
    return callback(msg, null);
  }
  console.log('saved or got existing db repo');
  var repoCommits = dbRepo.commits();
  if (!repoCommits) return console.error('repo ', repoFullName, ' has no commits relationship. wtf');
  console.log('# commits in addCommitsToRepo: ', commits.length);
  callback(null, commits); //give caller immediately so don't have to wait for them to finish storing
  commits.forEach(function(commit) { //the general /commits only has very general info. we must then get the detailed info for each commit later
    repoCommits.create(commit);
  });
};
var saveCommitsToDb = Promise.promisify(function(repoFullName, commits, callback) {
  console.log('begin saving repo: ', repoFullName, ' to db');
  console.log('and saving commits to db');
  new Repo({
    fullName: repoFullName
  }).fetch().then(function(dbRepo) {
    if (dbRepo) { //repo exists in db
      addCommitsToRepo(dbRepo, commits, callback);
    } else { //make new repo
      new Repo({
        fullName: repoFullName
      }).save()
      .then(function(dbRepo) {
        addCommitsToRepo(dbRepo, commits, callback);
      });
    }
  });
});
var getShas = function(commits) {
  if (commits === null) return;
  return _.pluck(commits, 'sha');
};
var cleanCommitsDetailed = function(commits) {
  if (commits === null) return;
  var committer, avatarUrl, message;
  var c = _.map(commits, function(commit) {
    commit = JSON.parse(commit);
    committer = (commit.committer && commit.committer.login) || (commit.author && commit.author.login) || commit.commit.committer.name;
    avatarUrl = (commit.committer && commit.committer.avatar_url) || (commit.author && commit.author.avatar_url);
    //if (commit.sha.length > 40) debugger;
    //if (committer.length > 250) debugger;

    message = commit.commit.message;
    if (message.length > 195) message = message.substr(0,195) + '...';
    //if (avatarUrl.length > 250) debugger;
    return {sha: commit.sha, committer: committer, avatarUrl: avatarUrl, message: message, date: commit.commit.committer.date, files: JSON.stringify(commit.files)}; //omg
  });
  return c;
};
var visitEachCommit = function(shas, options) { //visit each commit, update commits array with more info about each commit
  var generalUrl = options.url;
  var commitsDetailed = _.map(shas, function(sha) {
    options.url = generalUrl + sha;
    return rp(options);
  });
  return Promise.all(commitsDetailed);
};
var getCommitsFromGithub = Promise.promisify(function(repoFullName, maxCommits, callback) {
  console.log('trying to go to github');
  //var localLastCommitTime = Date.now(), pulledLastCommitTime, githubCommits = [];
  var options = { url: 'https://api.github.com/repos/' + repoFullName + '/commits', headers: { 'User-Agent': 'http://developer.github.com/v3/#user-agent-required' }, qs: {access_token: accessToken, per_page: 100, page: 1} };
  //page param also avail for pagination
  var totalCommits = [];
  (function getMoreCommits() {
    request(options, function(error, response, commitsOverview) { //TODO promisify
      if (error) return callback(error, null);
      commitsOverview = JSON.parse(commitsOverview);
      if (commitsOverview.message === 'Bad credentials') return callback(commitsOverview.message, null);
      if (commitsOverview.message === 'Not Found') {
        var msg = 'Repo ' + repoFullName + ' does not exist.';
        return callback(msg, null);
      }
      //console.log('commitsOverview.length = ', commitsOverview.length);
      //TODO handle if commitsOverview is empty
      totalCommits = totalCommits.concat(commitsOverview);
      if (commitsOverview.length === 100 && totalCommits.length < maxCommits) {
        options.qs.page++;
        getMoreCommits();
      } else {
        processCommits();
      }
    });
  })();
  function processCommits() {
    commitShas = getShas(totalCommits).reverse(); //first thing in commitsOverview is the oldest commit
    var commitOptions = { url: 'https://api.github.com/repos/' + repoFullName + '/commits/', headers: { 'User-Agent': 'http://developer.github.com/v3/#user-agent-required' }, qs: {access_token: accessToken} };
    //TODO DRY with above options
    visitEachCommit(commitShas, commitOptions)
    .then(function(commitsDetailed) {
      commitsDetailed = cleanCommitsDetailed(commitsDetailed);
      callback(null, commitsDetailed);
      return saveCommitsToDb(repoFullName, commitsDetailed);
    }).then(function(commits) {
      console.log('should have saved ' + commits.length + ' commits');
      //if (!commits) return res.status(500).end();
    }).catch(function(err) { //is this ok or must be at end?
      console.error('Error visiting all commits for detailed info: ', err);
    }).catch(function(error) { //TODO many to many commits to repos relationship establish for forks
      console.log('error saving commits to db: ', error);
    });
  }
});

module.exports = {
  setAccessToken: setAccessToken,
  getCommitsFromDb: getCommitsFromDb,
  getCommitsFromGithub: getCommitsFromGithub };
