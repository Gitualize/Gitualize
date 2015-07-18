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
            <Button bsSize="xsmall" bsStyle="link" onClick={this.handleClick.bind(this,index)}>
              {folder}
            </Button>
            <Button bsSize="xsmall" bsStyle="link">/</Button>
          </span>
        )
    }.bind(this));
    return (
        <div>Path: 
          <Button bsSize="xsmall" bsStyle="link" onClick={this.handleClick.bind(this,-1)}>/</Button>
          {fullPath}
        </div>
      )
  }
});

module.exports = Path;
