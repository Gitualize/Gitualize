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
    }).catch(function(err) {
      console.log('commits not in db, going to github');
      //commits not in db, go to github
      utils.getCommitsFromGithub(repoFullName, 100)
      .then(function(commits) {
        console.log('got commits from github: ', commits);
        res.json(commits);
      })
      .catch(function(error) { //repo doesn't exist msg
        console.error(error);
        res.send(error);
      });
    });
  }
};
