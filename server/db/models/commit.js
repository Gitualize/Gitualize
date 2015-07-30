var db = require('../config');
require('./repo'); //don't need var assignment, using bookshelf registry

var Commit = db.Model.extend({
  tableName: 'commit',
  hasTimestamps: true,
  repos: function() {
    return this.belongsToMany('repo');
  }
});

module.exports = db.model('commit', Commit); //use bookshelf registry plugin to avoid circular referencing problems
