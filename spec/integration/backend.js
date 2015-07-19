var express = require('express');
var request = require('request');
var db = require('../../server/db/config.js');
var Repo = require('../../server/db/models/repo.js');
var Commit = require('../../server/db/models/commit.js');
var User = require('../../server/db/models/user.js');
var Repos = require('../../server/db/collections/repos.js');
var Commits = require('../../server/db/collections/commits.js');
var Users = require('../../server/db/collections/users.js');

var MockBrowser = require('mock-browser');

describe('Commits controller', function(){

  it('should be truthy', function(){
    expect(true).toBe(true);
  });
 
  it('should add commits to the database', function(done){
    request('http://127.0.0.1:3000/getAccessToken?repoFullName=tchan247/blog-project', function(error, response, body){

      new Commit({'fullNamed': 'tchan247/blog-project'}).fetch().then(function(item){
        console.log('ITEMS!!!!');
        console.log(item);

        expect(item.length > 0).toBe(true);
        if(item) {
          // item.destroy();
        }
        done();
      });

    });

  });

  it('should be truthy', function(){
    expect(true).toBe(true);
  });

});

describe('Repos Controller', function(){

  it('should add repos to the database', function(done){
    request('http://127.0.0.1:3000/getAccessToken?repoFullName=tchan247/blog-project', function(error, response, body){

      new Repo({'fullName': 'tchan247/blog-project'}).fetch().then(function(item){
        console.log('ITEMS!!!!');
        console.log(item.length);

        expect(item || item.length > 0).toBe(true);
        // if(item) {
          // item.destroy();
        // }
        done();
      });

    });

  });

});

describe('Users Controller', function(){

  it('should add users to the database', function(done){

    request('http://127.0.0.1:3000/getAccessToken?repoFullName=tchan247/blog-project', function(error, response, body){
      (new User).fetch().then(function(item){
        expect(item.length > 0).toBe(true);
        // if(item) {
        //   item.destroy();
        // }
        done();
      });
    });

  });

});


describe('Authentication Controller', function(){

    // TODO:
    // test login
  it('should redirect to github when trying to get a repo first time', function(done){
    request('http://127.0.0.1:3000/auth?repoFullName=tchan247/blog-project', function(error, response, body){
      if(error) {
        throw error;
      }
      var href = response.request.href;
      expect(href.indexOf('github.com/login') > -1).toBe(true);
      done();
    });

  });

  it('should get an access token', function(){
    
    expect(false).toBe(true);
  });

  it('should create a session for the user', function(){
    expect(false).toBe(true);
  });

  it('should not authenticate user if user already in a session', function(){
    expect(false).toBe(true);
  });

});


