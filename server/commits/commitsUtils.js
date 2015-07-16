var Promise = require('bluebird');
var db = require('../db/config');
var fs = require('fs');
//var $ = require('jquery');
var _ = require('underscore');
var Commit = require('../db/models/commit');
//var Commits = require('../db/collections/commits');
var Repo = require('../db/models/repo');
var Github = require('github-api');

var request = require('request');

var accessToken;
(function getAccessToken() {
  if (accessToken) return;
  fs.readFile('client/secret.json', function(err, data) {
    data = JSON.parse(data.toString());
    //console.log('data: ', data);
    accessToken = data.github_token;
  });
})();

//var repoUtils = require('../repos/reposUtils');

//var github = new Github({token: access_token, auth: 'oauth'});
//var repo = github.getRepo(repoOwner, repoName);
//
//get commits from DB
var getCommitsFromDb = Promise.promisify(function(repoFullName, callback) {
  //repoUtils.retrieveRepo(repoFullName)
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
      console.log('found repo commits in db, returning commits');
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
  console.log('commits in addCommitsToRepo: ', commits);
  debugger;
  //commits = _.map(commits, function(commit) {
    //return {sha: commit.sha, committer: commit.committer.login, date: commit.commiter
    //'sha', 'committer');
  //console.log('going to store commits: ', commits);
  callback(null, commits); //give caller immediately so don't have to wait for them to finish storing
  commits.forEach(function(commit) { //the general /commits only has very general info. we must then get the detailed info for each commit later
    repoCommits.create(commit);
  });
  //})
  //.catch(function(error) {
  //console.log('error in saveCommitsToDb: ', error);
  //});
};
var saveCommitsToDb = Promise.promisify(function(repoFullName, commits, callback) {
  console.log('begin saving repo: ', repoFullName, ' to db');
  console.log('and saving commits: ', commits, ' to db');
  debugger;
  new Repo({
    fullName: repoFullName
  }).fetch().then(function(dbRepo) {
    if (dbRepo) { //repo exists in db
      debugger;
      addCommitsToRepo(dbRepo, commits, callback);
    } else { //make new repo
      new Repo({
        fullName: repoFullName
      }).save()
      .then(function(dbRepo) {
        debugger;
        addCommitsToRepo(dbRepo, commits, callback);
      });
    }
  });
});

  var getLastCommitTime = function(commits) { //helper
    return commits.length > 0 && commits[commits.length-1].date;
  };
  var cleanCommitData = function(commits) {
    debugger;
    return _.map(commits, function(commit) {
      return {sha: commit.sha, committer: commit.committer.login, date: commit.commit.committer.date}; //omg
    });
  };
  module.exports = {
    getCommitsFromDb: getCommitsFromDb,
    saveCommitsToDb : saveCommitsToDb,
    getCommitsFromGithub: Promise.promisify(function(repoFullName, maxCommits, callback) {
      console.log('trying to go to github');
      var localLastCommitTime = Date.now(), pulledLastCommitTime, githubCommits = [];
      var options = { url: 'https://api.github.com/repos/' + repoFullName + '/commits', headers: { 'User-Agent': 'http://developer.github.com/v3/#user-agent-required' }, qs: {until: localLastCommitTime, access_token: accessToken} };
      (function getMoreCommits() {
        localLastCommitTime = getLastCommitTime(githubCommits) || Date.now(); //date.now really a placeholder, incorrect time format
        //$ or request or http.get....
        //$.getJSON('https://api.github.com/repos/'+repoFullName+'/commits', {access_token: accessToken, until: localLastCommitTime}, function(newCommits) {
        request(options, function(error, response, newCommits) {
          if (newCommits.message === 'Not Found') {
            var msg = 'Repo ' + repoFullName + ' does not exist.';
            return callback(msg, null);
          }
          newCommits = cleanCommitData(JSON.parse(newCommits));
          pulledLastCommitTime = getLastCommitTime(newCommits);
          if (pulledLastCommitTime === localLastCommitTime || githubCommits.length > maxCommits) { //we have all the commits
            //console.log('got all commits: ', Commits);
            console.log('got all commits: ', githubCommits);
            callback(null, githubCommits);
          } else {
            //Commits.add(newCommits);
            githubCommits = githubCommits.concat(newCommits);
            console.log('new commits fetched: ', newCommits);
            debugger;
            saveCommitsToDb(repoFullName, newCommits).then(function(commits) {
              console.log('saved commits: ', commits);
              //if (!commits) return res.status(500).end();
              getMoreCommits();
            })
            .catch(function(error) {
              console.log('error saving commits to db: ', error);
            });
          }
        });
        //this.setState({commits: this.state.commits.concat(newCommits)});
      })();
    })
  };
