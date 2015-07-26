# Gitualize

Gitualize allows you to visualize the changes in a GitHub repository.

[gitualize.com](gitualize.com)


## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Installation](#installation)
1. [Team](#team)
1. [Contributing](#contributing)

## Requirements

- Node 0.12.x
- Postgresql 9.4.x

## Installation:

Running on local machine:

```sh
npm install
npm install -g gulp
gulp
node server/server.js
```

-### Setting up Travis CI   
-   
-1. Navigate to [travis-ci](https://travis-ci.org/) and click Signup or Signin if you already have an account   
-1. Mouseover your Account name on the top right and select Accounts    
-1. Enable the checkbox for 'your_github_username/gitpun'   
-1. Your Travis CI information can be found at https://travis-ci.org/your_github_username/gitpun upon pushing to your repo    

### Setting up your Database

We use PostgreSQL as our RDB.

1. Navigate to [postgressapp](http://postgresapp.com/) and follow the download instructions
1. Open the Postgres App by clicking on the elephant on the top right of your menu bar and selecting open psql
1. Type 'CREATE DATABASE gitpun;' and press enter to create your database
1. Run 'node index.js' or 'nodemon index.js' from the root directory command line
1. The app will navigate to 'postgres://127.0.0.1:5432/gitpun' where 127.0.0.1 is the default localhost and 5432 is the default port

### API Use

If a repository is not in the database, the server will attempt to make a call to the GitHub API to  fetch the repository.

```sh
api/user/:username/repo/:repository_name/
```

Returns a full commit history for the master branch of the repo

```sh
api/user/:username/repo/:repository_name?date=:date
```

Returns a full commit history of a repo's branch (default to master) after a given date

```sh
api/user/:username/repo/:repository_name?data=true
```

Will return the full details of every commit of a repo's branch (default to master)

```sh
api/commit/:commit_id
```

Returns the full details of a commit including lines added and deleted, files changed, and full details about what was changed in the file

## Team

  - __Product Owner__: Dani Hu
  - __Scrum Master__: Devon Harvey
  - __Development Team Members__: Alberto D'Souza, Terry Chan

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
