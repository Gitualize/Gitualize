var React = require('react/addons');


var Loader = React.createClass({
  styles: {
    loadingStyle: {
      width: 'auto',
      marginTop: 50,
      padding: 50,
      backgroundColor: 'cornflowerBlue'
    },
    spinnerStyle: {
      width: '20%',
      hieght: '20%',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    textStyle: {
      textAlign: 'center'
    }
  },
  render: function(){

    return (
      <div style={this.styles.loadingStyle}>
        <img style={this.styles.spinnerStyle} src={'../../pics/octocat-spinner.svg'}/>
        <p style={this.styles.textStyle}> Loading from </p>
        <img style={this.styles.spinnerStyle} src={'../../pics/GitHub_Logo.png'}/>
      </div>
    )
  }
})

module.exports = Loader;