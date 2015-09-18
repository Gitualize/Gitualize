var $ = require('jquery');
var jqueryUI = require('jquery-ui');
var React = require('react/addons');
var Navigation = require('react-router').Navigation;
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var ButtonInput = ReactBootstrap.ButtonInput;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Tooltip = ReactBootstrap.Tooltip;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;

var Landing = React.createClass({
  mixins : [Navigation],
  errorMessages: {badRepo: "Unable to fetch the requested repository. You may only gitualize public repositories. Please try again in a little while if you believe this is a mistake, we're doing our best :)"},
  styles: {
    containerStyle: {
      width: '980',
      marginTop: 25,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    formStyle: {
      width: 980
    },
    stepStyle: {
      width: 225,
      height: 360,
      margin: 10,
      padding: 0,
      display: 'inline-block',
      wordWrap: 'break-word',
      overflow: 'hidden',
    },
    stepContentStyle: {
      width: 225,
      height: 225,
      display: 'block',
      border: '1px solid powderBlue'
    },
    imageStyle: {
      width: 223,
      height: 223,
      margin: 0
    },
    stepTextStyle: {
      padding: 0,
      display: 'block',
      textWrap: 'break-word',
      borderTop: '3px double lightsteelblue'
    },
    instructionStyle: {
      width: 980,
      marginTop: 30,
      padding: 10,
      borderRadius: 5,
      display: 'inline-block',
      textAlign: 'center'
    }
  },
  // parse:
  // jashkenas/backbone
  // https://github.com/jashkenas/backbone.git
  // https://github.com/jashkenas/backbone
  GITHUB_URL: /^(?:https?\:\/\/github\.com\/)?(\w+)\/([\w.-]+)(?:\.git)?$/,
  GITHUB_URL_PARTIAL: /^(?:https?\:\/\/github\.com\/)?(\w+)\/$/,

  handleClick: function(e) {
    var repo = $(e.target).text().split('/');
    this.transitionTo('repo', {repoOwner: repo[0], repoName: repo[1]});
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var input = this.refs.repo.getValue();
    var repo = input.match(this.GITHUB_URL);
    if (!repo || repo.length < 3) {
      return; //TODO better err handling
    }
    this.transitionTo('repo', {repoOwner: repo[1], repoName: repo[2]});
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
    var partialMatch = string.match(this.GITHUB_URL_PARTIAL);

    if (string.match(this.GITHUB_URL)) {
      style = 'success';
    } else if (partialMatch) {
      style = 'warning';
      var userName = partialMatch[1];
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
    var hovering = false;

    $.each(instructions, function(i, x){
      $(x).mouseenter(function(){
        instructions.each(function(i, x){
          $(x).removeClass('hovered');
        });
        $(this).addClass('hovered');
        hovering = true;
        num = i;
      });

      $(x).mouseleave(function(){
        hovering = false;
      });
    });

    var cycle = function() {
      instructions.each(function(i, x){
        $(x).removeClass('hovered');
      });
      instructions.eq(num).addClass('hovered');

      if(!hovering) {
        if(num < len - 1) {
          num++;
        } else {
          num = 0;
        }
      }

      setTimeout(function(){
        cycle();
      }, 2000);
    };

    cycle();
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
            <h4> Visualize a repo </h4>
            <Input type='text' ref='repo' className='uiAutocomplete' buttonBefore={<ButtonInput type='submit' value='Gitualize' bsStyle={this.state.style} disabled={this.state.disabled}/>} onChange={this.handleChange} placeholder="repo owner/repo name OR paste GitHub repo url here"/>
            {errorMessage}
          </form>
        Demos:

      <ButtonToolbar onClick={this.handleClick}>
        <Button>jashkenas/backbone</Button>
        <Button>angular/angular</Button>
        <Button>substack/node-browserify</Button>
      </ButtonToolbar>

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
