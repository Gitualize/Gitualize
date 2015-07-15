var commitsController = require('./commitsController');

//return all users

module.exports = function(app) {
  app.get('/repos/:repoOwner/:repoName', commitsController.getCommits);
};
