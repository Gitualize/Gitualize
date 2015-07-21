var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Glyphicon = ReactBootstrap.Glyphicon;
var Button = ReactBootstrap.Button;
var Tree = require('../fileTreeUtils');

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
  render: function () {
    var context = this;
    var showFiles = {};
    var showFiles = {};
    var fileTree = this.props.fileTree;
    var pathArray = this.props.currentPath.split('/');
    var current = fileTree;

    for(var i=0, len = pathArray.length; i < len; i++) {
      current = current[pathArray[i]];
    }

    for(var key in current) {
      if(current[key].hasOwnProperty('isFolder')) {
        showFiles[key] = {filename: key};
      }
    }

    console.log(current)

    // var allFiles = this.props.currentCommit.files && JSON.parse(this.props.currentCommit.files).filter(function (file) {
      // var path = context.props.currentPath;
      // var filename = file.filename;
      // var pathArray = context.props.currentPath;
      // var filePath = filename.split('/');
      // var path = pathArray.join('/');
      // var currentDir = pathArray[pathArray.length-1];
      // var prev = filePath[filePath.length-2]

      // if(filename in current) {
      //   return true;
      // }

      // if (path === '') {
      //   return true;
      // }

      // if (filename.slice(0, path.length) !== path) {
      //   return false;
      // }
    // });

    showFiles = Object.keys(showFiles).map(function(x){return showFiles[x]});
    showFiles = showFiles.map(function (file) {
      var fileName = file.filename;

      return <File icon={Tree.getFileIcon(fileName)}>
        {fileName.slice(fileName.lastIndexOf('/') + 1)}
      </File>
    });

    return <div>
      <h2>Folder view</h2>
      <ul>
        {showFiles}
      </ul>
    </div>
  }
});

module.exports = Folder;
