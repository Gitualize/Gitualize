var morgan = require('morgan'), // used for logging incoming request
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path');
  express = require('express');
  db = require('./db/config.js');

var app = express();

var usersRouter = new express.Router();
// var commitsRouter = new express.Router();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

app.use('/user', usersRouter);
// app.use('/commit', commitsRouter);

require('./db/users/usersRoutes.js') (usersRouter);
// require('db/events/commitsRoutes.js') (commitsRouter);


// get commits with username and repo name
// app.get('/repos/:gitUser/:repoName', function(req, res){

//   var gitUser = req.param('gitUser');
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

app.listen(process.env.PORT || 3000, function(){
});

// new Commit({sha: '123', user: 'dani'}).save().then(function(commit) {
//   console.log('saved commit: ', commit);
// });







