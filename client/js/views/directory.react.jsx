var _ = require('underscore');
var ReactBootstrap = require('react-bootstrap');
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;

var Directory = React.createClass({
  formatTree: function(tree) {
    return _.map(tree, function(contents, filename) {
      if (filename === '_folderDetails') return;
      var details = contents._folderDetails;
      var path = details.path;
      var modified = _.find(this.props.currentCommit.files, function(file) { //check how expensive
        return file.status === 'modified' && file.filename === details.path;
      });
      return (
          <div key={path} className={'dir-pad' + (modified ? ' dir-modified' : '')}>
            <Glyphicon glyph={details.isFolder ? 'folder-open' : 'file'}/>
            <Button bsSize="xsmall" onClick={this.handleClick.bind(this, path)} bsStyle="link">{filename}</Button>
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
      <ReactCSSTransitionGroup transitionName='directory'>{ this.formatTree(this.props.fileTree) }</ReactCSSTransitionGroup>
    )
  }
});

module.exports = Directory;
