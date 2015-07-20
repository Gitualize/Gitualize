var React = require('react');
var Navigation = require('react-router').Navigation;
var $ = require('jquery');
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;

var Path = require('./path.react.jsx');
var Directory = require('./directory.react.jsx');
var File = require('./file.react.jsx');
var Folder = require('./folder.react.jsx');
var Playbar = require('./playbar.react.jsx');
var Tree = require('../fileTreeUtils');

var Visualize = React.createClass({
  mixins : [Navigation],
  getInitialTree: function () {
    var firstSha = this.state.commits[this.state.commits.length-1].sha;
    var repoFullName = this.props.params.repoOwner + '/' + this.props.params.repoName;
    $.getJSON('repos/'+repoFullName+'/trees/'+firstSha, {accessToken: this.props.query.accessToken})
    .success(function(tree) {
      if (tree.msg === 'truncated') { //shouldn't happen much
        this.transitionTo('/');
        return console.log('Tree is too big, please try another repo.');
      }
      console.log('initial tree: ', tree);
      this.setState({initialTree: tree});
    }.bind(this));
    //var tree = $.getJSON('tree/'+firstSha,{accessToken: this.props.query.accessToken});
  },
  getCommitsThenInitialTree: function () {
    //console.log('accessToken now: ', this.props.query.accessToken);
    var repoFullName = this.props.params.repoOwner + '/' + this.props.params.repoName;
    $.getJSON('repos/'+repoFullName+'/commits', {accessToken: this.props.query.accessToken})
    .success(function(commits) {
      if (commits.msg === 'auth required') {
        window.location = commits.authUrl; //transitionTo doesn't work for external urls
      }
      //if (commits.msg === 'accessToken required') {
        //$.getJSON(commits.authUrl
        //window.location = commits.authUrl; //transitionTo doesn't work for external urls
        //return;
      //}
      this.setState({commits: commits});
      this.getInitialTree();
    }.bind(this));
  },

  getCurrentCommit: function () {
    var repoFullName = this.props.params.repoName + '/' + this.props.params.repoOwner;
    //var sha = this.state.commits[this.state.commitIndex].sha;
    this.setState({currentCommit: this.state.commits[this.state.commitIndex]});
    //$.getJSON('/repos/' + fullRepoName + '/commits/' + sha, function(commit) {
      //this.setState({currentCommit: commit});
    //}.bind(this));
  },

  addFile: function (filePath) {
    return Tree.addFile(this.state.fileTree, filePath);
  },

  removeFile: function (filePath) {
    Tree.removeFile(this.state.fileTree, filePath);
  },

  componentDidMount: function() {
    this.getCommitsThenInitialTree();
    var files = this.state.currentCommit.files;
    for (var i = 0; i < files.length; i++) {
      this.addFile(files[i].filename);
    }
  },

  updateCommitIndex: function (index) {
    this.setState({commitIndex: index});
  },

  updateCurrentPath: function (path) {
    this.setState({currentPath: path});
  },

  getInitialState: function() {
    return {commits: [], commitIndex: 0, currentCommit: fred, currentPath: ['client', 'app', 'auth'], fileTree: {}};
  },

  render: function () {
    
    return (
      <Grid>
        <Row className='show-grid'>
          <Col xs=12 md=12>
            <Path currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
          </Col>
        </Row>

        <Row className='show-grid'>
          <Col xs=4 md=4>
            <Directory fileTree={this.state.fileTree} currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
          </Col>
          <Col xs=8 md=8>
            <Folder currentCommit={this.state.currentCommit} currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
            {this.state.commits}
          </Col>
        </Row>

        <Row className='show-grid'>
          <Col xs=12 md=12>
            <Playbar numberOfCommits={this.state.commits.length} commitIndex={this.state.commitIndex} updateCommitIndex={this.updateCommitIndex}/>
          </Col>
        </Row>
      </Grid>
    )
  }
});

