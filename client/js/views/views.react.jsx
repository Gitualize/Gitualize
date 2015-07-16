//master view file for now
var $ = require('jquery');
var React = require('react');
//var Github = require('github-api');
var Landing = require('./landing.react.jsx');
var Navbar = require('./navbar.react.jsx');
var About = require('./about.react.jsx');

var Folder = React.createClass({
  getCommits: function(fullRepoName) {
    $.getJSON('https://localhost:3000/'+fullRepoName, {access_token: access_token}, function(commits) {
      this.setState({commits: commits});
    });
  },

  //getLastCommitTime: function(commits) { //helper
    //return commits.length > 0 && commits[commits.length-1].commit.committer.date;
  //},
  //getCommits: function(fullRepoName, maxCommits) { //move logic to server when ready
    //var localLastCommitTime, pulledLastCommitTime;
    //var getMoreCommits = function() {
      //localLastCommitTime = this.getLastCommitTime(this.state.commits) || Date.now(); //date.now really a placeholder, incorrect time format
      //$.getJSON('https://api.github.com/repos/'+fullRepoName+'/commits', {access_token: access_token, until: localLastCommitTime}, function(newCommits) {
        //pulledLastCommitTime = this.getLastCommitTime(newCommits);
        //if (pulledLastCommitTime === localLastCommitTime || this.state.commits.length > maxCommits) { //we have all the commits
          //console.log('got all commits: ', this.state.commits);
        //} else {
          //this.setState({commits: this.state.commits.concat(newCommits)});
          //getMoreCommits();
        //}
      //}.bind(this));
    //}.bind(this);
    //getMoreCommits();
  getFiles: function() {
  },
  componentDidMount: function() {
    //console.log('accesstoken: ', access_token);
    var repoName = this.props.params.repoName;
    var repoOwner = this.props.params.repoOwner;
    //var github = new Github({token: access_token, auth: 'oauth'});
    //var repo = github.getRepo(repoOwner, repoName);
    //repo.show(function(err, repo) {
    //}.bind(this));
    //repo.getCommit('master', '039ce8097a376ab348e91320dea3317e244969a5', function(err, commit) { 
    //console.log('commit: ',commit);
    //});
    //repo.getCommits(function(commits) { //getCommits from githubApi wrapper doesn't work?
    //console.log('commits: ', commits);
    //});
    this.getCommits(repoOwner+'/'+repoName); //NUM/30 requests
  },
  getInitialState: function() {
    return {commits: [], files: []};
  },
  render: function () {

    var commits = this.state.commits.map(function(commit) {
      return <Commit>
        {commit}
      </Commit>
    });
    return <div>
      <h2>Folder view</h2>
      {this.props.params.repoName}
      <ul>
        {File}
      </ul>
    </div>
  }
});

var Commit = React.createClass({
  render: function () {
    return <li>
      {this.props.children}
    </li>
  }
});

module.exports.Landing = Landing;
module.exports.About = About;
module.exports.Folder = Folder;
module.exports.Navbar = Navbar;
module.exports.About = About;
