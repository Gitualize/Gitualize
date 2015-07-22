var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Glyphicon = ReactBootstrap.Glyphicon;
var Button = ReactBootstrap.Button;
var Tree = require('../fileTreeUtils');
var _ = require('underscore');

var File = React.createClass({
  listStyle: { //TODO to styles.css
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
        <Button style={_.extend(this.buttonStyle, this.props.animation)} bsSize='large' onClick={this.props.onClick}><Glyphicon glyph={this.props.icon}/></Button>
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
    var changes = {};
    var showFiles = {};
    var fileTree = this.props.fileTree;
    var pathArray = this.props.currentPath.split('/');
    var fileTree = this.props.fileTree;
    var current = fileTree;
    var animation = {'renamed': 'green', 'added': 'green', 'modified': 'green', 'deleted': 'red'};

    var currentCommit = JSON.parse(this.props.currentCommit.files);
    console.log(currentCommit)
    for(var j=0, len2=currentCommit.length; j < len2; j++) {
      console.log(currentCommit[j]);
      changes[currentCommit[j].filename] = currentCommit[j].status;
    }

    console.log(changes)

    // move to current directory
    for(var i=0, len = pathArray.length; i < len; i++) {
      current = current[pathArray[i]];
    }

    // add file to list of files to show
    for(var key in current) {
      if(current[key].hasOwnProperty('isFolder')) {
        showFiles[key] = {filename: key};

        if(current[key].path && changes[current[key].path]){
          showFiles[key].style = {'background-color': animation[changes[current[key].path]]};
          console.log('ANIMATION');
        }
      }
    }


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

    console.log(showFiles);


    showFiles = Object.keys(showFiles).map(function(x){return showFiles[x]});
    showFiles = showFiles.map(function (file) {
      var fileName = file.filename;
      var style = file.style || {'background-color': 'white'};

      return <File icon={Tree.getFileType(fileName)} animation={style} onClick={function(){this.props.updateCurrentPath(this.props.currentPath + '/' + fileName)}.bind(context)}>
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
