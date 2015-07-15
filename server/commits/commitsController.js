var utils = require('./commitsUtils');
var Promise = require('bluebird');
var request = require('request');
var fs = require('fs');

var accessToken;
(function getAccessToken() {
  if (accessToken) return;
  fs.readFile('client/secret.json', function(err, data) {
    data = JSON.parse(data.toString());
    //console.log('data: ', data);
    accessToken = data.github_token;
  });
})();

module.exports = {
  getCommits: function(req, res) {
    var repoOwner = req.params.repoOwner;
    var repoName = req.params.repoName;
    var repoFullName = repoOwner + '/' + repoName;
    utils.getCommitsFromDb(repoFullName).then(function(commits) {
      //TODO oauth token
      if (commits && commits.length > 0) return res.json(commits); //commits are in db
      var options = {
        url: 'https://api.github.com/repos/' + repoFullName + '/commits',
        headers: {
          'User-Agent': 'http://developer.github.com/v3/#user-agent-required'
        },
        qs: {access_token: accessToken}
      };
      console.log('commits not in db, going to github');
      //commits not in db, go to github
      request(options, function(error, response, body) {
        body = JSON.parse(body);
        if (body.message === 'Not Found') {
          var message = 'Repo ' + repoFullName + ' does not exist.';
          return res.send(message) && console.log(message);
        }
        utils.saveCommitsToDb(repoFullName, body).then(function(commits) {
          if (!commits) return res.status(500).end();
          res.json(commits);
        })
        .catch(function(error) {
          console.log('error saving commits to db: ', error);
        });
      });
    })
    .catch(function(error) { //prolly unneeded
      console.log('controller error getCommitsFromDb: ', error);
    });
  }
};

