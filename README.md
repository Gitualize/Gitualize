# Project Name

> Pithy project description

## Team

  - __Product Owner__: teamMember
  - __Scrum Master__: teamMember
  - __Development Team Members__: teamMember, teamMember

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Some usage instructions

## Requirements

- Node 0.10.x
- Redis 2.6.x
- Postgresql 9.1.x
- etc
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Setting up your Database

We use PostgreSQL as our RDB.

1. Navigate to [postgressapp](http://postgresapp.com/) and follow the download instructions
1. Open the Postgres App by clicking on the elephant on the top right of your menu bar and selecting open psql
1. Type 'CREATE DATABASE gitpun;' and press enter to create your database
1. Run 'node index.js' or 'nodemon index.js' from the root directory command line
1. The app will navigate to 'postgres://127.0.0.1:5432/gitpun' where 127.0.0.1 is the default localhost and 5432 is the default port

### Database Dev Support
![alt tag](http://neverwintervault.org/sites/neverwintervault.org/files/project/2322/images/network-database-icons-1106140601.png)
We've created a schema visualization image with http://ondras.zarovi.cz/sql/demo/

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
