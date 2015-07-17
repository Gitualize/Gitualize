var db = require('../config.js');
var Repo = require('../models/repo.js');

var Repos = Repo.collection();

Repos.model = Repo;

module.exports = Repos;
