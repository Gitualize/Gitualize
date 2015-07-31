var _ = require('underscore');
var ReactBootstrap = require('react-bootstrap');
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;

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
          <div key={details.path} style={this.styles.paddingStyle}>
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
    debugger;
    return (
      <ReactCSSTransitionGroup transitionName='example'>{ this.formatTree(this.props.fileTree) }</ReactCSSTransitionGroup>
    )
  }
});

module.exports = Directory;
