var fs = require('fs');
var request = require('request');
var jwt = require('jwt-simple');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var client_id; //client key
var client_secret; //client secret
// var jwt_secret; // jwt secret

fs.readFile('./client/secret.json', function(err, data){
  var body = JSON.parse(data);
  client_id = body.client_id;
  client_secret = body.client_secret;
  // jwt_secret = body.jwt_secret;

  console.log(client_id, client_secret);

  // var redirectUrl = 'http://localhost:3000/getAccessToken?repoFullName='+req.query.repoFullName;
  // //TODO fix this horribleness, even worse cuz https doesn't work
  // console.log('going to github/oauth/authorize');
  // res.redirect('https://github.com/login/oauth/authorize?client_id=' + client_id + '&redirect_uri=' + redirectUrl);
});


var gitHubLogin = function(req, res, callback) {

  // console.log(req.params);
  var owner = req.params.repoOwner;
  var repo = req.params.repoName;

  // console.log(repo, owner);

  passport.use(new GitHubStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: 'http://localhost:3000/getAccessToken?repoFullName=' + owner + '/' + repo
  },
  function(accessToken, refreshToken, profile, done) {
    
    console.log('PASSPORT ACCESS TOKEN ' + accessToken);

    return done(null, profile);
  }));

  callback();

};

// var getAccessToken = function(req, res) {

//   // console.log(req);
//   // passport.authenticate('github', { failureRedirect: '/wtf' });

//   // var code = req.query.code;
//   // console.log(req.query.code);
//   // res.send(req);
//   // request.post({
//   //   url: 'https://github.com/login/oauth/access_token?client_id=' + client_id +'&client_secret=' + client_secret + '&code=' + code
//   // }, function(err, response, body){
//   //   console.log('github body: ', body);
//   //   var accessToken = body.slice(body.indexOf('=') + 1, body.indexOf('&'));

//   //   var payload = {'access_token': accessToken};
//   //   var encodedToken = jwt.encode(payload, jwt_secret);
//   //   // console.log('TOKEN!!!!!!!!!' + encodedToken);
    
//   //   res.redirect('/repos/' + req.query.repoFullName + '/commits?token=' + encodedToken);
//   // });
// };//, commitsController.getCommits);

module.exports = {gitHubLogin: gitHubLogin, passport: passport};

