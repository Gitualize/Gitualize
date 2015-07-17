var React = require('react');
var $ = require('jquery');

var Path = require('./path.react.jsx');
var Directory = require('./directory.react.jsx');
var File = require('./file.react.jsx');
var Folder = require('./folder.react.jsx');
var Playbar = require('./playbar.react.jsx');

var Visualize = React.createClass({
  getCommits: function () {
    debugger;
    var fullRepoName = this.props.params.repo;
    $.ajax('/repos/'+fullRepoName+'/commits', {dataType: 'jsonp'}, function(commits) {
      this.setState({commits: commits});
    }.bind(this));
  },

  componentDidMount: function() {
    this.getCommits(this.props.fullRepoName); //NUM/30 requests
  },

  updateCurrentCommit: function (index) {
    this.setState({currentCommit: index});
  },

  updateCurrentPath: function (path) {
    this.setState({currentPath: path});
  },

  getInitialState: function() {
    return {commits: [], currentCommit: 0, currentPath: ['aaa', 'bbb', 'ccc']};
  },

  render: function () {
    return <div>
      <Path currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
      <Directory currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
      <Folder commits={this.state.commits} currentCommit={this.state.currentCommit} currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
      <Playbar numberOfCommits={this.state.commits.length} currentCommit={this.state.currentCommit} updateCurrentCommit={this.updateCurrentCommit}/>
    </div>
  }
});

module.exports = Visualize;

