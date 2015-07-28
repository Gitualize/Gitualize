var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var Tooltip = ReactBootstrap.Tooltip;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;

var NavHead = React.createClass({

  styles: {
    imgStyle : {'height': 16+'px', 'width': 16+'px'},
    navStyle : {marginBottom: '0'}
  },
  render: function() {
    return (
        <Navbar style={this.styles.navStyle} brand={<a href="#">Gitualize</a>}>          
          <Nav right>
            <OverlayTrigger placement='bottom' delayShow={1000} overlay={<Tooltip> Gitualize GitHub Repository </Tooltip>}>
              <NavItem href='https://github.com/incognizantdoppelganger/gitpun'><img style={this.styles.imgStyle} src='../pics/Github-Mark-64px.png'/></NavItem>
            </OverlayTrigger>
          </Nav>
        </Navbar>
      )
  }
});

module.exports = NavHead;