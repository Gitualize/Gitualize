var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var Popover = ReactBootstrap.Popover;
var Tooltip = ReactBootstrap.Tooltip;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;

var About = React.createClass({

  getInitialState: function() {
    return { showModal: false };
  },

  close: function() {
    this.setState({ showModal: false });
  },

  open: function() {
    this.setState({ showModal: true });
  },

  render: function() {
    var popover = <Popover title='popover'>very popover. such engagement</Popover>;
    var tooltip = <Tooltip>wow.</Tooltip>;

    return (
      <div>
        <p>Hello World! We are Gitualize</p>

        <Button
          bsStyle='primary'
          bsSize='large'
          onClick={this.open}
        >
          DEVILRY!1!!
        </Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Terrys Diary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Demon Encantations</h4>
            <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>

            <h4>Communist Lingo</h4>
            <p>there is a <OverlayTrigger overlay={popover}><a href='#'>popover</a></OverlayTrigger> here</p>

            <h4>Witch doctor stuff</h4>
            <p>there is a <OverlayTrigger overlay={tooltip}><a href='#'>tooltip</a></OverlayTrigger> here</p>

            <hr />

            <h4>Comcast Customer Relations Manual</h4>
            <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
            <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
            <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

module.exports = About;