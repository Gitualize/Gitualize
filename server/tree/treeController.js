var utils = require('./treeUtils');
var Promise = require('bluebird');
module.exports = {
  getTree: function(req, res) {
    var accessToken = req.query.accessToken; //TODO use sessions to save this instead of pass around
    if (accessToken) utils.setAccessToken(accessToken);
    //get commits first--use that accessToken
    //if (!accessToken) {
      //return res.json({msg: 'auth required', authUrl: '/auth?repoFullName='+repoFullName});
    //}
    var sha = req.params.commitSha;
    var repoOwner = req.params.repoOwner;
    var repoName = req.params.repoName;
    var repoFullName = repoOwner + '/' + repoName;
      utils.getInitialTreeFromGithub(sha, repoFullName)
      .then(function(tree) {
        if (tree.truncated) res.json({msg: 'truncated'}); //or something else
        if (!tree.tree) res.json({msg: 'no tree'}); //probably over api limit
        console.log('got initial tree from github, len is ', tree.tree.length);
        res.json(tree);
      })
      .catch(function(error) { //tree doesn't exist msg
        console.error(error);
        res.send(error);
      });
  }
};
