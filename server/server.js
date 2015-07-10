var express = require('express');
var app = express();
var db = require('./db/config.js');
// var Repos = require('./db/collections/repos.js');
// var Commits = require('./db/collections/commits.js');
 var Repo = require('./db/models/repo.js');
 var Commit = require('./db/models/commit.js');
//var util = require('./utils');

//app.get('/', function(){

//});

app.use(express.static(__dirname + '/../client'));

var server = app.listen(process.env.PORT || 3000, function(){
});

new Commit({sha: '123', user: 'dani'}).save().then(function(commit) {
  console.log('saved commit: ', commit);
});







