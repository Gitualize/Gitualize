var usersController = require('./usersController.js');

//return all users

module.exports = function(app) {
  app.get('/:user', usersController.getUser); //get a user

  app.get('/:user/repo/:repo', usersController.getRepo); //get a user's repo

  app.get('/:user/repo/:repo/:data', usersController.getRepoFilter); //get a user's repo with filtering data
};
