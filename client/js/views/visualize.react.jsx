var React = require('react');

var Path = require('./path.react.jsx');
var Directory = require('./directory.react.jsx');
var File = require('./file.react.jsx');
var Folder = require('./folder.react.jsx');
var Playbar = require('./playbar.react.jsx');

var Visualize = React.createClass({
  updateCurrentCommit: function (index) {
    this.setState({currentCommit: index});
  },

  updateCurrentPath: function (path) {
    this.setState({currentPath: path});
  },

  getInitialState: function() {
    return {currentCommit: 0, currentPath: '/'};
  },

  render: function () {
    var fullRepoName = this.props.params.repoName + '/' + this.props.params.repoOwner;
    return <div>
      <Path currentPath={this.state.currentPath} updateCurrentPath={this.state.updateCurrentPath}/>
      <Directory currentPath={this.state.currentPath} updateCurrentPath={this.state.updateCurrentPath}/>
      <Folder fullRepoName={fullRepoName} currentCommit={this.state.currentCommit} currentPath={this.state.currentPath} updateCurrentPath={this.state.updateCurrentPath}/>
      <Playbar currentCommit={this.state.currentCommit} updateCurrentCommit={this.updateCurrentCommit}/>
    </div>
  }
});

module.exports = Visualize;

