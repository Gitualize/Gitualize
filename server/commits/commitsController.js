var utils = require('./commitsUtils');
var Promise = require('bluebird');
var request = require('request');

module.exports = {
  getCommits: function(req, res) {
    var repoOwner = req.params.repoOwner;
    var repoName = req.params.repoName;
    utils.retrieveCommits(repoOwner + '/' + repoName).then(function(commits) {
      //TODO oauth token
      if (commits.length > 0) return res.json(commits); //commits are in db
      var options = {
        url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/commits',
        headers: {
          'User-Agent': 'http://developer.github.com/v3/#user-agent-required'
        }
      };
      //commits not in db, go to github
      request(options, function(error, response, body) {
        utils.storeCommits(repoFullName, body).then(function(commits) {
          if (commits) {
            res.json(commits);
          } else {
            res.status(500).end();
          }
        })
        .catch(function(error) {
          console.log('controller error: ', error);
        });
      });
    })
    .catch(function(error) {
      console.log('controller error: ', error);
    });
  }
};

