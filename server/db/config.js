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
      table.string('user', 100).primary();
    }).then(function(table) {
      console.log('Created table: user');
      bookshelf.knex.schema.hasTable('repo').then(function (exists) {
        if (!exists) {
          bookshelf.knex.schema.createTable('repo', function (repo) {
            repo.string('fullName', 200).primary(); //user/repo
            repo.string('name', 100).notNullable(); //repo
            //repo.string('owner', 100).notNullable().references('user').inTable('user') //user
            repo.string('owner', 100).notNullable(); //for now or else have to have a user in usertable before testing repos
            repo.timestamps();
          }).then(function (table) {
            console.log('Created table: repo');
            bookshelf.knex.schema.hasTable('commit').then(function (exists) {
              if (!exists) {
                bookshelf.knex.schema.createTable('commit', function (commit) {
                  commit.string('sha', 255).primary(); //branch
                  commit.text('diff', 20000); //JSON diff/patch
                  commit.text('files', 5000); //files changed. json array of urls
                  commit.string('repo').notNullable().references('fullName').inTable('repo');
                  commit.string('commiter').notNullable().references('user').inTable('user');
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
