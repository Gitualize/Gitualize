var url = require('url');
var utils = require('./usersUtils');
var Promise = require('bluebird')
var request = require('request');

module.exports = {
  getUser: function(req, res) {
    var username = (url.parse(req.url).pathname).slice(1);
    var R = Promise.promisify(utils.retrieveUser);
    R(username).then(function(user) {
      if (user) {
        res.json(user);
      } else { //try Github
        var options = {
          url: 'https://api.github.com/users/' + username,
          headers: {
            'User-Agent': 'http://developer.github.com/v3/#user-agent-required'
          }
        };

        request(options, function(error, response, body) {
          // console.log(JSON.parse(body));
          var A = Promise.promisify(utils.storeUser);
          A(response.body).then(function(data) {
            if (data) {
              res.json(data);
            } else {
              res.status(500).end();
            }
          })
          .catch(function(error) {
            console.log('controller error: ', error);
          });
        });
      }
    })
    .catch(function(error) {
      console.log('controller error: ', error);
    });
  },

  getRepo: function(req, res) {
    
  },
};