var utils = require('./reposUtils');
var Promise = require('bluebird')
var request = require('request');

module.exports = {
  getRepo: function(req, res) {
    var user = req.params.user;
    var repo = req.params.repo;

    var R = Promise.promisify(utils.retrieveRepo);
      R(user + '/' + repo).then(function(repo) {
        if (repo) {
          res.json(repo);
        } else { //try Github?
          var options = {
            url: 'https://api.github.com/repos/' + user + '/' + repo,
            headers: {
              'User-Agent': 'http://developer.github.com/v3/#user-agent-required'
            }
          };

          request(options, function(error, response, body) {
            // console.log(JSON.parse(body));
            var A = Promise.promisify(utils.storeRepo);
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

  getRepos: function(req, res) {
    var user = req.params.user;

    var R = Promise.promisify(utils.retrieveRepos);
    R(user).then(function(repos) {
      if (repos) {
        res.json(repos);
      } else { //try Github?
        res.status(500).end();
      }
    })
    .catch(function(error) {
      console.log('controller error: ', error);
    });
  },
};