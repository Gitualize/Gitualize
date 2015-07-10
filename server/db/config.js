
var knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: 'localhost',
    user: 'terrychan',
    // password: '',
    database: 'gitpun',
    charset: 'utf8'
  }
});

var bookshelf = require('bookshelf')(knex);

bookshelf.knex.schema.hasTable('Repo').then(function (exists) {
  if (!exists) {
    bookshelf.knex.schema.createTable('Repo', function (line) {
      line.increments('id').primary();
      line.string('name', 20000); //json
      line.integer('value');
      line.timestamps();
    }).then(function (table) {
      console.log('Created table', table);
    });
  }
});

module.exports = bookshelf;
