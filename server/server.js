var morgan = require('morgan'), // used for logging incoming request
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path'),
  express = require('express'),
  db = require('./db/config'),
  commitsController = require('./commits/commitsController'),
  authController = require('./auth/authController.js'),
  request = require('request'),
  fs = require('fs'),
  compress = require('compression');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var router = new express.Router();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(compress());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));
server.listen(process.env.PORT || 3000, function(){
  console.log('listening to port: ' + 3000);
});
io.on('connection', function(socket) {
  console.log('user connected');
});

//ROUTES-------------------------
app.get('/repos/:repoOwner/:repoName/commits', commitsController.getCommits);
app.get('/auth', authController.gitHubLogin);
app.get('/getAccessToken', authController.getAccessToken);
//-------------------------------

exports.export = {server: server, app:app};
