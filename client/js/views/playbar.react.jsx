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

var commitLength = 20; // fake data
var staticMath = 9.9/(commitLength);

var Playbar = React.createClass({
  clock: function(seconds) {
    var time = {};
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
    this.totalTime = this.clock(commitLength);
    return {
      date: this.time.toString(),
      now: 0,
      glyphicon: 'play',
      commit : 0
    };
  },

  play: function() {
    this.timer = setInterval(this.tick, 100);
    var glyphicon = 'pause';
    this.setState( {glyphicon} );
  },

  pause: function () {
    clearInterval(this.timer);
    var glyphicon = 'play';
    this.setState( {glyphicon} );
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
      if (now % (commitLength*10) === 0) this.end();
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
    }
  },

  render: function () {
    var tooltip = <Tooltip>{this.state.date}</Tooltip>;

    return (
      <div>
        <OverlayTrigger placement='top' overlay={tooltip}>
          <ProgressBar striped>
            <ProgressBar bsStyle='info' now={this.state.now*staticMath} key={1}/>
            <ProgressBar onClick={this.pause} onDrag={this.move} bsStyle='success' now={1} key={2} />
          </ProgressBar>
        </OverlayTrigger>
        <Grid>
          <Row className='show-grid'>
            <Col xs={3} md={3}><Button onClick={this.handleClick}><Glyphicon glyph={this.state.glyphicon} /></Button></Col>
            <Col xs={3} md={3} className='text-center'><Well bsSize='small'>{this.state.date} / {this.totalTime.toString()}</Well></Col>
            <Col xs={3} md={3} className='text-center'><Well bsSize='small'>some commit data?</Well></Col>
            <Col xs={3} md={3}></Col>
          </Row>
        </Grid>
      </div>
    )
  }
});

module.exports = Playbar;
