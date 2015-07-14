var React = require('react');
var $ = require('jquery');
var Navigation = require('react-router').Navigation;
var Github = require('github-api');
var About = React.createClass({
  render: function () {
    return <h2>About</h2>;
  }
});
var access_token;
var Folder = React.createClass({
  getLastCommitTime: function(commits) { //helper
    return commits.length > 0 && commits[commits.length-1].commit.committer.date;
  },
  getCommits: function(fullRepoName, maxCommits) { //move logic to server when ready
    var localLastCommitTime, pulledLastCommitTime;
    var getMoreCommits = function() {
      localLastCommitTime = this.getLastCommitTime(this.state.commits) || Date.now(); //date.now really a placeholder, incorrect time format
      $.getJSON('https://api.github.com/repos/'+fullRepoName+'/commits', {access_token: access_token, until: localLastCommitTime}, function(newCommits) {
        pulledLastCommitTime = this.getLastCommitTime(newCommits);
        if (pulledLastCommitTime === localLastCommitTime || this.state.commits.length > maxCommits) { //we have all the commits
          console.log('got all commits: ', this.state.commits);
        } else {
          this.setState({commits: this.state.commits.concat(newCommits)});
          getMoreCommits();
        }
      }.bind(this));
    }.bind(this);
    getMoreCommits();
  },
  getFiles: function() {
  },
  componentDidMount: function() {
    console.log('accesstoken: ', access_token);
    var repoName = this.props.params.repoName;
    var repoOwner = this.props.params.repoOwner;
    var github = new Github({token: access_token, auth: 'oauth'});
    var repo = github.getRepo(repoOwner, repoName);
    //repo.show(function(err, repo) {
    //}.bind(this));
    //repo.getCommit('master', '039ce8097a376ab348e91320dea3317e244969a5', function(err, commit) { 
    //console.log('commit: ',commit);
    //});
    //repo.getCommits(function(commits) { //getCommits from githubApi wrapper doesn't work?
    //console.log('commits: ', commits);
    //});
    this.getCommits(repoOwner+'/'+repoName, 500); //NUM/30 requests
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
var Landing = React.createClass({
  mixins : [Navigation],
  componentDidMount: function() {
    if (access_token) return; //set the access token here so folder view has it
    $.getJSON('/secret.json', function(data) { //need some kind of angular factory
      access_token = access_token || data.github_token;
    });
  },
  handleSubmit: function(e) {
    console.log('submitted');
    e.preventDefault();
    var repo = React.findDOMNode(this.refs.repo).value.split('/');
    //this.transitionTo('repos', {repoName: repo});
    this.transitionTo('repo', {repoOwner: repo[0], repoName: repo[1]});
  },
  render: function () {
    return <div>
      (try jashkenas/backbone)
      <form className='repoForm' onSubmit={this.handleSubmit}>
        <input type='text' ref='repo' placeholder='user/reponame - try jashkenas/backbone' />
        <input type='submit' value='go'/>
      </form>
    </div>
  }
});

module.exports.Landing = Landing;
module.exports.About = About;
module.exports.Folder = Folder;
