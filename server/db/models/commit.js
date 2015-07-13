var db = require('../config');
require('./repo'); //don't need var assignment, using bookshelf registry
require('./user'); //don't need var assignment, using bookshelf registry

var Commit = db.Model.extend({
  tableName: 'commit',
  hasTimestamps: true,
  repo: function() {
    return this.belongsTo('repo');
  },
  user : function() {
    return this.belongsTo('user');
  }
});

module.exports = db.model('commit', Commit); //use bookshelf registry plugin to avoid circular referencing problems
