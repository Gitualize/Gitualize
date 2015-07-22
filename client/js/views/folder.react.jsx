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
    var current = fileTree;
    var animation = {'renamed': 'green', 'added': 'green', 'modified': 'green', 'deleted': 'red'};

    var currentCommit = this.props.currentCommit.files;
    for(var j=0, len2=currentCommit.length; j < len2; j++) {
      //console.log(currentCommit[j]);
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
