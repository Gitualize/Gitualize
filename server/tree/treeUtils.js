var Promise = require('bluebird');
//var db = require('../db/config');
//var fs = require('fs');
//var $ = require('jquery');
var _ = require('underscore');
//var Commit = require('../db/models/commit');
//var Commits = require('../db/collections/commits');
var Repo = require('../db/models/repo');
var Github = require('github-api');

var request = require('request');
var rp = require('request-promise');

var accessToken;
var setAccessToken = function(token) {
  accessToken = token;
};
var getInitialTreeFromGithub = Promise.promisify(function(commitSha, repoFullName, callback) {
  console.log('trying to go to github for tree for commit ', commitSha);
  var options = { url: 'https://api.github.com/repos/' + repoFullName + '/git/trees/' + commitSha, headers: { 'User-Agent': 'http://developer.github.com/v3/#user-agent-required' }, qs: {recursive: 1, per_page: 100} };
  if (accessToken) options.qs.accessToken = accessToken; //TODO code repeated in commits, refactor to auth
  //var options = { url: 'https://api.github.com/repos/' + repoFullName + '/git/trees/' + commitSha, headers: { 'User-Agent': 'http://developer.github.com/v3/#user-agent-required' }, qs: {per_page: 100} };
  //page param also avail for pagination
  //TODO must check for truncated I think...
  request(options, function(error, response, body) { //TODO promisify
    if (error) return callback(error, null);
    var tree = JSON.parse(body);
    callback(null, tree);
    //save tree to db

    //if (commitsOverview.message === 'Bad credentials') return callback(commitsOverview.message, null);
    //if (commitsOverview.message === 'Not Found') {
      //var msg = 'Repo ' + repoFullName + ' does not exist.';
      //return callback(msg, null);
    //}
    //console.log('commitsOverview.length = ', commitsOverview.length);
    //commitShas = getShas(commitsOverview).reverse(); //first thing in commitsOverview is the oldest commit
    //var commitOptions = { url: 'https://api.github.com/repos/' + repoFullName + '/commits/', headers: { 'User-Agent': 'http://developer.github.com/v3/#user-agent-required' }, qs: {access_token: accessToken} };
    ////TODO DRY with above options
    //visitEachCommit(commitShas, commitOptions)
    //.then(function(commitsDetailed) {
      //commitsDetailed = cleanCommitsDetailed(commitsDetailed);
      //callback(null, commitsDetailed);
      //return saveCommitsToDb(repoFullName, commitsDetailed);
    //}).then(function(commits) {
      //console.log('saved ' + commits.length + ' commits');
      ////if (!commits) return res.status(500).end();
    //}).catch(function(err) { //is this ok or must be at end?
      //console.error('Error visiting all commits for detailed info: ', err);
    //}).catch(function(error) { //TODO many to many commits to repos relationship establish for forks
      //console.log('error saving commits to db: ', error);
    //});
  //});
 });
});

  //setAccessToken: setAccessToken,
  //getCommitsFromDb: getCommitsFromDb,
module.exports = {
  setAccessToken: setAccessToken,
  getInitialTreeFromGithub: getInitialTreeFromGithub };
