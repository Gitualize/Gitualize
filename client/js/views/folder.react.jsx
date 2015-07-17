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
  getFiles: function() {
  },

  getInitialState: function() {
    return {files: []};
  },
  
  render: function () {
    var commits = this.props.commits.map(function(commit) {
      return <Commit>
        {commit}
      </Commit>
    });
    return <div>
      <h2>Folder view</h2>
      <ul>
        {commits[this.props.currentCommit]}
      </ul>
    </div>
  }
});

module.exports = Folder;
