var React = require('react');

var Path = require('./path.react.jsx');
var Directory = require('./directory.react.jsx');
var File = require('./file.react.jsx');
var Folder = require('./folder.react.jsx');
var Playbar = require('./playbar.react.jsx');

var Visualize = React.createClass({
  render: function () {
    var fullRepoName = this.props.params.repoName + '/' + this.props.params.repoOwner;
    return <div>
      <Path/>
      <Directory/>
      <Folder fullRepoName={fullRepoName}/>
      <Playbar/>
    </div>
  }
});

module.exports = Visualize;

