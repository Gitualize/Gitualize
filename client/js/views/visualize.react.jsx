var React = require('react');
var Navigation = require('react-router').Navigation;
var $ = require('jquery');

var Path = require('./path.react.jsx');
var Directory = require('./directory.react.jsx');
var File = require('./file.react.jsx');
var Folder = require('./folder.react.jsx');
var Playbar = require('./playbar.react.jsx');

var Visualize = React.createClass({
  mixins : [Navigation],
  getCommits: function () {
    var repoFullName = this.props.params.repoOwner + '/' + this.props.params.repoName;
    $.getJSON('repos/'+repoFullName+'/commits', {accessToken: this.props.query.accessToken}, function(commits) {
      if (commits.msg === 'auth required') {
        window.location = commits.authUrl; //transitionTo doesn't work for external urls
        return;
      }
      this.setState({commits: commits});
    }.bind(this));
  },

  getCurrentCommit: function () {
    var repoFullName = this.props.params.repoName + '/' + this.props.params.repoOwner;
    var sha = this.state.commits[this.state.commitIndex].sha;
    $.getJSON('/repos/' + fullRepoName + '/commits/' + sha, function(commit) {
      this.setState({currentCommit: commit});
    }.bind(this));
  },

  componentDidMount: function() {
    this.getCommits();
  },

  updateCommitIndex: function (index) {
    this.setState({commitIndex: index});
  },

  updateCurrentPath: function (path) {
    this.setState({currentPath: path});
  },

  getInitialState: function() {
    return {commits: [], commitIndex: 0, currentCommit: {}, currentPath: ['aaa', 'bbb', 'ccc']};
  },

  render: function () {
    
    return <div>
      <Path currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
      <Directory currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
      <Folder commits={this.state.commits} commitIndex={this.state.commitIndex} currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
      <Playbar numberOfCommits={this.state.commits.length} commitIndex={this.state.commitIndex} updateCommitIndex={this.updateCommitIndex}/>
    </div>
  }
});

module.exports = Visualize;

