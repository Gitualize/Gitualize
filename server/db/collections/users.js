var db = require('../config.js');
var User = require('../models/user.js');

var Users = User.collection();

Users.model = User;

module.exports = Users;