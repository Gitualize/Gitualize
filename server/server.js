var express = require('express');
var app = express();
var request = require('request');
var db = require('./db/config.js');
// var Repos = require('./db/collections/repos.js');
// var Commits = require('./db/collections/commits.js');
var Repo = require('./db/models/repo.js');
var Commit = require('./db/models/commit.js');

// get commits with username and repo name
app.get('/repos/:gitUser/:repoName', function(req, res){

  var gitUser = req.param('gitUser');
  var repoName = req.param('repoName');

  var options = {
    url: 'https://api.github.com/repos/' + gitUser + '/' + repoName + '/commits',
    headers: {
      'User-Agent': 'http://developer.github.com/v3/#user-agent-required'
    }
  };

  request(options, function(error, response, body) {
    // console.log(JSON.parse(body));
    res.send(body);
  });

});

app.use(express.static(__dirname + '/../client'));

app.listen(process.env.PORT || 3000, function(){
});

// new Commit({sha: '123', user: 'dani'}).save().then(function(commit) {
//   console.log('saved commit: ', commit);
// });







