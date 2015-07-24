var React = require('react');
var Navigation = require('react-router').Navigation;
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var ButtonInput = ReactBootstrap.ButtonInput;

var Landing = React.createClass({
  mixins : [Navigation],
  errorMessages: {badRepo: 'Unable to fetch the requested repository. You may only gitualize public repositories.'},

  handleSubmit: function(e) {
    e.preventDefault();
    var repo = this.refs.repo.getValue().split('/');
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
    if (this.props.query.error) {
      var errorMessage = (
          <div className='error-message'>
            Error: {this.errorMessages[this.props.query.error]}
          </div>
        )
    }

    return (
      <form className='repoForm' onSubmit={this.handleSubmit}>
        <Input type='text' ref='repo' label='Visualize a repo' onChange={this.handleChange} placeholder='user/reponame - try tchan247/blog-project'/>
        <ButtonInput type='submit' value='Gitualize' bsStyle={this.state.style} disabled={this.state.disabled} />
        {errorMessage}
      </form>
    );
  }
});

module.exports = Landing;
