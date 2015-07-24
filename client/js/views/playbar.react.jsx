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
    this.timer = setInterval(this.tick, this.state.speed);
    var glyphicon = 'pause';
    this.setState( {glyphicon} );
  },

  pause: function () {
    clearInterval(this.timer);
    var glyphicon = 'play';
    this.setState( {glyphicon} );
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

  end: function() {
    this.pause();
    var glyphicon = 'refresh';
    this.setState( {glyphicon} );
  },

  tick: function() {
    var now = this.state.now + 1;
    this.setState( {now} );
    if (now % 10 === 0) {
      this.props.updateCommitIndex(this.props.commitIndex + 1);
      if (now % (this.props.numberOfCommits*10) === 0) this.end();
      this.time.add(1);
      var date = this.time.toString();
      this.setState( {date} );
    }
  },

  handleClick: function() {
    if (this.state.glyphicon === 'play') {
      this.play();
    } else if (this.state.glyphicon === 'pause') {
      this.pause();
    } else {
      var glyphicon = 'play';
      var now = 0;
      this.time.reset();
      var date = this.time.toString();
      this.setState( {glyphicon, now, date} );
      this.props.reset();
    }
  },

  render: function () {
    return (
      <Row className='show-grid'>
        <Col xs={12} sm={12} md={12}><ProgressBar bsStyle='danger' now={this.state.now*10/this.props.numberOfCommits}/></Col>
        <Col xs={3} sm={3} md={2}>
          <ButtonToolbar>
            <ButtonGroup bsSize='medium'>
              <Button onClick={this.slowDown}><Glyphicon glyph='backward' /></Button>
              <Button onClick={this.handleClick}><Glyphicon glyph={this.state.glyphicon} /></Button>
              <Button onClick={this.speedUp}><Glyphicon glyph='forward' /></Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
        <Col xs={2} sm={2} md={1} className='text-center'><Well bsSize='small'>{this.speeds[this.state.speed]}x</Well></Col>
        <Col xs={3} sm={3} md={2} className='text-center'><Well bsSize='small'>{this.props.commitIndex}/{this.props.numberOfCommits} Commits</Well></Col>
        <Col xs={4} sm={3} md={3} className='text-center'><Well bsSize='small'>{this.state.date} / {this.totalTime.toString()}</Well></Col>
      </Row>
    )
  }
});

module.exports = Playbar;
