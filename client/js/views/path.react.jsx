var ReactBootstrap = require('react-bootstrap');
var React = require('react/addons');
var Button = ReactBootstrap.Button;

var Path = React.createClass({
  handleClick: function (index) {
    this.props.updateCurrentPath(this.props.currentPath.split('/').slice(0, index + 1).join('/'));
  },

  render: function () {
    var fullPath = this.props.currentPath.split('/').map(function(folder, index) {
      if (folder === '') {
        return;
      }
      
      return (
          <span>
            <Button bsSize="xsmall" bsStyle="link" className="path-folder" onClick={this.handleClick.bind(this,index)}>{'/ ' + folder}</Button>
          </span>
        )
    }.bind(this));
    return (
        <div>
          <Button bsSize="xsmall" bsStyle="link" className="path-root" onClick={this.handleClick.bind(this,-1)}>{this.props.repoName}</Button> 
          {fullPath}
        </div>
      )
  }
});

module.exports = Path;
