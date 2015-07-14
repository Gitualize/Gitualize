var usersController = require('./usersController.js');
var reposController = require('../repos/reposController.js');

//return all users

module.exports = function(app) {
  app.get('/:user/repo/:repo', reposController.getRepo); //get a user's repo with possible filters
  app.get('/:user/repo', reposController.getRepos) //get a list of user's repos
  app.get('/:user', usersController.getUser); //get a user
};
