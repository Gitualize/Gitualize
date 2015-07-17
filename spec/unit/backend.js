var express = require('express');
var request = require('request');
var db = require('../../server/db/config.js');
var Repo = require('../../server/db/models/repo.js');
var Commit = require('../../server/db/models/commit.js');
var User = require('../../server/db/models/user.js');
var Repos = require('../../server/db/collections/repos.js');
var Commits = require('../../server/db/collections/commits.js');
var Users = require('../../server/db/collections/users.js');

// turn off node server before testing
var server = require('../../server/server.js').export;

describe('test db', function(){
  var config = db.knex.schema.client.config;

  it('should be defined', function(){
    expect(db).toBeDefined();
  });

  it('should be using postgres', function(){
    expect(config.client).toBe('pg');
  });

  it('should have the right configurations', function(){
    expect(config.connection.database).toBe('gitpun');
    expect(config.connection.host).toBe('127.0.0.1');
    expect(config.connection.port).toBe('5432');
  });
  
  it('should have a table named repo', function(done){
    db.knex.schema.hasTable('repo')
    .then(function(exists){
      expect(exists).toBe(true);
      done();
    });
  });

  it('should have a table named commit', function(done){
    db.knex.schema.hasTable('commit')
    .then(function(exists){
      expect(exists).toBe(true);
      done();
    });
  });

});

describe('Repo model', function(){

  it('should have Repo defined', function(){
    expect(Repo).toBeDefined();
  });

  var r = new Repo();
  it('should be a model class', function(){
    expect(r).toBeDefined();
    expect(r instanceof Repo).toBe(true);
  });

  it('should be a Bookshelf model', function(){
    r.set({test:'1234'});
    expect(r.get('test')).toBe('1234');
  });

  it('should have a has-many relationship with Commit', function(){
    expect(r.commits().relatedData.target).toBe(Commit);
  });

  it('should have a belongs-to relationship with user', function(){
    expect(r.user().relatedData.target).toBe(User);
  });

  it('should add a model to the database', function(done){

    new Repo({name: 'test'}).save().then(function(repo) {
      var attr = repo.attributes;

      expect(attr.name).toBe('test');

      repo.destroy();
      done();
    });
    
  });
  
});

describe('Commit model', function(){

  it('should have Commit defined', function(){
    expect(Commit).toBeDefined();
  });

  var c = new Commit();
  it('should be a model class', function(){
    expect(c).toBeDefined();
    expect(c instanceof Commit).toBe(true);
  });

  it('should be a Bookshelf model', function(){
    c.set({test:'1234'})
    expect(c.get('test')).toBe('1234');
  });

  it('should have a belongs-to relationship with Repo', function(){
    expect(c.repo().relatedData.target).toBe(Repo);
  });

  it('should have a belongs-to relationship with User', function(){
    expect(c.user().relatedData.target).toBe(User);
  });
  
  it('should add a model to the database', function(done){

    new Commit({sha: 1234, user: 'test'}).save().then(function(commit) {
      var attr = commit.attributes;

      expect(attr.sha).toBe(1234);
      expect(attr.user).toBe('test');

      commit.destroy();
      done();
    });
    
  });

});

describe('User model', function(){

  it('should have Commit defined', function(){
    expect(Commit).toBeDefined();
  });

  var u = new User();
  it('should be a model class', function(){
    expect(u).toBeDefined();
    expect(u instanceof User).toBe(true);
  });

  it('should be a Bookshelf model', function(){
    u.set({test:'1234'})
    expect(u.get('test')).toBe('1234');
  });

  it('should have a has-many relationship with Commit', function(){
    expect(u.commits().relatedData.target).toBe(Commit);
  });

  it('should have a has-many relationship with Repos', function(){
    expect(u.repos().relatedData.target).toBe(Repo);
  });
  
  // it('should add a model to the database', function(done){

  //   new User({current_user: 'test'}).save().then(function(user) {
  //     var attr = user.attributes;

  //     expect(attr.current_user).toBe('test');

  //     user.destroy();
  //     done();
  //   });
    
  // });

});

describe('Repos Collection', function(){
  // var rs = Repos.forge([{name1: 'terry'},{name2: 'terrance'}])

  it('should have Repos defined', function(){
    expect(Repos).toBeDefined();
    expect(Repos.model).toBe(Repo);
  });

});

describe('Commits Collection', function(){

  it('should have Commits defined', function(){
    expect(Commits).toBeDefined();
    expect(Commits.model).toBe(Commit);
  });

});

describe('Users Collection', function(){

  it('should have Users defined', function(){
    expect(Users).toBeDefined();
    expect(Users.model).toBe(User);
  });

});

describe('Server', function(){
  // console.log(server.server.address());

  it('should be defined', function() {
    expect(server.app).toBeDefined();
  });

  it('sould be running', function() {
    expect(server.server).toBeDefined();
    expect(server.server.address().port).toBeDefined();
  });

  it('should be requesting the static page', function(done){

    request('http://127.0.0.1:3000/', function(error, response, body){
      expect(response.statusCode).toBe(200);
      done();
    });

  });

  it('should get a repo', function(done){
    
    request('http://127.0.0.1:3000/repos/jashkenas/backbone', function(error, response, body){
      expect(response.statusCode).toBe(200);
      done();
    });

  });

  it('should get a user', function(done){

    request('http://127.0.0.1:3000/jashkenas', function(error, response, body){
      expect(response.statusCode).toBe(200);
      done();
    });

  });

  it('should get a users repo with filters', function(done){

    request('http://127.0.0.1:3000/jashkenas/repo/backbone', function(error, response, body){
      expect(response.statusCode).toBe(200);
      done();
    });

  });

  afterAll(function(){
    server.close();
  });

});
