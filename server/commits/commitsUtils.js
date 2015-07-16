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

//var github = new Github({token: access_token, auth: 'oauth'});
//var repo = github.getRepo(repoOwner, repoName);
//
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
  callback(null, commits); //give caller immediately so don't have to wait for them to finish storing
  commits.forEach(function(commit) { //the general /commits only has very general info. we must then get the detailed info for each commit later
    repoCommits.create(commit);
  });
};
var saveCommitsToDb = Promise.promisify(function(repoFullName, commits, callback) {
  console.log('begin saving repo: ', repoFullName, ' to db');
  console.log('and saving commits: ', commits, ' to db');
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

var getLastCommitTime = function(commits) { //helper
  return commits.length > 0 && commits[commits.length-1].date;
};
var cleanCommitData = function(commits) {
  if (commits === null) return;
  var committer;
  return _.map(commits, function(commit) {
    //omg apparently there may not be a commit.committer.
    //if (!commit) debugger;
    //if (!commit.committer) //omg
    //if (!commit.committer.login) debugger;
    committer = (commit.committer && commit.committer.login) || (commit.author && commit.author.login) || commit.commit.committer.name;
    //I hate myself
    return {sha: commit.sha, committer: committer, date: commit.commit.committer.date}; //omg
  });
};
var getCommitsFromGithub = Promise.promisify(function(repoFullName, maxCommits, callback) {
  console.log('trying to go to github');
  var localLastCommitTime = Date.now(), pulledLastCommitTime, githubCommits = [];
  var options = { url: 'https://api.github.com/repos/' + repoFullName + '/commits', headers: { 'User-Agent': 'http://developer.github.com/v3/#user-agent-required' }, qs: {access_token: accessToken, per_page: maxCommits} };
  //page param also avail for pagination
  request(options, function(error, response, newCommits) {
    if (error) return callback(error, null);
    newCommits = JSON.parse(newCommits);
    if (newCommits.message === 'Bad credentials') return callback(newCommits.message, null);
    if (newCommits.message === 'Not Found') {
      var msg = 'Repo ' + repoFullName + ' does not exist.';
      return callback(msg, null);
    }
    console.log('newCommits: ', newCommits);
    //TODO handle if newCommits is empty
    newCommits = cleanCommitData(newCommits);
    callback(null, newCommits);
    saveCommitsToDb(repoFullName, newCommits)
    .then(function(commits) {
      console.log('saved commits: ', commits);
      //if (!commits) return res.status(500).end();
    }).catch(function(error) { //TODO many to many commits to repos relationship establish for forks
      console.log('error saving commits to db: ', error);
    });
  });
});

//replaced with 1 param above. nooooo
//(function getMoreCommits() {
//localLastCommitTime = getLastCommitTime(githubCommits) || Date.now(); //date.now really a placeholder, incorrect time format
//options.qs.until = localLastCommitTime;
////$ or request or http.get....
////$.getJSON('https://api.github.com/repos/'+repoFullName+'/commits', {access_token: accessToken, until: localLastCommitTime}, function(newCommits) {
//request(options, function(error, response, newCommits) {
//if (error) return callback(error, null);
//newCommits = JSON.parse(newCommits);
//if (newCommits.message === 'Not Found') {
//var msg = 'Repo ' + repoFullName + ' does not exist.';
//return callback(msg, null);
//}
//console.log('newCommits: ', newCommits);
////TODO handle if newCommits is empty
//newCommits = cleanCommitData(newCommits);
//pulledLastCommitTime = getLastCommitTime(newCommits);
//if (pulledLastCommitTime === localLastCommitTime || githubCommits.length > maxCommits) { //we have all the commits
////console.log('got all commits: ', Commits);
//console.log('got all commits: ', githubCommits);
//callback(null, githubCommits);
//} else {
////Commits.add(newCommits);
//githubCommits = githubCommits.concat(newCommits);
//console.log('new commits fetched: ', newCommits);
//saveCommitsToDb(repoFullName, newCommits).then(function(commits) {
//console.log('saved commits: ', commits);
////if (!commits) return res.status(500).end();
//getMoreCommits();
//})
//.catch(function(error) {
//console.log('error saving commits to db: ', error);
//});
[{"id":197,"sha":"6ecee63738ca82282fde318fdb4d51c32da9df9a","diff":null,"files":null,"repo_id":2,"committer":"jridgewell","date":"2015-05-14T00:41:51Z","created_at":"2015-07-16T19:28:32.401Z","updated_at":"2015-07-16T19:28:32.401Z"},{"id":101,"sha":"07eeea1979aec322f6002c4f0250f9997c173355","diff":null,"files":null,"repo_id":2,"committer":"dxuehu","date":"2015-06-24T06:25:05Z","created_at":"2015-07-16T19:28:32.395Z","updated_at":"2015-07-16T19:28:32.395Z"},{"id":198,"sha":"2b628d5f4663e44113b1bbb771bd9020c9b09282","diff":null,"files":null,"repo_id":2,"committer":"jashkenas","date":"2015-05-13T22:15:17Z","created_at":"2015-07-16T19:28:32.401Z","updated_at":"2015-07-16T19:28:32.401Z"},{"id":196,"sha":"dfd2e5b1881f8eb5753f10cc8f0c2ff646b77833","diff":null,"files":null,"repo_id":2,"committer":"megawac","date":"2015-05-14T03:49:04Z","created_at":"2015-07-16T19:28:32.401Z","updated_at":"2015-07-16T19:28:32.401Z"},{"id":199,"sha":"1bde5c589cce0021c0cae05ad6b379fa982a5cd1","diff":null,"files":null,"repo_id":2,"committer":"jashkenas","date":"2015-05-13T22:10:26Z","created_at":"2015-07-16T19:28:32.401Z","updated_at":"2015-07-16T19:28:32.401Z"},{"id":200,"sha":"e69efe785116b91ff2bb5a601cb4ed45584700ef","diff":null,"files":null,"repo_id":2,"committer":"jashkenas","date":"2015-05-13T22:07:16Z","created_at":"2015-07-16T19:28:32.401Z","updated_at":"2015-07-16T19:28:32.401Z"},{"id":195,"sha":"45e8e55d64d4d3b6ef8f9e02f3684cd717628bc9","diff":null,"files":null,"repo_id":2,"committer":"craigmichaelmartin","date":"2015-05-14T12:48:52Z","created_at":"2015-07-16T19:28:32.401Z","updated_at":"2015-07-16T19:28:32.401Z"},{"id":194,"sha":"22b92bf925bb8ac8050a489116de91b45aa66b15","diff":null,"files":null,"repo_id":2,"committer":"akre54","date":"2015-05-14T13:58:32Z","created_at":"2015-07-16T19:28:32.401Z","updated_at":"2015-07-16T19:28:32.401Z"}]
//}
//});
////this.setState({commits: this.state.commits.concat(newCommits)});
//})();
//});

module.exports = {
  getCommitsFromDb: getCommitsFromDb,
  getCommitsFromGithub: getCommitsFromGithub };
