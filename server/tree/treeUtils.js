var Promise = require('bluebird');
var _ = require('underscore');
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
  request(options, function(error, response, body) { //TODO promisify
    if (error) return callback(error, null);
    var tree = JSON.parse(body);
    callback(null, tree);
  });
});

module.exports = {
  setAccessToken: setAccessToken,
  getInitialTreeFromGithub: getInitialTreeFromGithub };
