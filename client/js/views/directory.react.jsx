var _ = require('underscore');
var ReactBootstrap = require('react-bootstrap');
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;

var Directory = React.createClass({
  //componentWillReceiveProps: function(nextProps) {
    //var files = nextProps.currentCommit.files;
    //console.log('currentCommit files: ', files);
  //},
  formatTree: function(tree) {
    //console.dir(tree);
    //_.find(this.props.currentCommit.files, function(file) {
      //if (file.filename === 'client/app/addBook/addBook.html') debugger;
    //});
    return _.map(tree, function(contents, filename) {
      if (filename === '_folderDetails') return;
      var details = contents._folderDetails;
      var path = details.path;
      var modified = _.find(this.props.currentCommit.files, function(file) { //check how expensive
        return file.status === 'modified' && file.filename === details.path;
      });
      //if (filename === 'client/app/addBook/addBook.html') debugger;
      //if (path === 'client/app/addBook/addBook.html') debugger;
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
