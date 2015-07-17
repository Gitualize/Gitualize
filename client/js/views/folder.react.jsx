var React = require('react');
var $ = require('jquery');

var Commit = React.createClass({
  render: function () {
    return <li>
      {this.props.children}
    </li>
  }
});

var Folder = React.createClass({
  getCommits: function(fullRepoName) {
    $.getJSON('/repos/'+fullRepoName+'/commits', function(commits) {
      this.setState({commits: commits});
    }.bind(this));
  },

  //getLastCommitTime: function(commits) { //helper
    //return commits.length > 0 && commits[commits.length-1].commit.committer.date;
  //},

  getFiles: function() {
  },

  componentDidMount: function() {
    this.getCommits(this.props.fullRepoName); //NUM/30 requests
  },

  getInitialState: function() {
    return {commits: [], files: [], currentCommit: 0};
  },

  setCurrentCommit: function(index) {
    this.setState({currentCommit: index});
  },
  
  render: function () {
    var commits = this.state.commits.map(function(commit) {
      return <Commit>
        {commit}
      </Commit>
    });
    return <div>
      <h2>Folder view</h2>
      {this.props.fullRepoName}
      <ul>
        {commits[this.state.currentCommit]}
      </ul>
    </div>
  }
});

module.exports = Folder;