var fred = {
  "sha": "15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
  "commit": {
    "author": {
      "name": "Fred Zirdung",
      "email": "fred@hackreactor.com",
      "date": "2015-06-12T17:50:31Z"
    },
    "committer": {
      "name": "Fred Zirdung",
      "email": "fred@hackreactor.com",
      "date": "2015-06-12T17:50:31Z"
    },
    "message": "Initial commit",
    "tree": {
      "sha": "b9b0b5c191ad1b222c57449223ed19b569bb79d5",
      "url": "https://api.github.com/repos/devonharvey/Bookle/git/trees/b9b0b5c191ad1b222c57449223ed19b569bb79d5"
    },
    "url": "https://api.github.com/repos/devonharvey/Bookle/git/commits/15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
    "comment_count": 0
  },
  "url": "https://api.github.com/repos/devonharvey/Bookle/commits/15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
  "html_url": "https://github.com/devonharvey/Bookle/commit/15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
  "comments_url": "https://api.github.com/repos/devonharvey/Bookle/commits/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/comments",
  "author": {
    "login": "fredx",
    "id": 99825,
    "avatar_url": "https://avatars.githubusercontent.com/u/99825?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/fredx",
    "html_url": "https://github.com/fredx",
    "followers_url": "https://api.github.com/users/fredx/followers",
    "following_url": "https://api.github.com/users/fredx/following{/other_user}",
    "gists_url": "https://api.github.com/users/fredx/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/fredx/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/fredx/subscriptions",
    "organizations_url": "https://api.github.com/users/fredx/orgs",
    "repos_url": "https://api.github.com/users/fredx/repos",
    "events_url": "https://api.github.com/users/fredx/events{/privacy}",
    "received_events_url": "https://api.github.com/users/fredx/received_events",
    "type": "User",
    "site_admin": false
  },
  "committer": {
    "login": "fredx",
    "id": 99825,
    "avatar_url": "https://avatars.githubusercontent.com/u/99825?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/fredx",
    "html_url": "https://github.com/fredx",
    "followers_url": "https://api.github.com/users/fredx/followers",
    "following_url": "https://api.github.com/users/fredx/following{/other_user}",
    "gists_url": "https://api.github.com/users/fredx/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/fredx/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/fredx/subscriptions",
    "organizations_url": "https://api.github.com/users/fredx/orgs",
    "repos_url": "https://api.github.com/users/fredx/repos",
    "events_url": "https://api.github.com/users/fredx/events{/privacy}",
    "received_events_url": "https://api.github.com/users/fredx/received_events",
    "type": "User",
    "site_admin": false
  },
  "parents": [

  ],
  "stats": {
    "total": 1153,
    "additions": 1153,
    "deletions": 0
  },
  "files": [
    {
      "sha": "81b3435369d9c212af9ccdb7ee4c1f7927abc82b",
      "filename": ".bowerrc",
      "status": "added",
      "additions": 3,
      "deletions": 0,
      "changes": 3,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/.bowerrc",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/.bowerrc",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/.bowerrc?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,3 @@\n+{\n+  \"directory\": \"client/lib\"\n+}"
    },
    {
      "sha": "ac360e55913a01c7959697fc2629ff202ff27009",
      "filename": ".gitignore",
      "status": "added",
      "additions": 25,
      "deletions": 0,
      "changes": 25,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/.gitignore",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/.gitignore",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/.gitignore?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,25 @@\n+.DS_Store\n+.AppleDouble\n+.LSOverride\n+azure.err\n+iisnode.yml\n+\n+# Icon must ends with two \\r.\n+Icon\n+\n+\n+# Thumbnails\n+._*\n+\n+# Files that might appear on external disk\n+.Spotlight-V100\n+.Trashes\n+node_modules/\n+db/\n+client/lib\n+\n+# Floobits\n+.floo\n+.floobit\n+.floo\n+.flooignore"
    },
    {
      "sha": "2215bd1acd87e0295e7dbea8f8827d0bdaec2049",
      "filename": "Gulpfile.js",
      "status": "added",
      "additions": 43,
      "deletions": 0,
      "changes": 43,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/Gulpfile.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/Gulpfile.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/Gulpfile.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,43 @@\n+'use strict';\n+\n+var gulp      = require('gulp'),\n+    nodemon   = require('gulp-nodemon'),\n+    bs        = require('browser-sync'),\n+    reload    = bs.reload,\n+    when      = require('gulp-if'),\n+    shell     = require('gulp-shell');\n+\n+\n+// the paths to our app files\n+var paths = {\n+  // all our client app js files, not including 3rd party js files\n+  scripts: ['client/app/**/*.js'],\n+  html: ['client/app/**/*.html', 'client/index.html'],\n+  styles: ['client/styles/style.css'],\n+  test: ['specs/**/*.js']\n+};\n+\n+// any changes made to your\n+// client side code will automagically refresh your page\n+// with the new changes\n+gulp.task('start', ['serve'],function () {\n+  bs({\n+    notify: true,\n+    // address for server,\n+    injectChanges: true,\n+    files: paths.scripts.concat(paths.html, paths.styles),\n+    proxy: 'localhost:8000'\n+  });\n+});\n+\n+gulp.task('karma', shell.task([\n+  'karma start'\n+]));\n+\n+// start our node server using nodemon\n+gulp.task('serve', function() {\n+  nodemon({script: 'index.js', ignore: 'node_modules/**/*.js'});\n+});\n+\n+gulp.task('default', ['start']);\n+"
    },
    {
      "sha": "dcecc4c3507d38eb82577deb4cd455ab3c0b8937",
      "filename": "bower.json",
      "status": "added",
      "additions": 17,
      "deletions": 0,
      "changes": 17,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/bower.json",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/bower.json",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/bower.json?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,17 @@\n+{\n+  \"name\": \"shortly-angular\",\n+  \"version\": \"0.0.0\",\n+  \"authors\": [],\n+  \"license\": \"MIT\",\n+  \"ignore\": [\n+    \"**/.*\",\n+    \"node_modules\",\n+    \"bower_components\",\n+    \"client/lib\"\n+  ],\n+  \"dependencies\": {\n+    \"angular\": \"~1.2.18\",\n+    \"angular-route\": \"~1.2.18\",\n+    \"angular-mocks\": \"~1.2.18\"\n+  }\n+}"
    },
    {
      "sha": "f348f5ff7dab023e3a791b0ad3219135de099da5",
      "filename": "client/app/app.js",
      "status": "added",
      "additions": 54,
      "deletions": 0,
      "changes": 54,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/app.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/app.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/app/app.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,54 @@\n+angular.module('shortly', [\n+  'shortly.services',\n+  'shortly.links',\n+  'shortly.shorten',\n+  'shortly.auth',\n+  'ngRoute'\n+])\n+.config(function($routeProvider, $httpProvider) {\n+  $routeProvider\n+    .when('/signin', {\n+      templateUrl: 'app/auth/signin.html',\n+      controller: 'AuthController'\n+    })\n+    .when('/signup', {\n+      templateUrl: 'app/auth/signup.html',\n+      controller: 'AuthController'\n+    })\n+    // Your code here\n+\n+    // We add our $httpInterceptor into the array\n+    // of interceptors. Think of it like middleware for your ajax calls\n+    $httpProvider.interceptors.push('AttachTokens');\n+})\n+.factory('AttachTokens', function ($window) {\n+  // this is an $httpInterceptor\n+  // its job is to stop all out going request\n+  // then look in local storage and find the user's token\n+  // then add it to the header so the server can validate the request\n+  var attach = {\n+    request: function (object) {\n+      var jwt = $window.localStorage.getItem('com.shortly');\n+      if (jwt) {\n+        object.headers['x-access-token'] = jwt;\n+      }\n+      object.headers['Allow-Control-Allow-Origin'] = '*';\n+      return object;\n+    }\n+  };\n+  return attach;\n+})\n+.run(function ($rootScope, $location, Auth) {\n+  // here inside the run phase of angular, our services and controllers\n+  // have just been registered and our app is ready\n+  // however, we want to make sure the user is authorized\n+  // we listen for when angular is trying to change routes\n+  // when it does change routes, we then look for the token in localstorage\n+  // and send that token to the server to see if it is a real user or hasn't expired\n+  // if it's not valid, we then redirect back to signin/signup\n+  $rootScope.$on('$routeChangeStart', function (evt, next, current) {\n+    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {\n+      $location.path('/signin');\n+    }\n+  });\n+});"
    },
    {
      "sha": "9b995df05b80efe67ee97ad93564f3c3e7b801ee",
      "filename": "client/app/auth/auth.js",
      "status": "added",
      "additions": 30,
      "deletions": 0,
      "changes": 30,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/auth/auth.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/auth/auth.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/app/auth/auth.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,30 @@\n+// do not tamper with this code in here, study it, but do not touch\n+// this Auth controller is responsible for our client side authentication\n+// in our signup/signin forms using the injected Auth service\n+angular.module('shortly.auth', [])\n+\n+.controller('AuthController', function ($scope, $window, $location, Auth) {\n+  $scope.user = {};\n+\n+  $scope.signin = function () {\n+    Auth.signin($scope.user)\n+      .then(function (token) {\n+        $window.localStorage.setItem('com.shortly', token);\n+        $location.path('/links');\n+      })\n+      .catch(function (error) {\n+        console.error(error);\n+      });\n+  };\n+\n+  $scope.signup = function () {\n+    Auth.signup($scope.user)\n+      .then(function (token) {\n+        $window.localStorage.setItem('com.shortly', token);\n+        $location.path('/links');\n+      })\n+      .catch(function (error) {\n+        console.error(error);\n+      });\n+  };\n+});"
    },
    {
      "sha": "b6f66b4598ca3ecc5163480cc2bb3bbf1e3ee77e",
      "filename": "client/app/auth/signin.html",
      "status": "added",
      "additions": 9,
      "deletions": 0,
      "changes": 9,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/auth/signin.html",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/auth/signin.html",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/app/auth/signin.html?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,9 @@\n+<div id='signin'>\n+  <h1>signin</h1>\n+  <form name=\"signinForm\" ng-submit='signin()'>\n+    <input type='text'ng-model='user.username'>\n+    <input type=\"password\" ng-model='user.password'>\n+    <button>signin</button>\n+  </form>\n+  <a href=\"#/signup\">Don't have an account? <strong>Signup</strong> ...</a>\n+</div>"
    },
    {
      "sha": "3c8642f30f967d1a0cfa819213a78c7a514e4fba",
      "filename": "client/app/auth/signup.html",
      "status": "added",
      "additions": 9,
      "deletions": 0,
      "changes": 9,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/auth/signup.html",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/auth/signup.html",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/app/auth/signup.html?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,9 @@\n+<div id='signup'>\n+  <h1>signup</h1>\n+  <form name=\"signupForm\" ng-submit='signup()'>\n+    <input type='text' ng-model='user.username'>\n+    <input type=\"password\" ng-model='user.password'>\n+    <button>signup</button>\n+  </form>\n+  <a href=\"#/signin\">Already have an account? <strong>Signin</strong> ...</a>\n+</div>"
    },
    {
      "sha": "292aa200863bf40a3d492f34677d45ef9cba7c6f",
      "filename": "client/app/links/links.html",
      "status": "added",
      "additions": 3,
      "deletions": 0,
      "changes": 3,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/links/links.html",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/links/links.html",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/app/links/links.html?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,3 @@\n+<div id='container'>\n+  <!-- Your html here -->\n+</div>"
    },
    {
      "sha": "209d58c74447ba05cb162b9aed1f41f04ca4b185",
      "filename": "client/app/links/links.js",
      "status": "added",
      "additions": 5,
      "deletions": 0,
      "changes": 5,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/links/links.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/links/links.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/app/links/links.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,5 @@\n+angular.module('shortly.links', [])\n+\n+.controller('LinksController', function ($scope, Links) {\n+  // Your code here\n+});"
    },
    {
      "sha": "3f63cf85aade8274248161b2d8254b1021e2c587",
      "filename": "client/app/services/services.js",
      "status": "added",
      "additions": 52,
      "deletions": 0,
      "changes": 52,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/services/services.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/services/services.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/app/services/services.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,52 @@\n+angular.module('shortly.services', [])\n+\n+.factory('Links', function ($http) {\n+  // Your code here\n+})\n+.factory('Auth', function ($http, $location, $window) {\n+  // Don't touch this Auth service!!!\n+  // it is responsible for authenticating our user\n+  // by exchanging the user's username and password\n+  // for a JWT from the server\n+  // that JWT is then stored in localStorage as 'com.shortly'\n+  // after you signin/signup open devtools, click resources,\n+  // then localStorage and you'll see your token from the server\n+  var signin = function (user) {\n+    return $http({\n+      method: 'POST',\n+      url: '/api/users/signin',\n+      data: user\n+    })\n+    .then(function (resp) {\n+      return resp.data.token;\n+    });\n+  };\n+\n+  var signup = function (user) {\n+    return $http({\n+      method: 'POST',\n+      url: '/api/users/signup',\n+      data: user\n+    })\n+    .then(function (resp) {\n+      return resp.data.token;\n+    });\n+  };\n+\n+  var isAuth = function () {\n+    return !!$window.localStorage.getItem('com.shortly');\n+  };\n+\n+  var signout = function () {\n+    $window.localStorage.removeItem('com.shortly');\n+    $location.path('/signin');\n+  };\n+\n+\n+  return {\n+    signin: signin,\n+    signup: signup,\n+    isAuth: isAuth,\n+    signout: signout\n+  };\n+});"
    },
    {
      "sha": "adfcf77cf75848b7d10f112e50435bf4cf612960",
      "filename": "client/app/shorten/shorten.html",
      "status": "added",
      "additions": 6,
      "deletions": 0,
      "changes": 6,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/shorten/shorten.html",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/shorten/shorten.html",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/app/shorten/shorten.html?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,6 @@\n+<div id='container'>\n+<!-- Your code here -->\n+\n+</div>\n+\n+"
    },
    {
      "sha": "7add9bbdbb47b5755e34ebeb2151af94dec9005c",
      "filename": "client/app/shorten/shorten.js",
      "status": "added",
      "additions": 5,
      "deletions": 0,
      "changes": 5,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/shorten/shorten.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/app/shorten/shorten.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/app/shorten/shorten.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,5 @@\n+angular.module('shortly.shorten', [])\n+\n+.controller('ShortenController', function ($scope, $location, Links) {\n+  // Your code here\n+});"
    },
    {
      "sha": "fb575ba1b5ff24f9b1b2338448558b1025233ac9",
      "filename": "client/assets/redirect_icon.png",
      "status": "added",
      "additions": 0,
      "deletions": 0,
      "changes": 0,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/assets/redirect_icon.png",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/assets/redirect_icon.png",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/assets/redirect_icon.png?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf"
    },
    {
      "sha": "8017cf61550b60738875dccdbad768477acc26cb",
      "filename": "client/assets/spiffygif_46x46.gif",
      "status": "added",
      "additions": 0,
      "deletions": 0,
      "changes": 0,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/assets/spiffygif_46x46.gif",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/assets/spiffygif_46x46.gif",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/assets/spiffygif_46x46.gif?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf"
    },
    {
      "sha": "f94018636214e2b6fde8c8050d7c9ba082282f96",
      "filename": "client/index.html",
      "status": "added",
      "additions": 23,
      "deletions": 0,
      "changes": 23,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/index.html",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/index.html",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/index.html?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,23 @@\n+<!DOCTYPE html>\n+<html ng-app='shortly'>\n+  <head>\n+    <meta charset=\"utf-8\" />\n+    <title>Shortly</title>\n+    <link rel=\"stylesheet\" type=\"text/css\" href=\"styles/style.css\" />\n+  </head>\n+  <body>\n+    <h1>Shortly</h1>\n+\n+    <!-- the ng-view directive is where our templates will be loaded into when naviagted to -->\n+    <div ng-view></div>\n+\n+    <script src=\"lib/angular/angular.js\"></script>\n+    <script src=\"lib/angular-route/angular-route.js\"></script>\n+\n+    <script src=\"app/auth/auth.js\"></script>\n+    <script src=\"app/links/links.js\"></script>\n+    <script src=\"app/shorten/shorten.js\"></script>\n+    <script src=\"app/services/services.js\"></script>\n+    <script src=\"app/app.js\"></script>\n+  </body>\n+</html>"
    },
    {
      "sha": "6f27e02c6c37113bb316513c1f30a63f1658aeb9",
      "filename": "client/styles/style.css",
      "status": "added",
      "additions": 148,
      "deletions": 0,
      "changes": 148,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/styles/style.css",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/client/styles/style.css",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/client/styles/style.css?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,148 @@\n+body {\n+  margin: 0;\n+  margin-top: 10px;\n+  font-family: arial, sans-serif;\n+}\n+\n+a {\n+  color: #333;\n+  font-size: 14px;\n+  text-decoration: none;\n+}\n+\n+h1 {\n+  font-style: italic;\n+  margin-bottom: 10px;\n+}\n+\n+.navigation {\n+  width: 100%;\n+  height: 40px;\n+  background-color: #eee;\n+}\n+\n+.navigation ul {\n+  margin: 0;\n+  padding: 0;\n+  list-style: none;\n+}\n+\n+.navigation li {\n+  float: left;\n+}\n+\n+.navigation li a {\n+  width: 100px;\n+  height: 20px;\n+  line-height: 20px;\n+  padding: 10px;\n+  display: block;\n+  text-align: center;\n+}\n+\n+.navigation li a:hover {\n+  background-color: #ddd;\n+}\n+\n+.navigation li a.selected {\n+  background-color: #ccc;\n+}\n+\n+#container {\n+  clear: both;\n+  margin-top: 10px;\n+}\n+\n+.link {\n+  clear: both;\n+  margin-bottom: 5px;\n+  padding: 5px;\n+  min-height: 50px;\n+}\n+\n+.link:hover {\n+  background-color: #efe;\n+}\n+\n+.link img {\n+  float: left;\n+  margin: 0 5px;\n+}\n+\n+.link .visits {\n+  float: right;\n+  margin-right: 10px;\n+  margin-left: 20px;\n+}\n+\n+.link .visits .count {\n+  font-size: 46px;\n+  font-weight: 600;\n+}\n+\n+.link .title {\n+  font-weight: 600;\n+}\n+\n+.link .original {\n+  color: #aaa;\n+  font-size: 12px;\n+}\n+\n+.link .info {\n+  margin-left: 55px;\n+}\n+\n+form {\n+  margin: 10px;\n+}\n+\n+input {\n+  width: 360px;\n+  display: block;\n+  font-size: 13px;\n+  padding: 5px;\n+  margin-bottom: 5px;\n+}\n+\n+input[type=url] {\n+  display: inline\n+}\n+\n+input[type=url]:focus {\n+  outline: none;\n+}\n+\n+\n+.error {\n+  border: red solid 4px;\n+  padding: 10px;\n+  margin: 0 10px;\n+}\n+\n+.clean {\n+  border: #efe solid 2px;\n+  padding: 10px;\n+  margin: 0 10px;\n+}\n+\n+.creator {\n+  height: 50px;\n+}\n+\n+.creator form {\n+  float: left;\n+  height: 80px;\n+}\n+\n+.creator img.spinner {\n+  height: 46px;\n+  margin-bottom: 5px;\n+  padding: 10px;\n+  display: none;\n+}\n+\n+.creator .message {\n+  clear: both;\n+}\n+"
    },
    {
      "sha": "c51307b176419064d2dffb7969c1a5053a5766b6",
      "filename": "index.js",
      "status": "added",
      "additions": 3,
      "deletions": 0,
      "changes": 3,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/index.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/index.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/index.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,3 @@\n+var app = require('./server/server.js');\n+\n+app.listen(8000);"
    },
    {
      "sha": "59216a1272c2653f706b932a921de3a0da751407",
      "filename": "karma.conf.js",
      "status": "added",
      "additions": 76,
      "deletions": 0,
      "changes": 76,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/karma.conf.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/karma.conf.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/karma.conf.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,76 @@\n+// Karma configuration\n+// Generated on Mon Jun 30 2014 19:35:20 GMT-0700 (PDT)\n+\n+module.exports = function(config) {\n+  config.set({\n+\n+    // base path that will be used to resolve all patterns (eg. files, exclude)\n+    basePath: '',\n+\n+\n+    // frameworks to use\n+    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter\n+    frameworks: ['jasmine'],\n+\n+\n+    // list of files / patterns to load in the browser\n+    files: [\n+      // angular source\n+      'client/lib/angular/angular.js',\n+      'client/lib/angular-route/angular-route.js',\n+      'client/lib/angular-mocks/angular-mocks.js',\n+\n+      // our app code\n+      'client/app/**/*.js',\n+\n+      // our spec files\n+      'node_modules/expect.js/index.js',\n+      'specs/client/**/*.js'\n+    ],\n+\n+\n+    // list of files to exclude\n+    exclude: [\n+        'karma.conf.js'\n+    ],\n+\n+\n+    // preprocess matching files before serving them to the browser\n+    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor\n+    preprocessors: {\n+\n+    },\n+\n+\n+    // test results reporter to use\n+    // possible values: 'dots', 'progress'\n+    // available reporters: https://npmjs.org/browse/keyword/karma-reporter\n+    reporters: ['nyan','unicorn'],\n+\n+\n+    // web server port\n+    port: 9876,\n+\n+\n+    // enable / disable colors in the output (reporters and logs)\n+    colors: true,\n+\n+\n+    // level of logging\n+    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG\n+    logLevel: config.LOG_INFO,\n+\n+\n+    // enable / disable watching file and executing tests whenever any file changes\n+    autoWatch: false,\n+\n+\n+    // start these browsers\n+    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher\n+    browsers: ['Chrome'],\n+\n+    // Continuous Integration mode\n+    // if true, Karma captures browsers, runs the tests and exits\n+    singleRun: true\n+  });\n+};"
    },
    {
      "sha": "b238daa5b3f1f41b3dd9e4ae324de49f6b15377d",
      "filename": "package.json",
      "status": "added",
      "additions": 45,
      "deletions": 0,
      "changes": 45,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/package.json",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/package.json",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/package.json?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,45 @@\n+{\n+  \"name\": \"shortly-angular\",\n+  \"version\": \"0.0.0\",\n+  \"description\": \"\",\n+  \"main\": \"app.js\",\n+  \"scripts\": {\n+    \"test\": \"karma start --browsers PhantomJS\"\n+  },\n+  \"author\": \"\",\n+  \"license\": \"ISC\",\n+  \"devDependencies\": {\n+    \"browser-sync\": \"^1.5.7\",\n+    \"clone-stats\": \"0.0.1\",\n+    \"expect.js\": \"^0.3.1\",\n+    \"gulp\": \"^3.8.5\",\n+    \"gulp-if\": \"^1.2.5\",\n+    \"gulp-jshint\": \"^1.6.3\",\n+    \"gulp-karma\": \"0.0.4\",\n+    \"gulp-nodemon\": \"^1.0.4\",\n+    \"gulp-shell\": \"^0.2.7\",\n+    \"jshint-stylish\": \"^0.2.0\",\n+    \"karma\": \"^0.12.16\",\n+    \"karma-chrome-launcher\": \"^0.1.4\",\n+    \"karma-cli\": \"0.0.4\",\n+    \"karma-jasmine\": \"^0.1.5\",\n+    \"karma-mocha\": \"^0.1.4\",\n+    \"karma-nested-reporter\": \"^0.1.1\",\n+    \"karma-nyan-reporter\": \"0.0.43\",\n+    \"karma-phantomjs-launcher\": \"^0.1.4\",\n+    \"karma-unicorn-reporter\": \"^0.1.4\",\n+    \"mocha\": \"^1.20.1\"\n+  },\n+  \"dependencies\": {\n+    \"bcrypt-nodejs\": \"0.0.3\",\n+    \"body-parser\": \"^1.4.3\",\n+    \"express\": \"^4.4.5\",\n+    \"jwt-simple\": \"^0.2.0\",\n+    \"mongoose\": \"^3.8.12\",\n+    \"morgan\": \"^1.1.1\",\n+    \"passport\": \"^0.2.0\",\n+    \"passport-local\": \"^1.0.0\",\n+    \"q\": \"^1.0.1\",\n+    \"request\": \"^2.36.0\"\n+  }\n+}"
    },
    {
      "sha": "a016354cd5f9df31dd5f6442abb03ac75a58c9ad",
      "filename": "server/config/helpers.js",
      "status": "added",
      "additions": 36,
      "deletions": 0,
      "changes": 36,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/config/helpers.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/config/helpers.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/server/config/helpers.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,36 @@\n+var jwt  = require('jwt-simple');\n+\n+module.exports = {\n+  errorLogger: function (error, req, res, next) {\n+    // log the error then send it to the next middleware in\n+    // middleware.js\n+\n+    console.error(error.stack);\n+    next(error);\n+  },\n+  errorHandler: function (error, req, res, next) {\n+    // send error message to client\n+    // message for gracefull error handling on app\n+    res.send(500, {error: error.message});\n+  },\n+\n+  decode: function (req, res, next) {\n+    var token = req.headers['x-access-token'];\n+    var user;\n+\n+    if (!token) {\n+      return res.send(403); // send forbidden if a token is not provided\n+    }\n+\n+    try {\n+      // decode token and attach user to the request\n+      // for use inside our controllers\n+      user = jwt.decode(token, 'secret');\n+      req.user = user;\n+      next();\n+    } catch(error) {\n+      return next(error);\n+    }\n+\n+  }\n+};"
    },
    {
      "sha": "08fdd405afb553abee95ffb2f0cd157936728f72",
      "filename": "server/config/middleware.js",
      "status": "added",
      "additions": 28,
      "deletions": 0,
      "changes": 28,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/config/middleware.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/config/middleware.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/server/config/middleware.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,28 @@\n+var morgan      = require('morgan'), // used for logging incoming request\n+    bodyParser  = require('body-parser'),\n+    helpers     = require('./helpers.js'); // our custom middleware\n+\n+\n+module.exports = function (app, express) {\n+  // Express 4 allows us to use multiple routers with their own configurations\n+  var userRouter = express.Router();\n+  var linkRouter = express.Router();\n+\n+  app.use(morgan('dev'));\n+  app.use(bodyParser.urlencoded({extended: true}));\n+  app.use(bodyParser.json());\n+  app.use(express.static(__dirname + '/../../client'));\n+\n+\n+  app.use('/api/users', userRouter); // use user router for all user request\n+\n+  // authentication middleware used to decode token and made available on the request\n+  //app.use('/api/links', helpers.decode);\n+  app.use('/api/links', linkRouter); // user link router for link request\n+  app.use(helpers.errorLogger);\n+  app.use(helpers.errorHandler);\n+\n+  // inject our routers into their respective route files\n+  require('../users/userRoutes.js')(userRouter);\n+  require('../links/linkRoutes.js')(linkRouter);\n+};"
    },
    {
      "sha": "06aff7d7b1506d4eda4902c831a2803b27bc3dec",
      "filename": "server/config/utils.js",
      "status": "added",
      "additions": 26,
      "deletions": 0,
      "changes": 26,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/config/utils.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/config/utils.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/server/config/utils.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,26 @@\n+var request = require('request'),\n+    Q       = require('q'),\n+    rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\\/\\/)?(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:\\/[^\\s]*)?$/i;\n+\n+\n+module.exports = {\n+  getUrlTitle: function(url) {\n+    var defer = Q.defer();\n+    request(url, function(err, res, html) {\n+      if (err) {\n+        defer.reject(err);\n+      } else {\n+        var tag = /<title>(.*)<\\/title>/;\n+        var match = html.match(tag);\n+        var title = match ? match[1] : url;\n+        defer.resolve(title);\n+      }\n+    });\n+    return defer.promise;\n+  },\n+\n+  isValidUrl: function(url) {\n+    return url.match(rValidUrl);\n+  }\n+};\n+"
    },
    {
      "sha": "9dd9f175a099d94ef5297c194efc5e8e38d2fa62",
      "filename": "server/links/linkController.js",
      "status": "added",
      "additions": 86,
      "deletions": 0,
      "changes": 86,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/links/linkController.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/links/linkController.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/server/links/linkController.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,86 @@\n+var Link    = require('./linkModel.js'),\n+    Q       = require('q'),\n+    util    = require('../config/utils.js');\n+\n+\n+module.exports = {\n+  findUrl: function (req, res, next, code) {\n+    var findLink = Q.nbind(Link.findOne, Link);\n+    findLink({code: code})\n+      .then(function (link) {\n+        if (link) {\n+          req.navLink = link;\n+          next();\n+        } else {\n+          next(new Error('Link not added yet'));\n+        }\n+      })\n+      .fail(function (error) {\n+        next(error);\n+      });\n+  },\n+\n+  allLinks: function (req, res, next) {\n+  var findAll = Q.nbind(Link.find, Link);\n+\n+  findAll({})\n+    .then(function (links) {\n+      res.json(links);\n+    })\n+    .fail(function (error) {\n+      next(error);\n+    });\n+  },\n+\n+  newLink: function (req, res, next) {\n+    var url = req.body.url;\n+    console.log(req.body);\n+    if (!util.isValidUrl(url)) {\n+      return next(new Error('Not a valid url'));\n+    }\n+\n+    var createLink = Q.nbind(Link.create, Link);\n+    var findLink = Q.nbind(Link.findOne, Link);\n+\n+    findLink({url: url})\n+      .then(function (match) {\n+        if (match) {\n+          res.send(match);\n+        } else {\n+          return  util.getUrlTitle(url);\n+        }\n+      })\n+      .then(function (title) {\n+        if (title) {\n+          var newLink = {\n+            url: url,\n+            visits: 0,\n+            base_url: req.headers.origin,\n+            title: title\n+          };\n+          return createLink(newLink);\n+        }\n+      })\n+      .then(function (createdLink) {\n+        if (createdLink) {\n+          res.json(createdLink);\n+        }\n+      })\n+      .fail(function (error) {\n+        next(error);\n+      });\n+  },\n+\n+  navToLink: function (req, res, next) {\n+    var link = req.navLink;\n+    link.visits++;\n+    link.save(function (err, savedLink) {\n+      if (err) {\n+        next(err);\n+      } else {\n+        res.redirect(savedLink.url);\n+      }\n+    });\n+  }\n+\n+};"
    },
    {
      "sha": "2f10843688eeb39ead32ec308b1d706c83f7e027",
      "filename": "server/links/linkModel.js",
      "status": "added",
      "additions": 25,
      "deletions": 0,
      "changes": 25,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/links/linkModel.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/links/linkModel.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/server/links/linkModel.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,25 @@\n+var mongoose = require('mongoose'),\n+    crypto   = require('crypto');\n+\n+var LinkSchema = new mongoose.Schema({\n+ visits: Number,\n+ link: String,\n+ title: String,\n+ code: String,\n+ base_url: String,\n+ url: String\n+});\n+\n+var createSha = function(url) {\n+  var shasum = crypto.createHash('sha1');\n+  shasum.update(url);\n+  return shasum.digest('hex').slice(0, 5);\n+};\n+\n+LinkSchema.pre('save', function(next){\n+  var code = createSha(this.url);\n+  this.code = code;\n+  next();\n+});\n+\n+module.exports = mongoose.model('Link', LinkSchema);"
    },
    {
      "sha": "c416554747faa49f41c2ff51a7db3a974a448296",
      "filename": "server/links/linkRoutes.js",
      "status": "added",
      "additions": 18,
      "deletions": 0,
      "changes": 18,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/links/linkRoutes.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/links/linkRoutes.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/server/links/linkRoutes.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,18 @@\n+var linksController = require('./linkController.js');\n+\n+module.exports = function (app) {\n+  // app === linkRouter injected from middleware.js\n+\n+  // app.param will hijack any request with a 'code' parameter on in\n+  // like line 16 below. That code will actually be the shortned url\n+  // so the real URL will be pre fetched from mongo and attached to\n+  // req.navLink before it reaches line 16.\n+  app.param('code', linksController.findUrl);\n+\n+  app.route('/')\n+    .get(linksController.allLinks)\n+    .post(linksController.newLink);\n+\n+  app.get('/:code', linksController.navToLink);\n+\n+};"
    },
    {
      "sha": "75727f9d932189128d4ec36bda1bcdcc7f072568",
      "filename": "server/server.js",
      "status": "added",
      "additions": 29,
      "deletions": 0,
      "changes": 29,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/server.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/server.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/server/server.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,29 @@\n+  var express     = require('express'),\n+      mongoose    = require('mongoose');\n+\n+var app = express();\n+\n+mongoose.connect('mongodb://localhost/shortly'); // connect to mongo database named shortly\n+\n+// configure our server with all the middleware and and routing\n+require('./config/middleware.js')(app, express);\n+\n+// export our app for testing and flexibility, required by index.js\n+module.exports = app;\n+\n+\n+/* Walkthrough of the server\n+\n+  Express, mongoose, and our server are initialzed here\n+  Next, we then inject our server and express into our config/middlware.js file for setup\n+    we also exported our server for easy testing, it is then started in index.js\n+\n+  middleware.js requires all epxpress middlware and sets it up\n+  our authentication is set up there as well\n+  we also create individual routers for are two main features, links and users\n+  each feature has it's own folder with a model, controller, and route file\n+    the respective file is requierd in middlware.js and injected with its mini router\n+    that route file then requires the respective controller and sets up all the routes\n+    that controller then requires the respective model and sets up all our endpoints which respond to request\n+\n+*/"
    },
    {
      "sha": "89c4668529a0922430984df2b651a9257ef0c54d",
      "filename": "server/users/userController.js",
      "status": "added",
      "additions": 89,
      "deletions": 0,
      "changes": 89,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/users/userController.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/users/userController.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/server/users/userController.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,89 @@\n+var User = require('./userModel.js'),\n+    Q    = require('q'),\n+    jwt  = require('jwt-simple');\n+\n+module.exports = {\n+  signin: function (req, res, next) {\n+    var username = req.body.username,\n+        password = req.body.password;\n+\n+    var findUser = Q.nbind(User.findOne, User);\n+    findUser({username: username})\n+      .then(function (user) {\n+        if (!user) {\n+          next(new Error('User does not exist'));\n+        } else {\n+          return user.comparePasswords(password)\n+            .then(function(foundUser) {\n+              if (foundUser) {\n+                var token = jwt.encode(user, 'secret');\n+                res.json({token: token});\n+              } else {\n+                return next(new Error('No user'));\n+              }\n+            });\n+        }\n+      })\n+      .fail(function (error) {\n+        next(error);\n+      });\n+  },\n+\n+  signup: function (req, res, next) {\n+    var username  = req.body.username,\n+        password  = req.body.password,\n+        create,\n+        newUser;\n+\n+    var findOne = Q.nbind(User.findOne, User);\n+\n+    // check to see if user already exists\n+    findOne({username: username})\n+      .then(function(user) {\n+        if (user) {\n+          next(new Error('User already exist!'));\n+        } else {\n+          // make a new user if not one\n+          create = Q.nbind(User.create, User);\n+          newUser = {\n+            username: username,\n+            password: password\n+          };\n+          return create(newUser);\n+        }\n+      })\n+      .then(function (user) {\n+        // create token to send back for auth\n+        var token = jwt.encode(user, 'secret');\n+        res.json({token: token});\n+      })\n+      .fail(function (error) {\n+        next(error);\n+      });\n+  },\n+\n+  checkAuth: function (req, res, next) {\n+    // checking to see if the user is authenticated\n+    // grab the token in the header is any\n+    // then decode the token, which we end up being the user object\n+    // check to see if that user exists in the database\n+    var token = req.headers['x-access-token'];\n+    if (!token) {\n+      next(new Error('No token'));\n+    } else {\n+      var user = jwt.decode(token, 'secret');\n+      var findUser = Q.nbind(User.findOne, User);\n+      findUser({username: user.username})\n+        .then(function (foundUser) {\n+          if (foundUser) {\n+            res.send(200);\n+          } else {\n+            res.send(401);\n+          }\n+        })\n+        .fail(function (error) {\n+          next(error);\n+        });\n+    }\n+  }\n+};"
    },
    {
      "sha": "873c424a7e8d75cf7dba94587c989467015ba072",
      "filename": "server/users/userModel.js",
      "status": "added",
      "additions": 62,
      "deletions": 0,
      "changes": 62,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/users/userModel.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/users/userModel.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/server/users/userModel.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,62 @@\n+var mongoose = require('mongoose'),\n+    bcrypt   = require('bcrypt-nodejs'),\n+    Q        = require('q'),\n+    SALT_WORK_FACTOR  = 10;\n+\n+\n+var UserSchema = new mongoose.Schema({\n+  username: {\n+    type: String,\n+    required: true,\n+    unique: true\n+  },\n+\n+  password: {\n+    type: String,\n+    required: true\n+  },\n+  salt: String\n+});\n+\n+UserSchema.methods.comparePasswords = function (candidatePassword) {\n+  var defer = Q.defer();\n+  var savedPassword = this.password;\n+  bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {\n+    if (err) {\n+      defer.reject(err);\n+    } else {\n+      defer.resolve(isMatch);\n+    }\n+  });\n+  return defer.promise;\n+};\n+\n+UserSchema.pre('save', function (next) {\n+  var user = this;\n+\n+  // only hash the password if it has been modified (or is new)\n+  if (!user.isModified('password')) {\n+    return next();\n+  }\n+\n+  // generate a salt\n+  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {\n+    if (err) {\n+      return next(err);\n+    }\n+\n+    // hash the password along with our new salt\n+    bcrypt.hash(user.password, salt, function(err, hash) {\n+      if (err) {\n+        return next(err);\n+      }\n+\n+      // override the cleartext password with the hashed one\n+      user.password = hash;\n+      user.salt = salt;\n+      next();\n+    });\n+  });\n+});\n+\n+module.exports = mongoose.model('users', UserSchema);"
    },
    {
      "sha": "52b0cd77fda6ac83ab198710e01bc87ff67d8337",
      "filename": "server/users/userRoutes.js",
      "status": "added",
      "additions": 10,
      "deletions": 0,
      "changes": 10,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/users/userRoutes.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/server/users/userRoutes.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/server/users/userRoutes.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,10 @@\n+var userController = require('./userController.js');\n+\n+\n+module.exports = function (app) {\n+  // app === userRouter injected from middlware.js\n+\n+  app.post('/signin', userController.signin);\n+  app.post('/signup', userController.signup);\n+  app.get('/signedin', userController.checkAuth);\n+};"
    },
    {
      "sha": "427e122a2eb2a30ecb6d0ae38e1e5d9a468e372d",
      "filename": "specs/client/authControllerSpec.js",
      "status": "added",
      "additions": 65,
      "deletions": 0,
      "changes": 65,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/specs/client/authControllerSpec.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/specs/client/authControllerSpec.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/specs/client/authControllerSpec.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,65 @@\n+describe('AuthController', function () {\n+  var $scope, $rootScope, $location, $window, $httpBackend, createController, Auth;\n+\n+  // using angular mocks, we can inject the injector\n+  // to retrieve our dependencies\n+  beforeEach(module('shortly'));\n+  beforeEach(inject(function($injector) {\n+\n+    // mock out our dependencies\n+    $rootScope = $injector.get('$rootScope');\n+    $location = $injector.get('$location');\n+    $window = $injector.get('$window');\n+    $httpBackend = $injector.get('$httpBackend');\n+    Auth = $injector.get('Auth');\n+    $scope = $rootScope.$new();\n+\n+    var $controller = $injector.get('$controller');\n+\n+    // used to create our AuthController for testing\n+    createController = function () {\n+      return $controller('AuthController', {\n+        $scope: $scope,\n+        $window: $window,\n+        $location: $location,\n+        Auth: Auth\n+      });\n+    };\n+\n+    createController();\n+  }));\n+\n+  afterEach(function() {\n+    $httpBackend.verifyNoOutstandingExpectation();\n+    $httpBackend.verifyNoOutstandingRequest();\n+    $window.localStorage.removeItem('com.shortly');\n+  });\n+\n+  it('should have a signup method', function() {\n+    expect($scope.signup).to.be.a('function');\n+  });\n+\n+  it('should store token in localStorage after signup', function() {\n+    // create a fake JWT for auth\n+    var token = 'sjj232hwjhr3urw90rof';\n+\n+    // make a 'fake' reques to the server, not really going to our server\n+    $httpBackend.expectPOST('/api/users/signup').respond({token: token});\n+    $scope.signup();\n+    $httpBackend.flush();\n+    expect($window.localStorage.getItem('com.shortly')).to.be(token);\n+  });\n+\n+  it('should have a signin method', function() {\n+    expect($scope.signin).to.be.a('function');\n+  });\n+\n+  it('should store token in localStorage after signin', function() {\n+    // create a fake JWT for auth\n+    var token = 'sjj232hwjhr3urw90rof';\n+    $httpBackend.expectPOST('/api/users/signin').respond({token: token});\n+    $scope.signin();\n+    $httpBackend.flush();\n+    expect($window.localStorage.getItem('com.shortly')).to.be(token);\n+  });\n+});"
    },
    {
      "sha": "40663ab08d1e79280fbedd290979145e66f825cc",
      "filename": "specs/client/linksControllerSpecs.js",
      "status": "added",
      "additions": 43,
      "deletions": 0,
      "changes": 43,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/specs/client/linksControllerSpecs.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/specs/client/linksControllerSpecs.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/specs/client/linksControllerSpecs.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,43 @@\n+\"use strict\";\n+\n+describe('LinksController', function () {\n+  var $scope, $rootScope, createController, Links, $httpBackend;\n+\n+  // using angular mocks, we can inject the injector\n+  // to retrieve our dependencies\n+  beforeEach(module('shortly'));\n+  beforeEach(inject(function($injector) {\n+\n+    // mock out our dependencies\n+    $rootScope = $injector.get('$rootScope');\n+    $httpBackend = $injector.get('$httpBackend');\n+    Links = $injector.get('Links');\n+    $scope = $rootScope.$new();\n+\n+    var $controller = $injector.get('$controller');\n+\n+    createController = function () {\n+      return $controller('LinksController', {\n+        $scope: $scope,\n+        Links: Links\n+      });\n+    };\n+  }));\n+\n+  it('should have a data property on the $scope', function() {\n+    createController();\n+    expect($scope.data).to.be.an('object');\n+  });\n+\n+  it('should have a getLinks method on the $scope', function () {\n+    createController();\n+    expect($scope.getLinks).to.be.a('function');\n+  });\n+  it('should call getLinks() when controller is loaded', function () {\n+    var mockLinks = [{},{},{}];\n+    $httpBackend.expectGET(\"/api/links\").respond(mockLinks);\n+    createController();\n+    $httpBackend.flush();\n+    expect($scope.data.links).to.eql(mockLinks);\n+  });\n+});"
    },
    {
      "sha": "5f76fd5c7ed758c12b00849c22dbefbb2d68a1fa",
      "filename": "specs/client/routingSpecs.js",
      "status": "added",
      "additions": 32,
      "deletions": 0,
      "changes": 32,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/specs/client/routingSpecs.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/specs/client/routingSpecs.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/specs/client/routingSpecs.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,32 @@\n+describe('Routing', function () {\n+  var $route;\n+  beforeEach(module('shortly'));\n+\n+  beforeEach(inject(function($injector){\n+    $route = $injector.get('$route');\n+  }));\n+\n+  it('Should have /signup route, template, and controller', function () {\n+    expect($route.routes['/signup']).to.be.ok();\n+    expect($route.routes['/signup'].controller).to.be('AuthController');\n+    expect($route.routes['/signup'].templateUrl).to.be('app/auth/signup.html');\n+  });\n+\n+  it('Should have /signin route, template, and controller', function () {\n+    expect($route.routes['/signin']).to.be.ok();\n+    expect($route.routes['/signin'].controller).to.be('AuthController');\n+    expect($route.routes['/signin'].templateUrl).to.be('app/auth/signin.html');\n+  });\n+\n+  it('Should have /links route, template, and controller', function () {\n+    expect($route.routes['/links']).to.be.ok();\n+    expect($route.routes['/links'].controller).to.be('LinksController');\n+    expect($route.routes['/links'].templateUrl).to.be('app/links/links.html');\n+  });\n+\n+  it('Should have /shorten route, template, and controller', function () {\n+    expect($route.routes['/shorten']).to.be.ok();\n+    expect($route.routes['/shorten'].controller).to.be('ShortenController');\n+    expect($route.routes['/shorten'].templateUrl).to.be('app/shorten/shorten.html');\n+  });\n+});"
    },
    {
      "sha": "e77a9f313298378eed38c582ea7d377be7363371",
      "filename": "specs/client/shortenControllerSpec.js",
      "status": "added",
      "additions": 48,
      "deletions": 0,
      "changes": 48,
      "blob_url": "https://github.com/devonharvey/Bookle/blob/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/specs/client/shortenControllerSpec.js",
      "raw_url": "https://github.com/devonharvey/Bookle/raw/15d7a224383c3db91a024d4d89c6cd954bd3bbdf/specs/client/shortenControllerSpec.js",
      "contents_url": "https://api.github.com/repos/devonharvey/Bookle/contents/specs/client/shortenControllerSpec.js?ref=15d7a224383c3db91a024d4d89c6cd954bd3bbdf",
      "patch": "@@ -0,0 +1,48 @@\n+describe('ShortenController', function () {\n+  var $scope, $rootScope, $location, createController, $httpBackend, Links;\n+\n+  // using angular mocks, we can inject the injector\n+  // to retrieve our dependencies\n+  beforeEach(module('shortly'));\n+  beforeEach(inject(function($injector) {\n+\n+    // mock out our dependencies\n+    $rootScope = $injector.get('$rootScope');\n+    $httpBackend = $injector.get('$httpBackend');\n+    Links = $injector.get('Links');\n+    $location = $injector.get('$location');\n+\n+    $scope = $rootScope.$new();\n+\n+    var $controller = $injector.get('$controller');\n+\n+    createController = function () {\n+      return $controller('ShortenController', {\n+        $scope: $scope,\n+        Links: Links,\n+        $location: $location\n+      });\n+    };\n+\n+    createController();\n+  }));\n+\n+  afterEach(function() {\n+    $httpBackend.verifyNoOutstandingExpectation();\n+    $httpBackend.verifyNoOutstandingRequest();\n+  });\n+\n+  it('should have a link property on the $scope', function() {\n+    expect($scope.link).to.be.an('object');\n+  });\n+\n+  it('should have a addLink method on the $scope', function () {\n+    expect($scope.addLink).to.be.a('function');\n+  });\n+\n+  it('should be able to create new links with addLink()', function () {\n+    $httpBackend.expectPOST(\"/api/links\").respond(201, '');\n+    $scope.addLink();\n+    $httpBackend.flush();\n+  });\n+});"
    }
  ]
};

var commitWithDelete = {
  "sha": "a47fb452b1fb20ed61ff397cecf6f709ad6b2391",
  "commit": {
    "author": {
      "name": "Devon Harvey",
      "email": "devonharvey@gmail.com",
      "date": "2015-07-18T19:04:24Z"
    },
    "committer": {
      "name": "Devon Harvey",
      "email": "devonharvey@gmail.com",
      "date": "2015-07-18T19:04:24Z"
    },
    "message": "Merge pull request #139 from ardsouza/reactViews\n\n(fix) made path cleaner",
    "tree": {
      "sha": "acf5e47df2242951a39b4a27ce77584b46cbd480",
      "url": "https://api.github.com/repos/IncognizantDoppelganger/gitpun/git/trees/acf5e47df2242951a39b4a27ce77584b46cbd480"
    },
    "url": "https://api.github.com/repos/IncognizantDoppelganger/gitpun/git/commits/a47fb452b1fb20ed61ff397cecf6f709ad6b2391",
    "comment_count": 0
  },
  "url": "https://api.github.com/repos/IncognizantDoppelganger/gitpun/commits/a47fb452b1fb20ed61ff397cecf6f709ad6b2391",
  "html_url": "https://github.com/IncognizantDoppelganger/gitpun/commit/a47fb452b1fb20ed61ff397cecf6f709ad6b2391",
  "comments_url": "https://api.github.com/repos/IncognizantDoppelganger/gitpun/commits/a47fb452b1fb20ed61ff397cecf6f709ad6b2391/comments",
  "author": {
    "login": "devonharvey",
    "id": 9685632,
    "avatar_url": "https://avatars.githubusercontent.com/u/9685632?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/devonharvey",
    "html_url": "https://github.com/devonharvey",
    "followers_url": "https://api.github.com/users/devonharvey/followers",
    "following_url": "https://api.github.com/users/devonharvey/following{/other_user}",
    "gists_url": "https://api.github.com/users/devonharvey/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/devonharvey/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/devonharvey/subscriptions",
    "organizations_url": "https://api.github.com/users/devonharvey/orgs",
    "repos_url": "https://api.github.com/users/devonharvey/repos",
    "events_url": "https://api.github.com/users/devonharvey/events{/privacy}",
    "received_events_url": "https://api.github.com/users/devonharvey/received_events",
    "type": "User",
    "site_admin": false
  },
  "committer": {
    "login": "devonharvey",
    "id": 9685632,
    "avatar_url": "https://avatars.githubusercontent.com/u/9685632?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/devonharvey",
    "html_url": "https://github.com/devonharvey",
    "followers_url": "https://api.github.com/users/devonharvey/followers",
    "following_url": "https://api.github.com/users/devonharvey/following{/other_user}",
    "gists_url": "https://api.github.com/users/devonharvey/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/devonharvey/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/devonharvey/subscriptions",
    "organizations_url": "https://api.github.com/users/devonharvey/orgs",
    "repos_url": "https://api.github.com/users/devonharvey/repos",
    "events_url": "https://api.github.com/users/devonharvey/events{/privacy}",
    "received_events_url": "https://api.github.com/users/devonharvey/received_events",
    "type": "User",
    "site_admin": false
  },
  "parents": [
    {
      "sha": "7a7d2e8e69766f15d360a200ad4dfe845fdfbe8c",
      "url": "https://api.github.com/repos/IncognizantDoppelganger/gitpun/commits/7a7d2e8e69766f15d360a200ad4dfe845fdfbe8c",
      "html_url": "https://github.com/IncognizantDoppelganger/gitpun/commit/7a7d2e8e69766f15d360a200ad4dfe845fdfbe8c"
    },
    {
      "sha": "84dceb34186d241eaded31ab41302e2181f91439",
      "url": "https://api.github.com/repos/IncognizantDoppelganger/gitpun/commits/84dceb34186d241eaded31ab41302e2181f91439",
      "html_url": "https://github.com/IncognizantDoppelganger/gitpun/commit/84dceb34186d241eaded31ab41302e2181f91439"
    }
  ],
  "stats": {
    "total": 3,
    "additions": 1,
    "deletions": 2
  },
  "files": [
    {
      "sha": "000ba5b55b2e76a8c80fc5459c79f2a2efbe1382",
      "filename": "client/js/views/path.react.jsx",
      "status": "modified",
      "additions": 1,
      "deletions": 2,
      "changes": 3,
      "blob_url": "https://github.com/IncognizantDoppelganger/gitpun/blob/a47fb452b1fb20ed61ff397cecf6f709ad6b2391/client/js/views/path.react.jsx",
      "raw_url": "https://github.com/IncognizantDoppelganger/gitpun/raw/a47fb452b1fb20ed61ff397cecf6f709ad6b2391/client/js/views/path.react.jsx",
      "contents_url": "https://api.github.com/repos/IncognizantDoppelganger/gitpun/contents/client/js/views/path.react.jsx?ref=a47fb452b1fb20ed61ff397cecf6f709ad6b2391",
      "patch": "@@ -11,16 +11,15 @@ var Path = React.createClass({\n     var fullPath = this.props.currentPath.map(function(folder, index) {\n       return (\n           <span>\n+            <Button bsSize=\"xsmall\" bsStyle=\"link\" onClick={this.handleClick.bind(this,index-1)}>/</Button>\n             <Button bsSize=\"xsmall\" bsStyle=\"link\" onClick={this.handleClick.bind(this,index)}>\n               {folder}\n             </Button>\n-            <Button bsSize=\"xsmall\" bsStyle=\"link\">/</Button>\n           </span>\n         )\n     }.bind(this));\n     return (\n         <div>Path: \n-          <Button bsSize=\"xsmall\" bsStyle=\"link\" onClick={this.handleClick.bind(this,-1)}>/</Button>\n           {fullPath}\n         </div>\n       )"
    }
  ]
};

module.exports = Visualize;

