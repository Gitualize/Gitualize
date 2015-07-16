var React = require('react');
var Navigation = require('react-router').Navigation;

var Landing = React.createClass({
  mixins : [Navigation],
  componentDidMount: function() {
    if (access_token) return; //set the access token here so folder view has it
    $.getJSON('/secret.json', function(data) { //need some kind of angular factory
      access_token = access_token || data.github_token;
    });
  },
  handleSubmit: function(e) {
    console.log('submitted');
    e.preventDefault();
    var repo = React.findDOMNode(this.refs.repo).value.split('/');
    //this.transitionTo('repos', {repoName: repo});
    this.transitionTo('repo', {repoOwner: repo[0], repoName: repo[1]});
  },
  render: function () {
    return <div>
      (try jashkenas/backbone)
      <form className='repoForm' onSubmit={this.handleSubmit}>
        <input type='text' ref='repo' placeholder='user/reponame - try jashkenas/backbone' />
        <input type='submit' value='go'/>
      </form>
    </div>
  }
});

module.exports = Landing;
