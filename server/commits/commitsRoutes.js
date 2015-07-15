var commitsController = require('./commitsController');

module.exports = function(app) {
  app.get('/repos/:repoOwner/:repoName/commits', commitsController.getCommits);
};
