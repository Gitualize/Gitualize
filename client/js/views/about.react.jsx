var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var Popover = ReactBootstrap.Popover;
var Tooltip = ReactBootstrap.Tooltip;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;

var About = React.createClass({
  render: function() {
    return (
      <div>
        <p>Hello World! We are Gitualize</p>
      </div>
    );
  }
});

module.exports = About;