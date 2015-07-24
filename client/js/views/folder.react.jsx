var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Glyphicon = ReactBootstrap.Glyphicon;
var Button = ReactBootstrap.Button;
var FolderUtils = require('../utils/folderUtils');
var _ = require('underscore');
var Well = ReactBootstrap.Well;

var Folder = React.createClass({
  styles : {
    containerStyle: {
      width: '115px',
      height: '115px',
      margin: '3px',
      display: 'inline-block'
    },
    textStyle: {
      textAlign: 'center',
      wordWrap: 'break-word'
    },
    buttonStyle: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },

  render: function () {
    var context = this;
    var changes = {};
    var showFiles = {};
    var fileTree = this.props.fileTree;
    var pathArray = this.props.currentPath.split('/');
    var current = fileTree;
    var animation = {'renamed': 'slateblue', 'added': 'yellowgreen', 'modified': 'gold', 'removed': 'red'};
    var currentCommit = this.props.currentCommit.files;
    var commitLength = currentCommit.length;
    var merge = this.props.currentCommit.merge;

    for(var j=0; j < commitLength; j++) {
      changes[currentCommit[j].filename] = currentCommit[j].status;
    }

    // move to current directory
    if (pathArray[0] !== '') {
      for(var i=0, len = pathArray.length; i < len; i++) {
        current = current[pathArray[i]];
      }
    }

    // add file to list of files to show
    for(var key in current) {
      var currentDir = current[key];
      if(currentDir.deleted) {
        delete current[key];
      }
      if(currentDir.hasOwnProperty('isFolder')) {
        showFiles[key] = {filename: key};
        showFiles[key].style = currentDir.style || {'backgroundColor': 'white'};

        if(!merge && currentDir.path && changes[currentDir.path]){

          showFiles[key].style = {'backgroundColor': animation[changes[currentDir.path]]};
        }
        
        if(currentDir.isFolder) {
          showFiles[key].isFolder = true;
          for(var i=0; i<commitLength; i++) {
            var slicedPath = currentCommit[i].filename.substring(0, currentDir.path.length)
            if(!merge && currentDir.path === slicedPath) {
              showFiles[key].style = {'backgroundColor': 'orange'};
            }
          }
        }
      }
    }

    showFiles = Object.keys(showFiles).map(function(x){return showFiles[x]});
    showFiles = FolderUtils.fileSort(showFiles, {method: 'changed', reverse: false});
    showFiles = showFiles.map(function(file) {
      var fileName = file.filename;
      var iconType = FolderUtils.getFileType(fileName, file.isFolder); 

      return (
          <File iconType={iconType} fileName={fileName} animation={file.style} context={context}/>
        )
    });

    return (
        <Well bsSize='small'>{showFiles}</Well>     
      )
  }
});

var File = React.createClass({
  render: function() {
    var context = this.props.context;
    return (
        <div style={context.styles.containerStyle}>
          <Button style={_.extend(context.styles.buttonStyle, this.props.animation)} bsSize='large' onClick={function() {context.props.updateCurrentPath(context.props.currentPath === ''? this.props.fileName: context.props.currentPath + '/' + this.props.fileName)}}>
            <Glyphicon glyph={this.props.iconType}/>
          </Button>
          <p style={context.styles.textStyle}>{this.props.fileName.slice(this.props.fileName.lastIndexOf('/') + 1)}</p>
        </div>
      )
  }
})

module.exports = Folder;
