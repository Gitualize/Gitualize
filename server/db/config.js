var connection = process.env.IS_DOCKER_CONTAINER ? {
  host: process.env.DB_PORT_5432_TCP_ADDR,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  charset: 'utf8'
} : 'postgres://127.0.0.1:5432/gitpun';

var knex = require('knex')({
  client: 'pg',
  connection: connection
});

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');

knex.schema.dropTableIfExists('repo');
knex.schema.dropTableIfExists('commit');

bookshelf.knex.schema.hasTable('repo').then(function (exists) {
  if (!exists) {
    bookshelf.knex.schema.createTable('repo', function (repo) {
      repo.increments('id').primary();
      repo.string('fullName', 200).unique(); //user/repo
      repo.timestamps();
    }).then(function (table) {
      console.log('Created table: repo');
      bookshelf.knex.schema.hasTable('commit').then(function (exists) {
        if (!exists) {
          bookshelf.knex.schema.createTable('commit', function (commit) {
            commit.increments('id').primary(); //TODO specify storage bytes
            commit.string('sha', 50).unique();
            commit.text('files', 20000); //files changed. json obj containing urls and patches
            commit.integer('repo_id').notNullable().references('repo.id');
            commit.text('committer').notNullable(); //.references('user')
            commit.string('avatarUrl', 60);
            commit.text('message', 200); //truncate if too long
            commit.string('date', 20);
            commit.bool('merge', 1);
            commit.timestamps();
          }).then(function (table) {
            console.log('Created table: commit');
          })
          .catch(function(error) {
            console.log(error);
          });
        }
      });
    })
    .catch(function(error) {
      console.log(error);
    });
  }
});

module.exports = bookshelf;
