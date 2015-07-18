var React = require('react');

var Path = React.createClass({
  handleClick: function (index) {
    this.props.updateCurrentPath(this.props.currentPath.slice(0, index + 1));
  },

  render: function () {
    var context = this;
    var fullPath = this.props.currentPath.map(function(folder, index) {
      return <button onClick={function () {context.handleClick(index)}}>
        {folder}
      </button>
    }.bind(this));
    return <div>Path: 
      <button onClick={function () {context.handleClick(-1)}}> / </button>
      {fullPath}
    </div>
  }
});

module.exports = Path;
