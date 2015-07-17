var React = require('react');

var File = React.createClass({
  render: function () {
    return <li>
      {this.props.children}
    </li>
  }
});

var Folder = React.createClass({
  render: function () {
    var context = this;
    var allFiles = this.props.currentCommit.files.filter(function (file) {
      var path = context.props.currentPath.join('/');
      if (file.filename.slice(0, path.length) !== path) {
        return false;
      }
      return true;
      })
      .map(function (file) {
        return <File>
          {file.filename}
        </File>
      });

    return <div>
      <h2>Folder view</h2>
      <ul>
        {allFiles}
      </ul>
    </div>
  }
});

module.exports = Folder;
