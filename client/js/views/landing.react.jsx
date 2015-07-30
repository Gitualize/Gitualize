var $ = require('jquery');
var jqueryUI = require('jquery-ui');
var React = require('react');
var Navigation = require('react-router').Navigation;
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var ButtonInput = ReactBootstrap.ButtonInput;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Tooltip = ReactBootstrap.Tooltip;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;

var Landing = React.createClass({
  mixins : [Navigation],
  errorMessages: {badRepo: 'Unable to fetch the requested repository. You may only gitualize public repositories.'},
  styles: {
    containerStyle: {
      paddingTop: 25,
      paddingLeft: 100,
      paddingRight: 100
    },
    formStyle: {
      minWidth: 1000
    },
    stepStyle: {
      width: 300,
      height: 375,
      margin: 10,
      padding: 0,
      display: 'inline-block',
      wordWrap: 'break-word',
      overflow: 'hidden',
      border: '5px double white'
    }, 
    stepContentStyle: {
      width: 'auto',
      height: 300,
      display: 'block',
      backgroundColor: 'lightcyan'
    },
    stepTextStyle: {
      width: 'auto',
      height: 75,
      display: 'block',
      backgroundColor: 'white',
      textWrap: 'break-word'
    },
    instructionStyle: {
      width: '100%',
      minWidth: '1000',
      marginTop: 30,
      padding: 10,
      borderRadius: 10,
      backgroundColor: 'lightblue',
      display: 'inline-block',
      textAlign: 'center'
    }
  },
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
    else if (string.match(/[\w]+\//)) { 
      style = 'warning';
      var userName = this.refs.repo.getValue().split('/')[0];
      $.get('http://api.github.com/users/' + userName + '/repos', {access_token: window.localStorage.gitHubAccessToken})
      .success(function (repos) {
        var repoNames = repos.map(function(repo) {return userName + '/' + repo.name});
        $( ".uiAutocomplete" ).autocomplete({
          source: repoNames
        });
      });
    }

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
      <div style={this.styles.containerStyle}>
          <form style={this.styles.formStyle} className='repoForm' onSubmit={this.handleSubmit}>
            <Input type='text' ref='repo' className='uiAutocomplete' label='Visualize a repo' onChange={this.handleChange} placeholder='user/reponame - try jashkenas/backbone'/>
            <ButtonInput type='submit' value='Gitualize' bsStyle={this.state.style} disabled={this.state.disabled}/>
            {errorMessage}
          </form>

        <Grid style={this.styles.instructionStyle} bsSize='small'>
          <Row>
            <Col style={this.styles.stepStyle}> 
              <div style={this.styles.stepContentStyle}> 
                (add content)
              </div>
              <div style={this.styles.stepTextStyle}>
                <p> Step 1</p>
                <p> Input an existing public GitHub repository </p>
              </div>
            </Col>
            <Col style={this.styles.stepStyle}> 
              <div style={this.styles.stepContentStyle}> 
                (add content)
              </div>
              <div style={this.styles.stepTextStyle}>
                <p> Step 2 </p>
                <p> Press play/pause and adjust speed if needed </p>
              </div>
            </Col>
            <Col style={this.styles.stepStyle}> 
              <div style={this.styles.stepContentStyle}> 
                (add content)
              </div>
              <div style={this.styles.stepTextStyle}>
                <p> Step 3 </p>
                <p> Navigate through folder and directory views </p>
              </div>
            </Col>
          </Row>
        </Grid>

      </div>
    );
  }
});

module.exports = Landing;
