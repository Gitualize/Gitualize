var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Glyphicon = ReactBootstrap.Glyphicon;
var Button = ReactBootstrap.Button;

var File = React.createClass({
  listStyle: {
    'list-style-type': 'none',
    display: 'inline-block',
    margin: '3px',
    float: 'left'
  },
  containerStyle: {
    width: '115px',
    height: '115px'
  },
  buttonStyle: {
    'display': 'block',
    'margin-left': 'auto',
    'margin-right': 'auto'
  },
  textStyle: {
    'text-align': 'center',
    'word-wrap': 'break-word'
  },
  render: function () {
    return <li style={this.listStyle}>
      <div style={this.containerStyle}>
        <Button style={this.buttonStyle} bsSize='large' ><Glyphicon glyph={this.props.icon}/></Button>
        <div>
          <p style={this.textStyle}>{this.props.children}</p>
        </div>
      </div>
    </li>
  }
});

var Folder = React.createClass({
  getFileIcon: function(fileName){
    var images = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'svg'];
    var idx = fileName.lastIndexOf('.');
    if(idx > -1) {
      var format = (fileName.substring(idx + 1)).toLowerCase();
      console.log(format);
      return images.indexOf(format) > -1? 'picture' : 'file';
    } else {
      return 'folder-close';
    }
  },
  render: function () {
    var context = this;
    var allFiles = this.props.currentCommit.files && JSON.parse(this.props.currentCommit.files).filter(function (file) {
      var path = context.props.currentPath;
      if (path === '') {
        return true;
      }
      if (file.filename.slice(0, path.length) !== path) {
        return false;
      }
      return true;
      })
      .map(function (file) {
        var fileName = file.filename;

        return <File icon={context.getFileIcon(fileName)}>
          {fileName.slice(fileName.lastIndexOf('/') + 1)}
        </File>
      });

    return <div>
      <h2>Folder view</h2>
      <ul>
        {allFiles}
      </ul>
    </div>
  }
});

module.exports = Folder;
