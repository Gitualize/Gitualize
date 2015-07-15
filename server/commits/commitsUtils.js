var Promise = require('bluebird');
var db = require('../db/config');
var fs = require('fs');
//var $ = require('jquery');
var Commits = require('../db/collections/commits');
var Commit = require('../db/models/commit');
var Github = require('github-api');
var repoUtils = require('../repos/reposUtils');

//var github = new Github({token: access_token, auth: 'oauth'});
//var repo = github.getRepo(repoOwner, repoName);
//
var retrieveCommits = function(repoFullName, callback) {
  repoUtils.retrieveRepo(repoFullName)
  .then(function(dbRepo) {
    callback(null, dbRepo.commits());
  })
  .catch(function(error) {
    console.log('error:', error);
  });
};
//new Repo({
//fullName : repoFullName
//}).fetch().then(function(dbRepo) {
//if (dbRepo) {
//callback(null, dbRepo.commits);
//} else {
//console.log('could not find commits of repo: ', repoFullName);
//callback(null, null);
//}
//})
//.catch(function(error) {
//console.log('error:', error);
//});
var storeCommits = function(repoFullName, commits, callback) {
  repoUtils.retrieveRepo(repoFullName)
  .then(function(dbRepo) {
    var repo_commits = dbRepo.commits();
    if (!repo_commits) return console.error('repo ', repoFullName, ' has no commits relationship');
    commits.forEach(function(commit) { //the general /commits only has very general info. we must then get the detailed info for each commit later
      repo_commits.create({sha: commit.sha});
    });
  })
  .catch(function(error) {
    console.log('error finding repo:', error);
  });
};
module.exports = {
  retrieveCommits: Promise.promisify(retrieveCommits),
  //store a new repo's commits in DB
  storeCommits: Promise.promisify(storeCommits),
  getLastCommitTime: function(commits) { //helper
    return commits.length > 0 && commits[commits.length-1].commit.committer.date;
  },
  getCommits: function(fullRepoName, maxCommits) {
    var localLastCommitTime, pulledLastCommitTime;
    var getMoreCommits = function() {
      localLastCommitTime = this.getLastCommitTime(Commits) || Date.now(); //date.now really a placeholder, incorrect time format
      //TODO replace with call to our api
      $.getJSON('https://api.github.com/repos/'+fullRepoName+'/commits', {access_token: access_token, until: localLastCommitTime}, function(newCommits) {
        pulledLastCommitTime = this.getLastCommitTime(newCommits);
        if (pulledLastCommitTime === localLastCommitTime || Commits.length > maxCommits) { //we have all the commits
          console.log('got all commits: ', Commits);
        } else {
          Commits.add(newCommits);
          //this.setState({commits: this.state.commits.concat(newCommits)});
          getMoreCommits();
        }
      }.bind(this));
    }.bind(this);
    getMoreCommits();
  }
};
