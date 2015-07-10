var express = require('express');
var app = express();
var db = require('./db/config.js');
// var Repos = require('./db/collections/repos.js');
// var Commits = require('./db/collections/commits.js');
// var Repo = require('./db/models/repo.js');
// var Commit = require('./db/models/commit.js');

app.get('/', function(){

});

var server = app.listen(3000, function(){
  console.log('connected');
});

