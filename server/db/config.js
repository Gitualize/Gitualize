var knex = require('knex')({
  client: 'pg',
  connection: 'postgres://127.0.0.1:5432/gitpun' || {
      host: process.env.DB_PORT_5432_TCP_ADDR,
      user: 'docker',
      password: 'docker',
      database: 'docker',
      charset: 'utf8'
    }
});


var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');

knex.schema.dropTableIfExists('repo');
knex.schema.dropTableIfExists('commit');
knex.schema.dropTableIfExists('user');

bookshelf.knex.schema.hasTable('user').then(function(exists) {
  if (!exists) {
    bookshelf.knex.schema.createTable('user', function(table) {
      table.increments('id').primary();
      table.string('user', 100).unique();
    }).then(function(table) {
      console.log('Created table: user');
      bookshelf.knex.schema.hasTable('repo').then(function (exists) {
        if (!exists) {
          bookshelf.knex.schema.createTable('repo', function (repo) {
            repo.increments('id').primary();
            repo.string('fullName', 200).unique(); //user/repo
            //repo.string('name', 100).notNullable(); //repo
            //repo.string('owner', 100).notNullable().references('user').inTable('user') //user
            //repo.string('owner', 100).notNullable(); //for now or else have to have a user in usertable before testing repos
            repo.timestamps();
          }).then(function (table) {
            console.log('Created table: repo');
            bookshelf.knex.schema.hasTable('commit').then(function (exists) {
              if (!exists) {
                bookshelf.knex.schema.createTable('commit', function (commit) {
                  commit.increments('id').primary();
                  commit.string('sha', 255).unique();
                  commit.text('diff', 20000); //JSON diff/patch
                  commit.text('files', 5000); //files changed. json array of urls
                  commit.integer('repo_id').notNullable().references('repo.id');
                  commit.string('committer').notNullable(); //.references('user')
                  commit.string('date');
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
    })
    .catch(function(error) {
      console.log(error);
    });
  }
});


module.exports = bookshelf;
