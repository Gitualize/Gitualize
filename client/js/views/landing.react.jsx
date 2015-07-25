var React = require('react');
var Navigation = require('react-router').Navigation;
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var ButtonInput = ReactBootstrap.ButtonInput;
var Well = ReactBootstrap.Well;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;

var Landing = React.createClass({
  mixins : [Navigation],
  errorMessages: {badRepo: 'Unable to fetch the requested repository. You may only gitualize public repositories.'},
  styles: {
    containerStyle: {
      paddingLeft: 100,
      paddingRight: 100
    },
    formStyle: {
    },
    stepStyle: {
      width: 300,
      height: 375,
      margin: 10,
      padding: 0,
      display: 'inline-block',
      wordWrap: 'break-word'
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
      backgroundColor: 'white'
    },
    instructionStyle: {
      width: 'auto',
      minWidth: 100,
      marginTop: 50,
      padding: 10,
      borderRadius: 10,
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: 'lightblue',
      whiteSpace: 'nowrap',
      overflowX: 'scroll',
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
      <div style={this.styles.containerStyle}>
        <form style={this.styles.formStyle} className='repoForm' onSubmit={this.handleSubmit}>
          <Input type='text' ref='repo' label='Visualize a repo' onChange={this.handleChange} placeholder='user/reponame - try tchan247/blog-project'/>
          <ButtonInput type='submit' value='Gitualize' bsStyle={this.state.style} disabled={this.state.disabled} />
          {errorMessage}
        </form>

        <Grid style={this.styles.instructionStyle} bsSize='small'>
          <Row>
            <Col style={this.styles.stepStyle}> 
              <div style={this.styles.stepContentStyle}> 
                (add content)
              </div>
              <div style={this.styles.stepTextStyle}>
                <p> Step 1 </p>
              </div>
            </Col>
            <Col style={this.styles.stepStyle}> 
              <div style={this.styles.stepContentStyle}> 
                (add content)
              </div>
              <div style={this.styles.stepTextStyle}>
                <p> Step 2 </p>
              </div>
            </Col>
            <Col style={this.styles.stepStyle}> 
              <div style={this.styles.stepContentStyle}> 
                (add content)
              </div>
              <div style={this.styles.stepTextStyle}>
                <p> Step 3 </p>
              </div>
            </Col>
          </Row>
        </Grid>

      </div>
    );
  }
});

module.exports = Landing;
