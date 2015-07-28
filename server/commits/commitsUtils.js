var Spooky = require('spooky');
var Promise = require('bluebird');
var db = require('../db/config');
var fs = require('fs');
var url = require('url');
var _ = require('underscore');
var Commit = require('../db/models/commit');
var Repo = require('../db/models/repo');

var request = require('request');
var rp = require('request-promise');

var accessToken;
var setAccessToken = function(token) {
  accessToken = token;
};
var socket;
var setSocket = function(s) { //could avoid code repeat by letting server know about commitsUtils but less encapsulatey
  socket = s;
};

var getCommitsFromDb = Promise.promisify(function(repoFullName, callback) {
  new Repo({
    fullName : repoFullName
  }).fetch().then(function(dbRepo) {
    if (!dbRepo) {
      var msg = 'could not find db commits of repo: ' + repoFullName;
      callback(msg, null);
      return console.error(msg);
    }
    dbRepo.commits().fetch().then(function(dbCommits) {
      var formattedCommits = _.pluck(dbCommits.models, 'attributes');
      console.log('found repo commits in db, returning ', formattedCommits.length, ' commits');
      callback(null, formattedCommits);
    });
  })
  .catch(function(error) {
    console.log('error fetching db repo: ', error);
    callback(error, null);
  });
});

var addCommitsToRepo = function(dbRepo, commits, callback) { //helper for saveCommitsToDb
  if (!dbRepo) {
    var msg = 'could not save db commits';
    console.error(msg);
    return callback(msg, null);
  }
  console.log('saved or got existing db repo');
  var repoCommits = dbRepo.commits();
  if (!repoCommits) return console.error('repo ', repoFullName, ' has no commits relationship. wtf');
  console.log('# commits in addCommitsToRepo: ', commits.length);
  //callback(null, commits); //give caller immediately so don't have to wait for them to finish storing
  commits.reduce(function(prevCommitPromise, commit) {
    return prevCommitPromise
    .then(function(dbCommit) {
      return repoCommits.create(commit);
    });
  }, new Promise(function(resolve) { resolve(); }))
  .then(function(commitChain) {
    //debugger;
    callback(null, commits); //give caller here to ensure no pinging of more github pages before saving the current batch
  })
  .catch(function(err) {
    console.error(err);
    callback('error saving commits with chained commit promises', null);
  });

  //commits.forEach(function(commit) { //the general /commits only has very general info. we must then get the detailed info for each commit later
  //repoCommits.create(commit)
  //.then(function(dbCommit) {
  //repoCommits.create(commit);
  //});
};
var saveCommitsToDb = Promise.promisify(function(repoFullName, commits, callback) {
  console.log('begin saving repo: ', repoFullName, ' to db');
  console.log('and saving commits to db');
  new Repo({
    fullName: repoFullName
  }).fetch().then(function(dbRepo) {
    if (dbRepo) { //repo exists in db
      addCommitsToRepo(dbRepo, commits, callback);
    } else { //make new repo
      new Repo({
        fullName: repoFullName
      }).save()
      .then(function(dbRepo) {
        addCommitsToRepo(dbRepo, commits, callback);
      });
    }
  });
});
var getShas = function(commits) {
  if (commits === null) return;
  return _.pluck(commits, 'sha');
};

var rawgittify = function(githubUrl) { //helper to change raw_url to max cdn.rawgit.com
  var u = url.parse(githubUrl);
  u.host = 'cdn.rawgit.com';
  u.pathname = u.pathname.split('/');
  u.pathname.splice(3,1);
  u.pathname = u.pathname.join('/');
  return url.format(u);
};
var cleanCommitsDetailed = function(commits) {
  if (commits === null) return;
  var committer, avatarUrl, message;
  var c = _.map(commits, function(commit) {
    commit = JSON.parse(commit);
    if (!commit.sha) return; //skip this commit...maybe reached some api access limit? check elsewhere perhaps
    committer = (commit.committer && commit.committer.login) || (commit.author && commit.author.login) || commit.commit.committer.name;
    avatarUrl = (commit.committer && commit.committer.avatar_url) || (commit.author && commit.author.avatar_url);

    message = commit.commit.message;
    if (message.length > 195) message = message.substr(0,195) + '...';
    //if (avatarUrl.length > 250) debugger;
    _.each(commit.files, function(file) {
      file.raw_url = rawgittify(file.raw_url);
    });
    return {sha: commit.sha, merge: commit.parents.length > 1, committer: committer, avatarUrl: avatarUrl, message: message, date: commit.commit.committer.date, files: JSON.stringify(commit.files)}; //omg
  });
  return c;
};
var visitEachCommit = function(shas, options) { //visit each commit, update commits array with more info about each commit
  var generalUrl = options.url;
  var commitsDetailed = _.map(shas, function(sha) {
    options.url = generalUrl + sha;
    return rp(options);
  });
  return Promise.all(commitsDetailed);
};

