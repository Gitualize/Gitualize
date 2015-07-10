var db = require('../config');

var Commit = new db.Model.extend({
  tableName: 'Commit'
});

module.exports = Commit;
