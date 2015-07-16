var React = require('react');

var Path = require('./path.react.jsx');
var Directory = require('./directory.react.jsx');
var File = require('./file.react.jsx');
var Folder = require('./folder.react.jsx');
var Playbar = require('./playbar.react.jsx');

var Visualize = React.createClass({
  render: function () {
    return <div>
      <Path/>
      <Directory/>
      <Folder/>
      <Playbar/>
    </div>
  }
});

module.exports = Visualize;
