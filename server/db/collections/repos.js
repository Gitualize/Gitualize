var db = require('../config.js');
var Repo = require('../models/repo.js');

var Repos = new db.collection();

Repos.model = Repo;

module.exports = Repos;
