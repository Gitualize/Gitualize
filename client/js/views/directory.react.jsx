var _ = require('underscore');
var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Well = ReactBootstrap.Well;

var Directory = React.createClass({
  padStyle: function(depth) {
    return { paddingLeft: (depth*10) + 'px' };
  },
  formatTree: function(tree, depth) {
    var depth = depth || 0;
    return _.map(tree, function(contents, filename) {
      if (filename === '_folderDetails') return;
      var details = contents._folderDetails;
      return (<div>
          <div style={this.padStyle(depth+1)}><Glyphicon glyph={details.isFolder ? 'folder-open' : 'file'}/><Button bsSize="xsmall" onClick={this.handleClick.bind(this, details.path)} bsStyle="link">{filename}</Button></div>
          {details.isFolder ? this.formatTree(contents, depth+1) : null}
        </div>);
    }.bind(this));
  },
  handleClick: function(path) {
    this.props.updateCurrentPath(path);
  },
  render: function () {
    return (
      <Well bsSize='small'>{ this.formatTree(this.props.fileTree) }</Well>
    )
  }
});

module.exports = Directory;
