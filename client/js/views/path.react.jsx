var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Button = ReactBootstrap.Button;

var Path = React.createClass({
  handleClick: function (index) {
    this.props.updateCurrentPath(this.props.currentPath.slice(0, index + 1));
  },

  render: function () {
    var fullPath = this.props.currentPath.map(function(folder, index) {
      return (
          <span>
            <Button bsSize="xsmall" bsStyle="link" onClick={this.handleClick.bind(this,index-1)}>/</Button>
            <Button bsSize="xsmall" bsStyle="link" onClick={this.handleClick.bind(this,index)}>
              {folder}
            </Button>
          </span>
        )
    }.bind(this));
    return (
        <div>Path: 
          {fullPath}
        </div>
      )
  }
});

module.exports = Path;
