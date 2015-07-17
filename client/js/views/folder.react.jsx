var React = require('react');

var Commit = React.createClass({
  render: function () {
    return <li>
      {this.props.children}
    </li>
  }
});

var Folder = React.createClass({
  render: function () {
    return <div>
      <h2>Folder view</h2>
      <ul>
        {this.props.currentCommit}
      </ul>
    </div>
  }
});

module.exports = Folder;
