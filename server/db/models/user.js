var db = require('../config');
require('./commit'); //don't need var assignment, using bookshelf registry
require('./repo'); //don't need var assignment, using bookshelf registry

var User = db.Model.extend({
  tableName: 'user',
  idAttribute: 'user',
  hasTimestamps: false, //CAN CHANGE THIS LATER, ALSO UPDATE DB-CONFIG IF SO
  commits: function() {
    return this.hasMany('commit');
  },
  repos: function() {
    return this.hasMany('repo');
  },
});

module.exports = db.model('user', User);
