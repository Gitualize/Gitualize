var db = require('../config');
var Users = require('../collections/users');
var User = require('../models/user');

module.exports = {
  //get a user from DB by username
  retrieveUser: function(username, callback) {
    new User({
        username: username
      }).fetch().then(function(found) {
        if (found) {
          callback(null, found.attributes);
        } else {
          console.log('username not found' + username);
        }
      })
      .catch(function(error) {
        console.log('error:', error);
      });
  },

  //store a new user in DB https://developer.github.com/v3/users/
  storeUser: function(user, callback) {
    var username = user.login;

    new User({
        username: username
      }).fetch().then(function(found) {
        if (found) {
          callback(null, found.attributes);
          console.log('user already found:', username);
        } else {
          var user = new User({
            username: username,
          });
          user.save().then(function(newUser) {
            Users.add(newUser);
            callback(null, newUser);
          })
          .catch(function(error) {
            console.log('error:', error);
          });
        }
      })
      .catch(function(error) {
        console.log('error:', error);
      });
  },
};