var getTotalCommits = Promise.promisify(function(repoFullName, callback) {
  var spooky = new Spooky({
    child: { transport: 'http' }, casper: { logLevel: 'debug', verbose: true } }, function (err) {
      if (err) {
        e = new Error('Failed to initialize SpookyJS');
        e.details = err;
        throw e;
      }
      spooky.start('https://github.com/'+repoFullName);
      spooky.then(function () {
        var scrapeNumCommits = function() {
          return document.querySelector('li.commits .num').firstChild.nodeValue.trim();
          //return $('li.commits .num').text().trim();
        };
        this.emit('commits', this.evaluate(scrapeNumCommits));
      });
      spooky.run();
    });
    spooky.on('error', function (e, stack) {
      console.error(e);
      callback(e, null);
      if (stack) console.log(stack);
    });
    //spooky.on('console', function (line) { //uncomment to debug
    //console.log(line);
    //});
    spooky.on('log', function (log) {
      if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
      }
    });
    spooky.on('commits', function (num) {
      if (typeof num !== 'string') return callback('unexpected format of scraped # of commits', null);
      num = parseInt(num.replace(',', ''));
      if (isNaN(num)) return callback('commits scraped NaN', null);
      console.log('scraped total commits: ', num);
      callback(null, num);
    });
});

//var processCommits = Promise.promisify(function(commits, repoFullName, callback) { //getCommitsFromGithub helper
  //commitShas = getShas(commits).reverse(); //so first thing is the oldest commit for this batch
  //var commitOptions = { url: 'https://api.github.com/repos/' + repoFullName + '/commits/', headers: { 'User-Agent': 'http://developer.github.com/v3/#user-agent-required' }, qs: {access_token: accessToken} };
  ////TODO DRY with above options
  //visitEachCommit(commitShas, commitOptions)
  //.then(function(commitsDetailed) {
    //if (!Array.isArray(commitsDetailed)) callback('commits fetched not an array. api limit?', null);
    //commitsDetailed = cleanCommitsDetailed(commitsDetailed);
    //callback(null, commitsDetailed); //give data to getCommitsFromGithub
    ////TODO adding a callback above means a promise here but also returns the save promise below
    //return saveCommitsToDb(repoFullName, commitsDetailed);
    ////}).then(function(commits) {
    ////console.log('should have saved ' + commits.length + ' commits');
    //////if (!commits) return res.status(500).end();
  //}).catch(function(err) { //is this ok or must be at end?
    //console.error('Error visiting all commits for detailed info: ', err);
  //}).catch(function(error) { //TODO many to many commits to repos relationship establish for forks
    //console.log('error saving commits to db: ', error);
  //});
//});
var processCommits = function(commits, repoFullName) { //getCommitsFromGithub helper
  commitShas = getShas(commits).reverse(); //so first thing is the oldest commit for this batch
  var commitOptions = { url: 'https://api.github.com/repos/' + repoFullName + '/commits/', headers: { 'User-Agent': 'http://developer.github.com/v3/#user-agent-required' }, qs: {access_token: accessToken} };
  return visitEachCommit(commitShas, commitOptions)
  .then(function(commitsDetailed) {
    if (!Array.isArray(commitsDetailed)) return console.error('commits fetched not an array. api limit?');
    commitsDetailed = cleanCommitsDetailed(commitsDetailed);
    return saveCommitsToDb(repoFullName, commitsDetailed);
  }).catch(function(err) {
    console.error('Error visiting all commits for detailed info: ', err);
  });
};
var getCommitsFromGithub = Promise.promisify(function(repoFullName, totalNumCommits, maxCommits, callback) {
  console.log('trying to go to github');
  var startPage = Math.ceil(totalNumCommits/100);
  console.log('starting with page: ', startPage);
  var options = { url: 'https://api.github.com/repos/' + repoFullName + '/commits', headers: { 'User-Agent': 'http://developer.github.com/v3/#user-agent-required' }, qs: {access_token: accessToken, per_page: 100, page: startPage} };
  var totalCommitsCount = 0;
  (function getMoreCommits() {
    request(options, function(error, response, commitsOverview) { //TODO promisify
      if (error) return callback(error, null);
      commitsOverview = JSON.parse(commitsOverview);
      console.log('getting commits on page: ', options.qs.page);
      if (commitsOverview.message === 'Bad credentials') return callback(commitsOverview.message, null);
      if (commitsOverview.message === 'Not Found') {
        var msg = 'Repo ' + repoFullName + ' does not exist.';
        return callback(msg, null);
      }
      //console.log('commitsOverview.length = ', commitsOverview.length);
      //TODO handle if commitsOverview is empty
      //totalCommits = totalCommits.concat(commitsOverview);
      //totalCommits = commitsOverview;
      totalCommitsCount += commitsOverview.length;

      //len should always be > 0 unless we are at startPage and didn't select it right
      if (commitsOverview.length < 1) return callback('error fetching correct commits', null);
      processCommits(commitsOverview, repoFullName)
      .then(function(commitsDetailed) {
        console.log('should have saved ' + commitsDetailed.length + ' commits');
        socket.emit('gotCommits', commitsDetailed);
        console.log('emitted socket commits.length ', commitsDetailed);
        //callback(null, commitsDetailed); // to commitsController
        if (--options.qs.page > 0 && totalCommitsCount < maxCommits) getMoreCommits();
      }).catch(function(err) {
        return console.error('Error processingCommits: ', err);
      });
    });
  })();
});

module.exports = {
  setSocket: setSocket,
  setAccessToken: setAccessToken,
  getTotalCommits: getTotalCommits,
  getCommitsFromDb: getCommitsFromDb,
  getCommitsFromGithub: getCommitsFromGithub };
