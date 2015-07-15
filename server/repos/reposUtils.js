var Promise = require('bluebird');
var db = require('../db/config');
var Repos = require('../db/collections/repos');
var Repo = require('../db/models/repo');
//var User = require('../db/models/user');
//var utils = require('../users/usersUtils');

var retrieveRepo = function(name, callback) {
  new Repo({
    fullName : name
  }).fetch().then(function(found) {
    if (found) {
      callback(null, found);
    } else {
      console.log('could not find repo in db: ', name);
      callback(null, null);
    }
  })
  .catch(function(error) {
    console.log('error:', error);
  });
};

var storeRepo = function(repo, callback) {
  if (!repo) return console.error('tried to store repo in db but repo was null');
  var name = repo.name;
  var fullName = repo.full_name;
  var owner = repo.owner;
  console.log('repo full name: ', fullName);

  new Repo({
    fullName: fullName
  }).fetch().then(function(found) {
    if (found) {
      callback(null, found);
      console.log('repo already found:', name);
    } else {
      var newRepo = new Repo({
        fullName: fullName,
        name: name,
        owner: owner
      });
      //newRepo.id = null;
      //console.log('new repo before saving: ', newRepo);
      newRepo.save().then(function(newRepo) {
        Repos.add(newRepo);
        callback(null, newRepo);
      })
      .catch(function(error) {
        console.log('error:', error);
      });
    }
  })
  .catch(function(error) {
    console.log('error:', error);
  });
};

module.exports = {
  //get a repo from DB by reponame with possible filters
  //retrieveRepos: function(name, callback) {
  //Repo
  //.where({owner: name})
  //.fetchAll().then(function(repos) {
  //if (found) {
  //callback(null, repos);
  //} else {
  //console.log('found no repos for: ', name);
  //callback(null, null);
  //}
  //})
  //.catch(function(error) {
  //console.log('error:', error);
  //});
  //},
  retrieveRepo: Promise.promisify(retrieveRepo),
  storeRepo: Promise.promisify(storeRepo)
  //store a new repo in DB https://developer.github.com/v3/repos/#get
};
