var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var ProgressBar = ReactBootstrap.ProgressBar;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var Tooltip = ReactBootstrap.Tooltip;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;

var Playbar = React.createClass({
  clock: function(seconds) {
    var time = {};
    this.total = seconds;
    time.hours = Math.floor(seconds/3600);
    time.minutes = Math.floor(seconds/60) - time.hours*60;
    time.seconds = seconds - time.hours*3600 - time.minutes*60;
    time.toString = function() {
      return (this.hours > 9? this.hours: '0' + this.hours) + ':' + (this.minutes > 9? this.minutes: '0' + this.minutes)+ ':' + (this.seconds > 9? this.seconds: '0' + this.seconds);
    }
    time.add = function(n) {
      this.seconds += n;
      this.minutes += Math.floor(this.seconds/60);
      this.hours += Math.floor(this.minutes/60);
      this.seconds = this.seconds % 60;
      this.minutes = this.minutes % 60;
    }
    time.reset = function() {
      this.seconds = 0;
      this.minutes = 0;
      this.hours = 0;
    }
    return time;
  },

  getInitialState: function() {
    this.time = this.clock(0);
    this.totalTime = this.clock(this.props.numberOfCommits);
    this.speeds = {'100': '1', '200': '.5', '300': '.33', '400': '.25'};
    return {
      date: this.time.toString(),
      now: 0,
      glyphicon: 'play',
      commit : 0,
      speed : 100
    };
  },

  play: function() {
    this.props.updatePlaybarDirection('forward');
    clearInterval(this.timer);
    this.timer = setInterval(this.tick, this.state.speed);
  },

  pause: function () {
    clearInterval(this.timer);
  },

  speedUp: function() {
    if (this.state.glyphicon !== 'refresh') {
      if (this.state.speed > 100) this.setState( {speed: this.state.speed - 100} );
      if (this.state.glyphicon === 'pause') {
        clearInterval(this.timer);
        this.timer = setInterval(this.tick, this.state.speed);
      }
    }
  },

  slowDown: function() {
    if (this.state.glyphicon !== 'refresh') {
      if (this.state.speed < 400) this.setState( {speed: this.state.speed + 100} );
      if (this.state.glyphicon === 'pause') {
        clearInterval(this.timer);
        this.timer = setInterval(this.tick, this.state.speed);
      }
    }
  },

  rewind: function() {
    this.props.updatePlaybarDirection('backward');
    clearInterval(this.timer);
    this.timer = setInterval(this.tick, this.state.speed);
    this.setState({glyphicon: 'play'});
  },

  end: function() {
    this.pause();
    var glyphicon = 'refresh';
    this.setState( {glyphicon} );
  },

  tick: function() {
    var incrementor = this.props.playbarDirection === 'forward' ? 1 : -1;
    var now = this.state.now + incrementor;
    this.setState( {now} );
    if (now % 10 === 0) {
      if (this.props.commitIndex === 0 && this.props.playbarDirection === 'backward') return this.end();
      this.props.updateCommitIndex(this.props.commitIndex + incrementor);
      if (now % (this.props.numberOfCommits*10) === 0) this.end();
      this.time.add(incrementor);
      var date = this.time.toString();
      this.setState( {date} );
    }
  },

  handleClick: function() {
    if (this.state.glyphicon === 'play') {
      this.play();
    } else {
      var glyphicon = 'play';
      var now = 0;
      this.time.reset();
      var date = this.time.toString();
      this.setState( {glyphicon, now, date} );
      this.props.reset();
    }
  },

  showFileDiffualizeModal: function() {
    this.pause();
    this.props.showFileDiffualize();
  },

  isFile: function() {
    if (this.props.isFile) {
      return (
          <Col xs={3} sm={3} md={2}><Button onClick={this.showFileDiffualizeModal}><Glyphicon glyph='modal-window' /> Diffualize</Button></Col>
        )
    } else  {
      return (
          <Col xs={3} sm={3} md={2}></Col>
        )
    }
  },

  render: function () {
    var diffualizeFile = this.isFile();
    return (
      <Row className='show-grid'>
        <Col xs={12} sm={12} md={12}>
          <OverlayTrigger placement='top' overlay={<Tooltip>{this.state.date} / {this.totalTime.toString()}</Tooltip>}>
            <ProgressBar bsStyle='danger' now={this.state.now*10/this.props.numberOfCommits}/>
          </OverlayTrigger>
        </Col>
        <Col xs={5} sm={4} md={3}>
          <ButtonToolbar>
            <ButtonGroup bsSize='medium'>
              <OverlayTrigger placement='top' delayShow={500} overlay={<Tooltip> rewind </Tooltip>}>
                <Button onClick={this.rewind}><Glyphicon glyph='backward' /></Button>
              </OverlayTrigger>
              <OverlayTrigger placement='top' delayShow={500} overlay={<Tooltip> play </Tooltip>}>
                <Button onClick={this.handleClick}><Glyphicon glyph={this.state.glyphicon} /></Button>
              </OverlayTrigger>
              <OverlayTrigger placement='top' delayShow={500} overlay={<Tooltip> pause </Tooltip>}>
                <Button onClick={this.pause}><Glyphicon glyph='pause' /></Button>
              </OverlayTrigger>
              <OverlayTrigger placement='top' delayShow={500} overlay={<Tooltip> slow-down </Tooltip>}>
                <Button onClick={this.slowDown}><Glyphicon glyph='minus-sign' /></Button>
              </OverlayTrigger>
              <OverlayTrigger placement='top' delayShow={500} overlay={<Tooltip> speed-up </Tooltip>}>
                <Button onClick={this.speedUp}><Glyphicon glyph='plus-sign' /></Button>
              </OverlayTrigger>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
        <Col xs={2} sm={2} md={1} className='text-center'>
          <OverlayTrigger placement='top' delayShow={1000} overlay={<Tooltip> current speed </Tooltip>}>
            <Well bsSize='small'>{this.speeds[this.state.speed]}x </Well>
          </OverlayTrigger>
        </Col>
        <Col xs={3} sm={3} md={2} className='text-center'>
          <OverlayTrigger placement='top' delayShow={1000} overlay={<Tooltip> current commit </Tooltip>}>
            <Well bsSize='small'>{this.props.commitIndex}/{this.props.numberOfCommits} Commits</Well>
          </OverlayTrigger>
        </Col>
        {diffualizeFile}
      </Row>
    )
  }
});

module.exports = Playbar;
