var db = require('../db/config');
var Users = require('../db/collections/users');
var User = require('../db/models/user');

module.exports = {
  //get a user from DB by user
  retrieveUser: function(user, callback) {
    new User({
        user: user
      }).fetch().then(function(found) {
        if (found) {
          callback(null, found.attributes);
        } else {
          console.log('user not found: ', user);
          callback(null, null);
        }
      })
      .catch(function(error) {
        console.log('error:', error);
      });
  },

  //store a new user in DB https://developer.github.com/v3/users/
  storeUser: function(userdata, callback) {
    var user = userdata.login;
    new User({
        user: user
      }).fetch().then(function(found) {
        if (found) {
          callback(null, found.attributes);
          console.log('user already found:', user);
        } else {
          var newUser = new User({
            user: user,
          });
          newUser.id = null;
          console.log('newuser: ', newUser);
          newUser.save().then(function(newUser) {
            Users.add(newUser);
            callback(null, newUser.attributes);
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