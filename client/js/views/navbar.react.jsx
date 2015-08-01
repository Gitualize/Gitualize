var ReactBootstrap = require('react-bootstrap');
var React = require('react/addons');
var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var Tooltip = ReactBootstrap.Tooltip;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;

var NavHead = React.createClass({

  styles: {
    imgStyle : { height: '20px', width: '20px'},
    navbarStyle : { marginBottom: '0' }
  },
  render: function() {
    return (
        <Navbar style={this.styles.navbarStyle} brand={<a href="#">Gitualize</a>} toggleNavKey={0}>          
          <Nav right eventKey={0}>
            <OverlayTrigger placement='bottom' delayShow={1000} overlay={<Tooltip> Gitualize GitHub Repository </Tooltip>}>
              <NavItem href='https://github.com/incognizantdoppelganger/gitpun'><img style={this.styles.imgStyle} src={'../../pics/GitHub-Mark-64px.png'}/></NavItem>
            </OverlayTrigger>
          </Nav>
        </Navbar>
      )
  }
});

module.exports = NavHead;