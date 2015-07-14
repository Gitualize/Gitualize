var db = require('../config');
require('./commit'); //don't need var assignment, using bookshelf registry
require('./repo'); //don't need var assignment, using bookshelf registry

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: false, //CAN CHANGE THIS LATER, ALSO UPDATE DB-CONFIG IF SO
  commit: function() {
    return this.hasMany('commit');
  },
  repo: function() {
    return this.hasMany('repo');
  },
});