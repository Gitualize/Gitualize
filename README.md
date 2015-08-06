# Gitualize

Gitualize allows you to visualize the changes in a GitHub repository.

[gitualize.com](http://gitualize.com)


## Table of Contents

1. [Usage](#usage)
1. [Requirements](#requirements)
1. [Installation](#installation)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

* **The Landing Page** provides a walk through with visuals on how the site works. The search bar will attempt to auto complete any user/ you type into the search bar by listing their relevant repositories.
* **The Navbar** leads with our brand name 'Gitualize' which will lead back to the landing page. The Octocat mark on the top right will lead to our GitHub repository.
* **The Directory** contains all the files in a repository at the current commit. File and Folder icons will reveal whether clicking on one will lead to the File or Folder view. This dynamically updates as time progresses.
* **The Playbar** contains several basic buttons. The play button will iterate through all available commits in the forward direction while the backwards button will do so in reverse. Currently we fetch at most 1000 commits from Github for each repo as there is an API access limit in effect. The gitualization can be paused at any time with the pause button. The plus and minus button will speed up and slow down playback. Access to the Diffualizer will be available upon viewing a specific file.
* **The Path controller** is intialized to the root directory. Clicking on a name in the path will lead to the File view or Folder view depending on whether it's a file or folder.
* **The Folder View** is intialized in the root directory like the path. Folders and Files are animated upon creation, modification, renaming, or deletion. Clicking on a file will lead to the file view and clicking a folder will step inside another folder view.
* **The File View** While the visualization is happening it will routinely update the file's text showing the commit difference if the file was updated at the current commit. Code that was added will be green while code that was deleted will be red.
* **The Commit View** contains the basic information relevant to the commit. On the left is an avatar and name for the committer linked to their GitHub page. On the right is the current commit message.
* **The Diffualizer** is an interactive File view. Entering two valid commit indices will show the difference between them. The 'from' field can be left blank. The current commit will be highlighted and entering a valid positive or negative number in the 'to' field will reveal the difference from the range of '-to' to the current commit or the current commit to 'to'.

## Requirements

- Node 0.12.x
- Postgresql 9.4.x

## Installation:

Running on local machine:
see below for database setup instructions. then:

```sh
npm install -g gulp && npm install -g casperjs && npm install -g phantomjs
npm install
gulp
node server/server.js
```

### Setting up Travis CI

1. Navigate to [travis-ci](https://travis-ci.org/) and click Signup or Signin if you already have an account
1. Mouseover your Account name on the top right and select Accounts
1. Enable the checkbox for 'your_github_username/gitualize'
1. Your Travis CI information can be found at https://travis-ci.org/your_github_username/gitualize upon pushing to your repo

### Setting up your Database

We use PostgreSQL as our RDB.

1. `brew install postgres`
1. open postgres via `psql`
1. run `create database gitualize;`
1. The app will navigate to 'postgres://127.0.0.1:5432/gitualize' when you start the server

### Github OAuth

```sh
/auth
```

Redirects to github where GitHub where you will be prompted to authorize gitualize.com to perform API requests on your behalf to fetch repos when neccessary. This is done by the client.

```sh
/getAccessToken
```

The redirect route on our server that GitHub uses upon completing authorization for API use. This redirects back to the client page with the correct access token.

### Deployment

We use two docker containers on AWS, one houses our DB and the other our server.

## Team

  - __Product Owner__: Dani Hu
  - __Scrum Master__: Devon Harvey
  - __Development Team Members__: Alberto D'Souza, Terry Chan

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
