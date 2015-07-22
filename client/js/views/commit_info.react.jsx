var React = require('react');

var CommitInfo = React.createClass({
  render: function () {
    var message = this.props.currentCommit.message;
    return (
      <div>
        Commit Info:
        {message}
      </div>
      )
  }
});

module.exports = CommitInfo;
