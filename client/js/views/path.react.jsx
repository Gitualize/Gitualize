var React = require('react');

var Path = React.createClass({
  handleClick: function () {
    this.props.updateCurrentPath(['d', 'e', 'f']);
  },

  render: function () {
    var fullPath = this.props.currentPath.map(function(folder) {
      return <button onClick={this.handleClick}>
        {folder}
      </button>
    }.bind(this));
    return <div>Path: {fullPath}
    </div>
  }
});

module.exports = Path;
