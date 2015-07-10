var db = require('../config');

var Repo = new db.Model.extend({
  tableName: 'Repo'
});

module.exports = Repo;
