var db = require('../config');
require('./commit'); //don't need var assignment, using bookshelf registry
require('./user'); //don't need var assignment, using bookshelf registry

var Repo = db.Model.extend({
  tableName: 'repo',
  hasTimestamps: true,
  commit: function() {
    return this.hasMany('commit');
  },
  user : function() {
    return this.belongsTo('user');
  }
});

module.exports = db.model('repo', Repo); //use bookshelf registry plugin to avoid circular referencing problems
