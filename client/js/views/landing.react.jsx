var React = require('react');
var Navigation = require('react-router').Navigation;
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var ButtonInput = ReactBootstrap.ButtonInput;

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
    var repo = this.refs.repo.getValue().split('/');
    //this.transitionTo('repos', {repoName: repo});
    this.transitionTo('repo', {repoOwner: repo[0], repoName: repo[1]});
  },

  getInitialState: function() {
    return {
      disabled: true,
      style: null
    };
  },

  validationState: function() {
    var string = this.refs.repo.getValue();
    var style = 'danger';

    if (string.match(/[\w]+\/[\w]+/)) { style = 'success'; }
    else if (string.match(/[\w]/)) { style = 'warning'; }

    var disabled = style !== 'success';

    return { style, disabled };
  },

  handleChange: function() {
    this.setState( this.validationState() );
  },

  render: function() {
    return (
      <form className='repoForm' onSubmit={this.handleSubmit}>
        <Input type='text' ref='repo' label='Visualize a repo' onChange={this.handleChange} placeholder='user/reponame - try jashkenas/backbone'/>
        <ButtonInput type='submit' value='Go' bsStyle={this.state.style} disabled={this.state.disabled} />
      </form>
    );
  }
});

module.exports = Landing;
