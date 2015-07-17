var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var ProgressBar = ReactBootstrap.ProgressBar;
var Tooltip = ReactBootstrap.Tooltip;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;

var commitLength = 60; // fake data

var Playbar = React.createClass({
  clock: function(seconds) {
    this.time = {};
    this.time.hours = Math.floor(seconds/3600);
    this.time.minutes = Math.floor(seconds/60) - this.time.hours*60;
    this.time.seconds = seconds - this.time.hours*3600 - this.time.minutes*60;
    this.time.total = seconds;
    this.time.toString = function() {
      return (this.hours > 9? this.hours: '0' + this.hours) + ':' + (this.minutes > 9? this.minutes: '0' + this.minutes)+ ':' + (this.seconds > 9? this.seconds: '0' + this.seconds);
    }
    this.time.add = function(n) {
      this.total += n;
      this.seconds += n;
      this.minutes += Math.floor(this.seconds/60);
      this.hours += Math.floor(this.minutes/60);
      this.seconds = this.seconds % 60;
      this.minutes = this.minutes % 60;
    }
  },

  getInitialState: function() {
    this.clock(0);
    return {
      date: this.time.toString(),
      now: 0,
      glyphicon: 'pause',
      commit : 0
    };
  },

  play: function() {
    this.timer = setInterval(this.tick, 100);
  },

  pause: function () {
    clearInterval(this.timer);
  },

  tick: function() {
    var now = this.state.now + 1;
    this.setState( {now} );
    if (now % 10 === 0) {
      if (now % (commitLength*10) === 0) this.pause();
      this.time.add(1);
      var date = this.time.toString();
      this.setState( {date} );
    }
  },

  handleClick: function() {
    if (this.state.glyphicon === 'pause') {
      var glyphicon = 'play';
      this.setState( {glyphicon} );
      this.play();
    } else {
      var glyphicon = 'pause';
      this.setState( {glyphicon} );
      this.pause();
    }
  },

  render: function () {
    var tooltip = <Tooltip>{this.state.date}</Tooltip>;

    return (
        <div>
          <OverlayTrigger placement='top' overlay={tooltip}>
            <ProgressBar striped bsStyle='info' now={this.state.now*(10/commitLength)} />
          </OverlayTrigger>
          <Button onClick={this.handleClick}><Glyphicon glyph={this.state.glyphicon} /></Button>
        </div>
      )
  }
});

module.exports = Playbar;
