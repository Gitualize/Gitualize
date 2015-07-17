var React = require('react');

var Path = React.createClass({
  render: function () {
    return <div>Path: {this.props.currentPath}
    </div>
  }
});

module.exports = Path;
