var Promise = require('bluebird');
var db = require('../db/config');
var fs = require('fs');
//var $ = require('jquery');
var _ = require('underscore');
var Commit = require('../db/models/commit');
var Commits = require('../db/collections/commits');
var Repo = require('../db/models/repo');
var Github = require('github-api');
//var repoUtils = require('../repos/reposUtils');

//var github = new Github({token: access_token, auth: 'oauth'});
//var repo = github.getRepo(repoOwner, repoName);
//
//get commits from DB
var getCommitsFromDb = function(repoFullName, callback) {
  //repoUtils.retrieveRepo(repoFullName)
  new Repo({
    fullName : repoFullName
  }).fetch().then(function(dbRepo) {
    if (!dbRepo) {
      callback(null, null);
      return console.error('could not find db commits of repo: ', repoFullName);
    }
    dbRepo.commits().fetch().then(function(dbCommits) {
      var formattedCommits = _.pluck(dbCommits.models, 'attributes');
      console.log('found repo commits in db, returning commits');
      callback(null, formattedCommits);
    });
  });
};
var saveCommitsToDb = function(repoFullName, commits, callback) {
  console.log('begin saving repo: ', repoFullName, ' to db');
  var newRepo = new Repo({
    fullName: repoFullName
  });
  newRepo.save().then(function(dbRepo) {
    console.log('saved repo');
    if (!dbRepo) {
      console.error('could not save db commits of repo: ', repoFullName);
      return callback(null, null);
    }
    var repo_commits = dbRepo.commits();
    if (!repo_commits) return console.error('repo ', repoFullName, ' has no commits relationship. wtf');
    commits = _.pick(commits, 'sha', 'committer');
    console.log('going to store commits: ', commits);
    callback(null, commits); //give 
    commits.forEach(function(commit) { //the general /commits only has very general info. we must then get the detailed info for each commit later
      repo_commits.create({sha: commit.sha, committer: commit.committer.login});
    });
  })
  .catch(function(error) {
    console.log('error saving repo:', error);
  });
};
module.exports = {
  getCommitsFromDb: Promise.promisify(getCommitsFromDb),
  //store a new repo's commits in Db
  saveCommitsToDb : Promise.promisify(saveCommitsToDb),
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
