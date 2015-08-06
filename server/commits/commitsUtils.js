var Spooky = require('spooky');
var Promise = require('bluebird');
var fs = require('fs');
var url = require('url');
var _ = require('underscore');
var request = require('request');
var rp = require('request-promise');

var db = require('../db/config');
var Commit = require('../db/models/commit');
var Repo = require('../db/models/repo');

var verbose = false;

var accessToken;
var setAccessToken = function(token) { //TODO refactor
  accessToken = token;
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
    var scrapedTotCommits = dbRepo.attributes.totalCommits;
    dbRepo.commits().fetch().then(function(dbCommits) {
      //sort in correct order (may not come in order from db)
      var formattedCommits = _.sortBy(_.pluck(dbCommits.models, 'attributes'), function(dbCommit) { return dbCommit.id });
      console.log('found repo ', repoFullName, ' commits in db, returning ', formattedCommits.length, ' commits');
      callback(null, {commits: formattedCommits, totalNumCommits:scrapedTotCommits});
    }).catch(function(err) {
      callback('error fetching commits of repo: '+err, null);
    });
  }).catch(function(error) {
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
  if (verbose) console.log('saved or got existing db repo');
  var repoCommits = dbRepo.commits();
  if (!repoCommits) return console.error('repo ', repoFullName, ' has no commits relationship. Something is wrong with the db if this occurs.');
  if (verbose) console.log('# commits in addCommitsToRepo: ', commits.length);
  Promise.map(commits, function(commit) { //map commits to dbCommits
    return new Commit({sha: commit.sha}).fetch()
    .then(function(dbCommit) {
      return dbCommit || new Commit(commit).save();
    }).catch(function(err) {
      callback('error getting or saving individual commit to db: '+err, null);
    });
  }).then(function(dbCommits) {
    repoCommits.attach(dbCommits); //returns a promise
    callback(null, commits);
  }).catch(function(err) {
    callback('err getting saved dbCommits: '+err, null);
  });
};

var saveCommitsToDb = Promise.promisify(function(repoData, commits, callback) {
  if (verbose) console.log('begin saving repo: ', repoData.repoFullName, ' to db\n and saving commits to db');
  new Repo({
    fullName: repoData.repoFullName
  }).fetch({}).then(function(dbRepo) {
    if (dbRepo) { //repo exists in db
      addCommitsToRepo(dbRepo, commits, callback);
    } else { //make new repo
      new Repo({
        fullName: repoData.repoFullName,
        totalCommits: repoData.scrapedTotCommits
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

  return _.map(commits, function(commit) {
    if (typeof commit === 'string') {
      commit = JSON.parse(commit); //will be string upon first getting from request rp, will be object if fetching from db
    } else { //from db, already cleaned
      return commit.attributes;
    }
    if (!commit.sha) return; //skip this commit...maybe reached some api access limit? check elsewhere perhaps
    committer = (commit.committer && commit.committer.login) || (commit.author && commit.author.login) || commit.commit.committer.name;
    avatarUrl = (commit.committer && commit.committer.avatar_url) || (commit.author && commit.author.avatar_url);

    message = commit.commit.message;
    if (message.length > 195) message = message.substr(0,195) + '...';
    _.each(commit.files, function(file) {
      delete file.patch;
      file.raw_url = rawgittify(file.raw_url);
    });
    return {sha: commit.sha,
            merge: commit.parents.length > 1,
            committer: committer,
            avatarUrl: avatarUrl,
            message: message,
            date: commit.commit.committer.date,
            files: JSON.stringify(commit.files)
    };
  });
};

var visitEachCommit = function(shas, options) { //visit each commit, update commits array with more info about each commit
  var generalUrl = options.url;
  return Promise.map(shas, function(sha) { //map commit shas to detailed commits (from db or github). ie don't visit commits if already in db
    return new Commit({sha: sha}).fetch()
    .then(function(dbCommit) {
      if (dbCommit) return dbCommit;
      options.url = generalUrl + sha;
      return rp(options);
    })
    .catch(function(err) {
      console.err('error getting detailed commit from db or visiting it with github api: '+err);
    });
  });

  //var commitsDetailed = _.map(shas, function(sha) { //old method always visited commit even if already in db
    //options.url = generalUrl + sha;
    //return rp(options);
  //});
  //return Promise.all(commitsDetailed);
};

var scrapeTotalCommits = Promise.promisify(function(repoFullName, callback) {
  //set a port in case it conflicts with aws listening to node port
  var spooky = new Spooky({
    child: { transport: 'http', port: 1337 },
    casper: { logLevel: 'debug',
    verbose: true } 
    }, function (err) {
      if (err) {
        e = new Error('Failed to initialize SpookyJS');
        e.details = err;
        throw e;
      }
      spooky.start('https://github.com/'+repoFullName); //consider starting spooky instance on landing page to decrease load time
      spooky.then(function () {
        var scrapeNumCommits = function() {
          return document.querySelector('li.commits .num').firstChild.nodeValue.trim();
        };
        this.emit('commits', this.evaluate(scrapeNumCommits));
      });
      spooky.run();
    });
    spooky.on('error', function (e, stack) {
      console.error(e);
      callback(e, null);
      if (stack) console.log(stack);
      //spooky.destroy();
    });
    spooky.on('log', function (log) {
      if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
      }
    });
    spooky.on('commits', function (num) {
      if (typeof num === 'null') return callback('scraped commits was null', null);
      if (typeof num !== 'string') return callback('unexpected format of scraped # of commits: '+num, null);
      num = parseInt(num.replace(',', ''));
      if (isNaN(num)) return callback('commits scraped NaN', null);
      console.log('scraped total commits for repo: ', repoFullName, num);
      callback(null, num);
      spooky.destroy();
    });
});

var processCommits = function(commits, repoData) { //getCommitsFromGithub helper
  commitShas = getShas(commits).reverse(); //so first thing is the oldest commit for this batch
  var commitOptions = { url: 'https://api.github.com/repos/' + repoData.repoFullName + '/commits/', headers: { 'User-Agent': 'http://developer.github.com/v3/#user-agent-required' }, qs: {access_token: accessToken} };
  return visitEachCommit(commitShas, commitOptions)
  .then(function(commitsDetailed) {
    if (!Array.isArray(commitsDetailed)) return console.error('commits fetched not an array. api limit?');
    commitsDetailed = cleanCommitsDetailed(commitsDetailed);
    return saveCommitsToDb(repoData, commitsDetailed); // this will attempt to save commits already in the db if it is a fork. could refactor to skim over those
  }).catch(function(err) {
    console.error('Error visiting all commits for detailed info: ', err);
  });
};

var getCommitsFromGithub = Promise.promisify(function(repoFullName, maxCommits, socket, callback) {

  scrapeTotalCommits(repoFullName)
  .then(function(totalNumCommits) {
    maxCommits = Math.min(maxCommits, totalNumCommits);
    console.log('total num commits of repo is ', totalNumCommits, ', we are getting ', maxCommits, ' max');
    var startPage = Math.ceil(totalNumCommits/100);
    console.log('trying to go to github');
    console.log('starting with page: ', startPage);
    var options = { url: 'https://api.github.com/repos/' + repoFullName + '/commits', headers: { 'User-Agent': 'http://developer.github.com/v3/#user-agent-required' }, qs: {access_token: accessToken, per_page: 100, page: startPage} };
    var totalCommitsCount = 0;

    (function getMoreCommits() {
      request(options, function(error, response, commitsOverview) { //TODO promisify
        if (error) return callback(error, null);
        commitsOverview = JSON.parse(commitsOverview);
        console.log('tried to get ', repoFullName, ' commits on page: ', options.qs.page);
        if (commitsOverview.message === 'Bad credentials') return callback(commitsOverview.message, null);
        if (commitsOverview.message === 'Not Found') {
          var msg = 'Repo ' + repoFullName + ' does not exist.';
          return callback(msg, null);
        }
        totalCommitsCount += commitsOverview.length;

        //len should always be > 0 unless we are at startPage and didn't select it right
        if (commitsOverview.length < 1) return callback('error fetching correct commits', null);
        processCommits(commitsOverview, {repoFullName: repoFullName, scrapedTotCommits: totalNumCommits})
        .then(function(commitsDetailed) {
          var commitsData = JSON.stringify({commits: commitsDetailed, totalNumCommits: totalNumCommits});
          socket.emit('gotCommits', commitsData); //stringify just in case, big data objs cause problems
          //console.log('emitted socket commits.length ', commitsDetailed.length);
          console.log('should have saved and emitted' + commitsDetailed.length + ' commits');
          callback(null, commitsData); // to commitsController to handle normal http requests
          if (--options.qs.page > 0 && totalCommitsCount < maxCommits) getMoreCommits();
        }).catch(function(err) {
          return console.error('Error processingCommits: ', err);
        });
      });
    })();
  }).catch(function(e) {
    socket.emit('gotCommitsError', e);
    console.log("emitted gotCommitsError (couldn't scrape commits)");
  });
});

module.exports = {
  setAccessToken: setAccessToken,
  getCommitsFromDb: getCommitsFromDb,
  getCommitsFromGithub: getCommitsFromGithub };
