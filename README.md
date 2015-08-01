# Gitualize

Gitualize allows you to visualize the changes in a GitHub repository.

[gitualize.com](gitualize.com)


## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Installation](#installation)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

* **The Landing Page** provides a step by step walk through with detailed visuals and commentary on how the site works. The search bar will attempt to auto complete any user/ you type into the search bar by listing relevant repositories.
* **The Navbar** leads with our brand name 'Gitualize' which will lead back to the landing page. The Octocat mark on the top right will lead to our GitHub repository.
* **The Directory** contains all the files in a repository at the current commit index. File and Folder icons will reveal whether clicking on one will lead to the File or Folder view.
* **The Playbar** contains several basic buttons. The play button will iterate through all available commits in the forward direction while the backwards button will do so in reverse. The gitualization can be paused at any time with the pause button. The plus and minus button will speed up and slow down the gitualization process. Access to the Diffualizer will be available upon viewing a file.
* **The Path controller** is intialized to the root directory. Clicking on a name in the path will lead to the File view or Folder view depending on whether it's a file or folder.
* **The Folder View** is intialized the root directory like the path. Folders and Files are animated upon creation, modification, renaming, or deletion. Clicking on a file will lead to that file's File view and clicking on a folder will lead to that folder's Folder view.
* **The File View** does not contain any user interaction. While the visualization is happening it will routinely update the file's text showing the commit difference if the file was updated at the current commit. Text that was added will be green while text that was deleted will be red.
* **The Commit View** contains the basic information relevant to the commit. On the left will be an avatar for the committer as well as their name which is a clickable link to their GitHub page. On the right will be the commit message for the current commit.
* **The Diffualizer** is an interactive File view. It can be intitalized from the Playbar. Entering a valid commit ranges will show the difference in the file from commit to commit. Additionally the 'from' field can be left blank. The current commit will be highlighted and entering a valid positive or negative number in the 'to' field will reveal the difference from the range of '-to' to the current commit or the current commit to 'to'.

## Requirements

- Node 0.12.x
- Postgresql 9.4.x

## Installation:

Running on local machine:

```sh
npm install
npm install -g gulp
npm install -g casperjs
npm install -g phantomjs
gulp
node server/server.js
```

### Setting up Travis CI   
   
1. Navigate to [travis-ci](https://travis-ci.org/) and click Signup or Signin if you already have an account   
1. Mouseover your Account name on the top right and select Accounts    
1. Enable the checkbox for 'your_github_username/gitpun'   
1. Your Travis CI information can be found at https://travis-ci.org/your_github_username/gitpun upon pushing to your repo    

### Setting up your Database

We use PostgreSQL as our RDB.

1. Navigate to [postgressapp](http://postgresapp.com/) and follow the download instructions
1. Open the Postgres App by clicking on the elephant on the top right of your menu bar and selecting open psql
1. Type 'CREATE DATABASE gitpun;' and press enter to create your database
1. Run 'node index.js' or 'nodemon index.js' from the root directory command line
1. The app will navigate to 'postgres://127.0.0.1:5432/gitpun' where 127.0.0.1 is the default localhost and 5432 is the default port

### API Use

```sh
/auth
```

Redirects to github where GitHub where you will be prompted to authorize gitualize.com to perferform API requests on your behalf to fetch repos when neccessary.

```sh
/getAccessToken
```

The redirect route that GitHub uses upon completeing authorization for API use

### Docker

### AWS

## Team

  - __Product Owner__: Dani Hu
  - __Scrum Master__: Devon Harvey
  - __Development Team Members__: Alberto D'Souza, Terry Chan

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
