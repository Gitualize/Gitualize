<<<<<<< HEAD
var morgan = require('morgan'), // used for logging incoming request
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path'),
  express = require('express'),
  db = require('./db/config'),
  reposController = require('./repos/reposController'),
  commitsController = require('./commits/commitsController'),
  request = require('request'),
  fs = require('fs');

var app = express();

var router = new express.Router();
//These seem unnecessary for our purposes
//var usersRouter = new express.Router();
//var reposRouter = new express.Router();
//var commitsRouter = new express.Router();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

//ROUTES-------------------------
app.get('/repos/:repoOwner/:repoName/commits', commitsController.getCommits);
//app.get('/repos/:repoOwner/:repoName', reposController.getRepo);
//app.get('/:user/repos/:repo', reposController.getRepo); //get a user's repo with possible filters
//app.get('/:user/repos', reposController.getRepos) //get a list of user's repos
//app.get('/:user', usersController.getUser); //get a user
//-------------------------------

//app.use('/users', usersRouter);
//app.use('/repos', reposRouter);
//app.use('/commits', commitsRouter);

//require('./users/usersRoutes.js') (usersRouter);
//require('./repos/reposRoutes.js') (reposRouter);
//require('./commits/commitsRoutes.js') (commitsRouter);
// require('db/events/commitsRoutes.js') (commitsRouter);

var server = app.listen(process.env.PORT || 3000, function(){
  console.log('listening to port: ' + 3000);
});

var client_id = '29039cba3aedb378674e'; //client key
var client_secret = '75e252ae0b96801ca987a5452408146d835c63fc'; //client secret

app.get('/auth', function(req, res){
  console.log('redirect to github');

  res.redirect('https://github.com/login/oauth/authorize?client_id=' + client_id);

  request.get({
    url: 'https://github.com/login/oauth/authorize'
  });

});

app.get('/authenticate', function(req, res) {
  var code = req.query.code;
  console.log(code);

  res.redirect('/');

  request.post({
    url: 'https://github.com/login/oauth/access_token?client_id=' + client_id +'&client_secret=' + client_secret + '&code=' + code
  }, function(err, res, body){
    var access_token = body.slice(body.indexOf('=') + 1, body.indexOf('&'));

    console.log('Access token: ' + access_token);

    var token = {'github_token': access_token};

    fs.writeFile('./client/secret.json', JSON.stringify(token), function(err){
      if(err) {
        throw err;
      }
      console.log('access_token saved!');
    });
  });

});

// new Commit({sha: '123', user: 'dani'}).save().then(function(commit) {
//   console.log('saved commit: ', commit);
// });

exports.export = {server: server, app:app};
