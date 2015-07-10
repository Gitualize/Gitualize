
var db = require('../config');
require('./commit'); //don't need var assignment, using bookshelf registry

var Repo = db.Model.extend({
  tableName: 'repo',
  hasTimestamps: true,
  commits: function() {
    return this.hasMany('commit');
  }
});

module.exports = db.model('repo', Repo); //use bookshelf registry plugin to avoid circular referencing problems
