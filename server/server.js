var morgan = require('morgan'), // used for logging incoming request
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path'),
  express = require('express'),
  db = require('./db/config'),
  commitsController = require('./commits/commitsController'),
  authController = require('./auth/authController.js'),
  request = require('request'),
  fs = require('fs');

var app = express();

var router = new express.Router();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));
var server = app.listen(process.env.PORT || 3000, function(){
  console.log('listening to port: ' + 3000);
});

//ROUTES-------------------------
app.get('/repos/:repoOwner/:repoName/commits', commitsController.getCommits);
app.get('/auth', authController.gitHubLogin);
app.get('/getAccessToken', authController.getAccessToken);
//-------------------------------

exports.export = {server: server, app:app};
