var reposController = require('./reposController.js');

//return all users

module.exports = function(app) {
   //app.get('/:repo', reposController.getRepo); //get a repo with possible filters
   app.get('/repos/:repoOwner/:repoName', reposController.getRepo);
};
