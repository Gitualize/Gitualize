var React = require('react');

var CommitInfo = React.createClass({
  render: function () {
    var size = 48;
    var message = this.props.currentCommit.message;
    var imageURL = this.props.currentCommit.avatarUrl + '&s=' + size;
    return (
      <div>
        <img style={{'height': size+'px', 'width': size+'px'}} src={imageURL}/>
        {message}
      </div>
      )
  }
});

module.exports = CommitInfo;
