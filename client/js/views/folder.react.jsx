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
    var showFolders = {};
    var showFiles = {};
    var fileTree = this.props.fileTree;
    var pathArray = this.props.currentPath.split('/');
    var current = fileTree;

    for(var i=0, len = pathArray.length; i < len; i++) {
      current = current[pathArray[i]];
    }

    for(var key in current) {
      if(current[key].isFolder) {
        showFolders[key] = {filename: key};
      }

      if(current[key].showFile) {

      }
    }

    console.log(current)
    var allFiles = this.props.currentCommit.files && JSON.parse(this.props.currentCommit.files).filter(function (file) {

      var path = context.props.currentPath;
      var filename = file.filename;
      // var pathArray = context.props.currentPath;
      // var filePath = filename.split('/');
      // var path = pathArray.join('/');
      // var currentDir = pathArray[pathArray.length-1];
      // var prev = filePath[filePath.length-2]

      // console.log(path, filePath);
      console.log(filename)

      if(filename in current) {
        return true;
      }

      // console.log(filename);

      if (path === '') {
        return true;
      }

      if (filename.slice(0, path.length) !== path) {
        return false;
      }

      // if(filePath[filePath.length-3] === currentDir) {
      //   showFolders[prev] = {filename: prev}
      //   return false;
      // } else if (filePath[filePath.length-2] === currentDir) {
      //   return true;
      // }

    });

    // add showFolders to array of files
    allFiles = Object.keys(showFolders).map(function(x){return showFolders[x]}).concat(allFiles)

    // change to react elements
    allFiles = allFiles.map(function (file) {
      var fileName = file.filename;

      return <File icon={Tree.getFileIcon(fileName)}>
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
