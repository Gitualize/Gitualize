var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Well = ReactBootstrap.Well;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;

var CommitInfo = React.createClass({
  styles: {
    imgStyle : {'height': 48+'px', 'width': 48+'px'}
  },

  render: function () {
    return (
        <Well bsSize='small'>
          <Grid>
            <Row className='show-grid'>
              <Col xs={2} sm={2} md={1}><img style={this.styles.imgStyle} src={this.props.currentCommit.avatarUrl + '&s=' + 48}/></Col>
              <Col xs={10} sm={10} md={11}>{this.props.currentCommit.message}</Col>
            </Row>
            <Row className='show-grid'>
              <Col xs={2} sm={2} md={1}>{this.props.currentCommit.committer}</Col>
            </Row>
          </Grid>
        </Well>
      )
  }
});

module.exports = CommitInfo;
