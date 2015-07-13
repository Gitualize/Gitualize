var React = require('react');
var $ = require('jquery');
var Navigation = require('react-router').Navigation;
var Github = require('github-api');
var About = React.createClass({
  render: function () {
    return <h2>About</h2>;
  }
});
var Folder = React.createClass({
  componentDidMount: function() {
    console.log(this.props.params.repoName);
    var repoName = this.props.params.repoName;
    var repoOwner = this.props.params.repoOwner;
    $.getJSON('/secret.json', function(data) { //need some kind of angular factory
      var github = new Github({token: data.github_token, auth: 'oauth'});
      var repo = github.getRepo(repoOwner, repoName);
      repo.show(function(err, repo) {
        console.log(repo);
        this.setState({data: JSON.stringify(repo)});
      }.bind(this));

      //repo.getCommits({sha: 'master'}, function(commits) { //in progress, not working
        //console.log(commits);
      //});

    }.bind(this));
  },
  getInitialState: function() {
    return {data: []};
  },
  render: function () {
    return <div>
      <h2>Folder view</h2>
      {this.props.params.repoName}
      {this.state.data}
    </div>
  }
});
var Landing = React.createClass({
  mixins : [Navigation],
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

module.exports.Landing = Landing;
module.exports.About = About;
module.exports.Folder = Folder;
