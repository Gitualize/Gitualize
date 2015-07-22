var React = require('react');

var CommitInfo = React.createClass({
  render: function () {
    var message = this.props.currentCommit.message;
    var imageURL = this.props.currentCommit.avatarUrl + '&s=48';
    return (
      <div>
        <img style={{'height': '48px', 'width': '48px'}} src={imageURL}/>
        {message}
      </div>
      )
  }
});

module.exports = CommitInfo;
