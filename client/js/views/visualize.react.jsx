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
    //ideas: somehow intercept backend redirect
    //backend: after logging in and getting data as json, make client ping again
    $.get('repos/'+repoFullName+'/commits', function(commits) {
      if (commits.msg === 'auth required') {
        console.log('must go now to: ', commits.authUrl);
        //this.transitionTo(commits.authUrl); //something like this, but it doesn't work
        //.then $.get again, msg should be the json of commits (loop)
        //redirect to /getAccessToken
      }
      debugger;
      console.log(commits);
      this.setState({commits: commits});
    }.bind(this), 'json').then(function(c) {
      console.log('hi');
      debugger;
    });
    debugger;
  },

  componentDidMount: function() {
    this.getCommits();
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

