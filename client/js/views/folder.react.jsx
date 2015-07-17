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
    console.log(this.props)
    var allFiles = this.props.currentCommit.files.map(function (file) {
      return <File>
        {file.filename}
      </File>
    });
    return <div>
      <h2>Folder view</h2>
      iofdsaj
      <ul>
        {allFiles}
      </ul>
    </div>
  }
});

module.exports = Folder;
