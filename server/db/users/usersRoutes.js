var usersController = require('./usersController.js');

//return all users

module.exports = function(app) {
  app.get('/:user', usersController.getUser); //get one user
  app.post('/:user', usersController.addUser); //add one user
};
