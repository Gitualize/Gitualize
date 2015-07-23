var fs = require('fs');
var request = require('request');

var client_id;
var client_secret;
var base_URL = process.env.PRODUCTION ? 'http://gitualize.com' : 'http://localhost:3000';

var gitHubLogin = function(req, res) { //redirects to github login
  console.log('auth controller login');
  fs.readFile('./client/secret.json', function(err, data){
    if (data) {
      // local environment
      var body = JSON.parse(data);
      client_id = body.client_id;
      client_secret = body.client_secret;
    } else {
      // production environment
      client_id = process.env.CLIENT_ID;
      client_secret = process.env.CLIENT_SECRET;
    }
    var redirectUrl = base_URL + '/getAccessToken?repoFullName='+req.query.repoFullName;
    console.log('going to github/oauth/authorize');
    res.redirect('https://github.com/login/oauth/authorize?client_id=' + client_id + '&redirect_uri=' + redirectUrl);
  });
};

var getAccessToken = function(req, res) { //redirects back to our client page
  var code = req.query.code;
  request.post({
    url: 'https://github.com/login/oauth/access_token?client_id=' + client_id +'&client_secret=' + client_secret + '&code=' + code
  }, function(err, response, body){
    var accessToken = body.slice(body.indexOf('=') + 1, body.indexOf('&'));
    console.log('got access token');
    res.redirect(base_URL + '/#/repo/' + req.query.repoFullName + '?accessToken=' + accessToken);
  });
};

module.exports = {gitHubLogin: gitHubLogin, getAccessToken: getAccessToken};
