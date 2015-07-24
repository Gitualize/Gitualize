var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;

var NavHead = React.createClass({
  styles: {
    imgStyle : {'height': 16+'px', 'width': 16+'px'},
    navStyle : {marginBottom: '0'}
  },

  render: function() {
    return (
        <Navbar style={this.styles.navStyle} brand={<a href="#">Gitualize</a>}>
          <Nav right>
            <NavItem href='https://github.com/incognizantdoppelganger/gitpun'><img style={this.styles.imgStyle} src='../pics/Github-Mark-64px.png'/></NavItem>
          </Nav>
        </Navbar>
      )
  }
});

module.exports = NavHead;