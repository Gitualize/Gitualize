var _ = require('underscore');
var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Well = ReactBootstrap.Well;

var Directory = React.createClass({
  styles : {
    paddingStyle : {
      paddingLeft: '10px'
    }
  },
  formatTree: function(tree) {
    return _.map(tree, function(contents, filename) {
      if (filename === '_folderDetails') return;
      var details = contents._folderDetails;
      return (
          <div style={this.styles.paddingStyle}>
            <Glyphicon glyph={details.isFolder ? 'folder-open' : 'file'}/>
            <Button bsSize="xsmall" onClick={this.handleClick.bind(this, details.path)} bsStyle="link">{filename}</Button>
            {details.isFolder ? this.formatTree(contents) : null}
          </div>
        );
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
