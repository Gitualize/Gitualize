var $ = require('jquery');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Modal = ReactBootstrap.Modal;
var Input = ReactBootstrap.Input;
var ButtonInput = ReactBootstrap.ButtonInput;

var File = require('./file.react.jsx');

var Diffualize = React.createClass({
  getInitialState: function() {
    return {help: 'Enter a range or from can be left blank and to can be ±n commits.', urls: {from: '', to: ''}};
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var from = parseInt(this.refs.from.getValue());
    var to = parseInt(this.refs.to.getValue());
    var context = this;
    if (!isNaN(from) && !isNaN(to) && this.validCommit(to,from)) {
      var toUrl = this.props.commits[to].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + this.props.currentPath;
      var fromUrl = this.props.commits[from].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + this.props.currentPath;
      $.get(toUrl)
      .always(function(toStatus) {
        $.get(fromUrl)
        .always(function(fromStatus) {
          if ((typeof toStatus === 'string' || toStatus.statusText === 'OK') && (typeof fromStatus === 'string' || fromStatus.statusText === 'OK')) {
            context.setState ( {urls: {from: fromUrl, to: toUrl}, help: 'Diffualizing from commit ' + from + ' to ' + to + '!'} );
          } else if (typeof toStatus === 'string' || toStatus.statusText === 'OK') {
            context.setState( {help: "File doesn't exist at: " + from + '!'});
          } else if (typeof fromStatus === 'string' || fromStatus.statusText === 'OK') {
            context.setState( {help: "File doesn't exist at: " + to + '!'});
          } else {
            context.setState( {help: "File doesn't exist at: " + from + ', or: ' + to +'!'});
          }
        });
      });
    } else if (!isNaN(to) && this.validCommit(to,from)) {
      to = this.props.commitIndex + to;
      var toUrl = this.props.commits[to].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + this.props.currentPath;
      var fromUrl = context.state.commits[context.state.commitIndex].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + context.state.currentPath;
      $.get(toUrl)
      .always(function(toStatus) {
        if (typeof toStatus === 'string' || toStatus.statusText === 'OK') {
          if (to < context.state.commitIndex) {
            context.setState ( {urls: {from: toUrl, to: fromUrl}, help: 'Diffualizing from commit ' + to + ' to ' + context.state.commitIndex + '!'} );
          } else {
            context.setState ( {urls: {from: fromUrl, to: toUrl}, help: 'Diffualizing from commit ' + context.state.commitIndex + ' to ' + to + '!'} );
          }
        } else {
          context.setState( {help: "File doesn't exist at: " + to + '!'});
        }
      });
    } else {
      this.setState( {help: 'Invalid Entry!'});
    }
  },

  validCommit : function(to,from) {
    if (!from && this.props.commitIndex + to >= 0 && this.props.commitIndex + to < this.props.commits.length) return true;
    else if (from <= to && from >= 0 && to < this.props.commits.length) return true;
    return false;
  },

  render: function () {
    return (
      <Modal.Body>
        <Input label={'Enter a commit range. The current commit index is: ' + this.props.commitIndex} help={this.state.help} wrapperClassName='wrapper'>
          <Row>
            <Col xs={4}><Input type='text' ref='from' addonBefore='From:' bsSize="small" placeholder='here' className='form-control' /></Col>
            <Col xs={4}><Input type='text' ref='to' addonBefore='To:' bsSize="small" placeholder='there' className='form-control' /></Col>
            <Col xs={4}><ButtonInput onSubmit={this.handleSubmit} onClick={this.handleSubmit} bsSize="small" type='submit' value='Diffualize'/></Col>
          </Row>
        </Input>
        <hr />
        <pre style={{wordWrap: 'break-word; white-space; pre-wrap',height: this.props.windowHeight, overflow: 'scroll'}}>
          <File key={this.state.urls.from+this.state.urls.to} urls={this.state.urls} filePaths={this.props.filePaths} currentPath={this.props.currentPath}/>
        </pre>
      </Modal.Body>
    )
  }
});

module.exports = Diffualize;
