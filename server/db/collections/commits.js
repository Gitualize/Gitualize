var db = require('../config.js');
var Commit = require('../models/commit.js');

var Commits = new db.collection();

Commits.model = Commit;

module.exports = Commits;
