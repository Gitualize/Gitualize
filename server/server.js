var morgan = require('morgan'), // used for logging incoming request
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path');
  express = require('express');
  db = require('./db/config.js');

var app = express();

var usersRouter = new express.Router();
var reposRouter = new express.Router();
// var commitsRouter = new express.Router();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

app.use('/users', usersRouter);
app.use('/repos', reposRouter);
// app.use('/commit', commitsRouter);

require('./users/usersRoutes.js') (usersRouter);
require('./repos/reposRoutes.js') (reposRouter);
// require('db/events/commitsRoutes.js') (commitsRouter);

// get commits with username and repo name
// app.get('/repos/:gitUser/:repoName', function(req, res){

//   var gitUser = req.param('gistUser');
//   var repoName = req.param('repoName');

//   var options = {
//     url: 'https://api.github.com/repos/' + gitUser + '/' + repoName + '/commits',
//     headers: {
//       'User-Agent': 'http://developer.github.com/v3/#user-agent-required'
//     }
//   };

//   request(options, function(error, response, body) {
//     // console.log(JSON.parse(body));
//     res.send(body);
//   });

// });

var server = app.listen(process.env.PORT || 3000, function(){
  console.log('listening to port: ' + 3000);
});

// new Commit({sha: '123', user: 'dani'}).save().then(function(commit) {
//   console.log('saved commit: ', commit);
// });

exports.export = {server: server, app:app};
