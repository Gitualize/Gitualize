var utils = require('./commitsUtils');
var Promise = require('bluebird');
module.exports = {
  getCommits: function(req, res) {
    var repoOwner = req.params.repoOwner;
    var repoName = req.params.repoName;
    var repoFullName = repoOwner + '/' + repoName;
    utils.getCommitsFromDb(repoFullName).then(function(commits) {
      //TODO oauth token
      if (commits && commits.length > 0) return res.json(commits); //commits are in db
      //request(options, function(error, response, body) {
      //body = JSON.parse(body);
      //if (body.message === 'Not Found') {
      //var message = 'Repo ' + repoFullName + ' does not exist.';
      //return res.send(message) && console.log(message);
      //}
      //utils.saveCommitsToDb(repoFullName, body).then(function(commits) {
      //if (!commits) return res.status(500).end();
      //res.json(commits);
      //})
      //.catch(function(error) {
      //console.log('error saving commits to db: ', error);
      //});
      //});
    }).catch(function(err) {
      console.log('commits not in db, going to github');
      //commits not in db, go to github
      utils.getCommitsFromGithub(repoFullName, 100)
      .then(function(commits) {
        res.json(commits);
      })
      .catch(function(error) { //prolly unneeded
        console.error(error);
        res.send(error);
      });
    });
  }
};
