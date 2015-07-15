var utils = require('./reposUtils');
var request = require('request');

module.exports = {
  getRepo: function(req, res) {
    var user = req.params.user;
    var repo = req.params.repo;

    utils.retrieveRepo(user + '/' + repo).then(function(dbRepo) {
      if (dbRepo) return res.json(dbRepo.attributes);
      //TODO oauth token
      var options = {
        url: 'https://api.github.com/repos/' + user + '/' + repo,
        headers: {
          'User-Agent': 'http://developer.github.com/v3/#user-agent-required'
        }
      };

      request(options, function(error, response, body) {
        // console.log(JSON.parse(body));
        utils.storeRepo(response.body).then(function(dbRepo) {
          if (dbRepo) {
            res.json(dbRepo.attributes);
          } else {
            res.status(500).end();
          }
        })
        .catch(function(error) {
          console.log('controller error: ', error);
        });
      });
    })
    .catch(function(error) {
      console.log('controller error: ', error);
    });
  }
  //,

  //getRepos: function(req, res) {
  //var user = req.params.user;

  //var R = Promise.promisify(utils.retrieveRepos);
  //R(user).then(function(repos) {
  //if (repos) {
  //res.json(repos);
  //} else { //try Github?
  //res.status(500).end();
  //}
  //})
  //.catch(function(error) {
  //console.log('controller error: ', error);
  //});
  //},
};
