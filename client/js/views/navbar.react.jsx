var $ = require('jquery');
// var bootstrap = require('bootstrap');
var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
// var NavItem = ReactBootstrap.NavItem;
// var DropdownButton = ReactBootstrap.DropdownButton;
// var MenuItem = ReactBootstrap.MenuItem;

var NavHead = React.createClass({
  render: function() {
    return (
    <Navbar brand={<a href="#">Gitualize</a>}>
      <Nav>

      </Nav>
    </Navbar>)
  }
});

module.exports = NavHead;

        // <NavItem eventKey={1} href='#'>Link</NavItem>
        // <NavItem eventKey={2} href='#'>Link</NavItem>
        // <DropdownButton eventKey={3} title='Dropdown'>
        //   <MenuItem eventKey='1'>Action</MenuItem>
        //   <MenuItem eventKey='2'>Another action</MenuItem>
        //   <MenuItem eventKey='3'>Something else here</MenuItem>
        //   <MenuItem divider />
        //   <MenuItem eventKey='4'>Separated link</MenuItem>
        // </DropdownButton>