var Navbar = React.createClass({
  render: function() {
    <Navbar brand={<a href="#">Gitualize</a>}>
      <Nav>
        <NavItem eventKey={1} href='#'>Link</NavItem>
        <NavItem eventKey={2} href='#'>Link</NavItem>
        <DropdownButton eventKey={3} title='Dropdown'>
          <MenuItem eventKey='1'>Action</MenuItem>
          <MenuItem eventKey='2'>Another action</MenuItem>
          <MenuItem eventKey='3'>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey='4'>Separated link</MenuItem>
        </DropdownButton>
      </Nav>
    </Navbar>
  }
});

module.exports = Navbar;