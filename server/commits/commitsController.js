var utils = require('./commitsUtils');
var Promise = require('bluebird');
module.exports = {
  getCommits: function(req, res) {
    var accessToken = req.query.accessToken; //TODO use sessions to save this instead of pass around
    if (accessToken) {
      console.log('get Commits accessToken: ', accessToken);
      utils.setAccessToken(accessToken);
    }
    var repoOwner = req.params.repoOwner;
    var repoName = req.params.repoName;
    var repoFullName = repoOwner + '/' + repoName;
    utils.getCommitsFromDb(repoFullName).then(function(commits) {
      if (commits && commits.length > 0) return res.json(commits); //commits are in db
    }).catch(function(err) {
      console.log('commits not in db, going to github');
      //commits not in db, go to github
      //TODO oauth token here
      if (!accessToken) { //redjrect to /auth with original repo request info
        return res.json({msg: 'auth required', authUrl: '/auth?repoFullName='+repoFullName});
        //return res.redirect('/auth?repoFullName='+repoFullName); //don't let server redirect, client should
        //res.end();
        //next();
      }
      utils.getCommitsFromGithub(repoFullName, 100)
      .then(function(commits) {
        console.log('got commits from github'); //, commits);
        res.json(commits);
      })
      .catch(function(error) { //repo doesn't exist msg
        console.error(error);
        res.send(error);
      });
    });
  }
};
