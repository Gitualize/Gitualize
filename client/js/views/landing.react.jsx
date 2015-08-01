var $ = require('jquery');
var jqueryUI = require('jquery-ui');
var React = require('react/addons');
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
      width: 275,
      height: 360,
      margin: 10,
      padding: 0,
      display: 'inline-block',
      wordWrap: 'break-word',
      overflow: 'hidden',
    }, 
    stepContentStyle: {
      width: 275,
      height: 275,
      display: 'block',
      border: '1px solid powderBlue'
    },
    imageStyle: {
      width: 273,
      height: 273,
      margin: 0
    },
    stepTextStyle: {
      width: 'auto',
      height: 85,
      padding: 3,
      display: 'block',
      textWrap: 'break-word',
      borderTop: '5px double lightsteelblue'
    },
    instructionStyle: {
      width: '100%',
      minWidth: 1200,
      marginTop: 30,
      padding: 10,
      borderRadius: 5,
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
      style: null,
      instruction: 0
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

  cycleInstructions: function() {
    var num = 0;
    var context = this;
    var instructions = $('.fade');
    var len = instructions.length;

    $.each(instructions, function(i, x){
      $(x).mouseenter(function(){
        instructions.each(function(i, x){
          $(x).removeClass('hovered');
        });
        $(this).addClass('hovered');
        num = i;
      });
    });

    var cycle = function() {
      instructions.each(function(i, x){
        $(x).removeClass('hovered');
      });
      instructions.eq(num).addClass('hovered');

      if(num < len - 1) {
        num++;
      } else {
        num = -1; 
      }

      setTimeout(function(){
        cycle();
      }, 2000);
    };

    cycle(num);
  },

  componentDidMount: function() {
    this.cycleInstructions();
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
              <div className='fade' style={this.styles.stepContentStyle}> 
                  <img style={this.styles.imageStyle} src={'../../pics/instruction1.jpg'}/>
              </div>
              <div style={this.styles.stepTextStyle}>
                <h4> Step 1</h4>
                <p> Input an existing public GitHub repository </p>
              </div>
            </Col>
            <Col style={this.styles.stepStyle}> 
              <div className='fade' style={this.styles.stepContentStyle}> 
                <img style={this.styles.imageStyle} src='../../pics/instruction2.jpg'/>
              </div>
              <div style={this.styles.stepTextStyle}>
                <h4> Step 2 </h4>
                <p> Press play/pause and adjust speed if needed </p>
              </div>
            </Col>
            <Col style={this.styles.stepStyle}> 
              <div className='fade' style={this.styles.stepContentStyle}> 
                <img style={this.styles.imageStyle} src='../../pics/instruction3.jpg'/>
              </div>
              <div style={this.styles.stepTextStyle}>
                <h4> Step 3 </h4>
                <p> Navigate through folder and directory views </p>
              </div>
            </Col>
            <Col style={this.styles.stepStyle}> 
              <div className='fade' style={this.styles.stepContentStyle}> 
                <img style={this.styles.imageStyle} src='../../pics/instruction4.jpg'/>
              </div>
              <div style={this.styles.stepTextStyle}>
                <h4> Step 4 </h4>
                <p> See changes in a file within a commit range </p>
              </div>
            </Col>
          </Row>
        </Grid>

      </div>
    );
  }
});

module.exports = Landing;
