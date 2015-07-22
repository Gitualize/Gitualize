var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var ProgressBar = ReactBootstrap.ProgressBar;
var Tooltip = ReactBootstrap.Tooltip;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;

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
    this.staticMath = 9.9/(this.props.numberOfCommits);
    this.totalTime = this.clock(this.props.numberOfCommits);
    this.speed = 100;
    return {
      date: this.time.toString(),
      now: 0,
      glyphicon: 'play',
      commit : 0
    };
  },

  play: function() {
    this.timer = setInterval(this.tick, this.speed);
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
      if (this.speed > 100) this.speed -= 50;
      if (this.state.glyphicon === 'pause') {
        clearInterval(this.timer);
        this.timer = setInterval(this.tick, this.speed);
      }
    }
  },

  slowDown: function() {
    if (this.state.glyphicon !== 'refresh') {
      if (this.speed < 250) this.speed += 50;
      if (this.state.glyphicon === 'pause') {
        clearInterval(this.timer);
        this.timer = setInterval(this.tick, this.speed);
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

  move: function() {
    if (this.state.glyphicon === 'play') console.log('can do something with drag');
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
    var tooltip = <Tooltip>{this.state.date} / {this.totalTime.toString()}</Tooltip>;

    return (
      <div>
        <OverlayTrigger placement='top' overlay={tooltip}>
          <ProgressBar striped>
            <ProgressBar bsStyle='info' now={this.state.now*this.staticMath} key={1}/>
            <ProgressBar onClick={this.pause} onDrag={this.move} bsStyle='success' now={1} key={2} />
          </ProgressBar>
        </OverlayTrigger>
        <Grid>
          <Row className='show-grid'>
            <Col xs={1} md={1}><Button onClick={this.slowDown} bsSize='large'><Glyphicon glyph='backward' /></Button></Col>
            <Col xs={1} md={1}><Button onClick={this.handleClick} bsSize='large'><Glyphicon glyph={this.state.glyphicon} /></Button></Col>
            <Col xs={1} md={1}><Button onClick={this.speedUp} bsSize='large'><Glyphicon glyph='forward' /></Button></Col>
            <Col xs={3} md={3} className='text-center'><Well bsSize='small'>{this.props.commitIndex}/{this.props.numberOfCommits} Commits</Well></Col>
            <Col xs={3} md={3}></Col>
          </Row>
        </Grid>
      </div>
    )
  }
});

module.exports = Playbar;
