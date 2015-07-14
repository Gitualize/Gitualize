var knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://127.0.0.1:5432/gitpun'
});


var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');

knex.schema.dropTableIfExists('repo');
knex.schema.dropTableIfExists('commit');

bookshelf.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    bookshelf.knex.schema.createTable('users', function(table) {
      table.string('user', 255).primary()
    }).then(function(table) {
      console.log('Created table: users');
      bookshelf.knex.schema.hasTable('repos').then(function (exists) {
        if (!exists) {
          bookshelf.knex.schema.createTable('repos', function (repo) {
            repo.string('full_name', 255).primary(); //user/repo
            repo.string('name', 255).notNullable(); //repo
            repo.string('owner', 255).notNullable().references('user').inTable('users') //user
            repo.timestamps();
          }).then(function (table) {
            console.log('Created table: repos');
            bookshelf.knex.schema.hasTable('commits').then(function (exists) {
              if (!exists) {
                bookshelf.knex.schema.createTable('commits', function (commit) {
                  commit.string('sha', 255).primary(); //branch
                  commit.text('diff', 20000); //JSON diff/patch
                  commit.text('files', 5000); //files changed. json array of urls
                  commit.string('tree', 255);
                  commit.string('repo').notNullable().references('full_name').inTable('repos');
                  commit.string('commiter').notNullable().references('users').inTable('users');
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
