var utils = require('./commitsUtils');
//var authUtils = require('./auth/authUtils');
var Promise = require('bluebird');
module.exports = {
  getCommits: function(req, res) {
    var accessToken = req.query.accessToken; //TODO use sessions to save this instead of pass around
    if (accessToken) {
      console.log('get Commits accessToken: ', accessToken);
      //authUtils.setAccessToken(accessToken); //TODO so every controllr has access (like trees)
      utils.setAccessToken(accessToken);
    }
    var repoOwner = req.params.repoOwner;
    var repoName = req.params.repoName;
    var repoFullName = repoOwner + '/' + repoName;
    utils.getTotalCommits(repoFullName)
    .then(function(totalNumCommits) {
      utils.getCommitsFromDb(repoFullName)
      .then(function(commits) {
        if (commits && commits.length > 0) return res.json(commits); //commits are in db
      }).catch(function(err) {
        console.log('commits not in db, going to github');
        //commits not in db, go to github
        if (!accessToken) { //redjrect to /auth with original repo request info
          return res.json({msg: 'auth required', authUrl: '/auth?repoFullName='+repoFullName});
          //return res.redirect('/auth?repoFullName='+repoFullName); //don't let server redirect, client should
          //res.end();
          //next();
        }
        //100 is the max # of things we can pull at a time
        var maxCommits = 500;
        maxCommits = Math.min(500, totalNumCommits);
        console.log('total num commits of repo is ', totalNumCommits, ', we are getting ', maxCommits, ' max');
        utils.getCommitsFromGithub(repoFullName, totalNumCommits, maxCommits)
        .then(function(commits) {
          //if (commits === 'finished') {
            //debugger;
            //return res.end('got all commits');
          //}
          console.log('got some commits from github'); //, commits);
          //res.write(commits);
          res.json(commits);
        })
        .catch(function(error) { //repo doesn't exist msg
          console.error(error);
          res.send(error);
        });
      });
    }).catch(function(err) {
      console.error(err);
      res.send(err);
    });
  }
};
