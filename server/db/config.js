
var knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://127.0.0.1:5432/gitpun'
});

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');

knex.schema.dropTableIfExists('repo');
knex.schema.dropTableIfExists('commit');

bookshelf.knex.schema.hasTable('repo').then(function (exists) {
  if (!exists) {
    bookshelf.knex.schema.createTable('repo', function (repo) {
      repo.increments('id').primary();
      repo.string('name', 255); //user/reponame
      //repo.integer('value');
      repo.timestamps();
    }).then(function (table) {
      console.log('Created table', table);
    });
  }
});
bookshelf.knex.schema.hasTable('commit').then(function (exists) {
  if (!exists) {
    bookshelf.knex.schema.createTable('commit', function (commit) {
      commit.increments('id').primary(); //the follow numbers are somewhat arbitrary. change em and add other fields
      commit.string('sha', 255); //user/reponame
      commit.string('user', 255); //JSON, person who made the commit
      commit.text('diff', 20000); //JSON diff/patch
      commit.text('files', 5000); //files changed. json array of urls
      commit.integer('repo_id').references('repo.id');
      //repo.integer('value');
      commit.timestamps();
    }).then(function (table) {
      console.log('Created table', table);
    });
  }
});

module.exports = bookshelf;
