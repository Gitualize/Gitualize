var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Well = ReactBootstrap.Well;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;

var CommitInfo = React.createClass({
  styles: {
    imgStyle : {
      height: 48,
      width: 48,
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    textStyle: {
      textAlign: 'center',
      display: 'block',
      wordWrap: 'break-word',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    wellStyle: {
      height: 90
    }
  },

  render: function () {
    return (
        <Row className='show-grid'>
          <Col xs={3} sm={3} md={3}>
            <Well style={this.styles.wellStyle} bsSize='small'>
              <img style={this.styles.imgStyle} src={this.props.currentCommit.avatarUrl + '&s=' + 48}/>
              <a style={this.styles.textStyle} target="_blank" href={"https://github.com/" + this.props.currentCommit.committer}>{this.props.currentCommit.committer}</a>
            </Well>
          </Col>
          <Col xs={9} sm={9} md={9}><Well style={this.styles.wellStyle} bsSize='small'>{this.props.currentCommit.message}</Well></Col>
        </Row>
      )
  }
});

module.exports = CommitInfo;
