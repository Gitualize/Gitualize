var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Well = ReactBootstrap.Well;

var Directory = React.createClass({
  map: function(obj, callback) {
    var array = [];
    for (var key in obj) {
      if (key !== 'isFolder') {
        array.push(callback(obj[key], key));
      }
    }
    return array;
  },

  buildDirectory: function(obj, depth, path) {
    var style = {
      paddingLeft: (depth*10) + 'px'
    }
    return this.map(obj,function(value, key) { //TODO refactor
      if (value.isFolder) {
        return (
          <div>
            <div style={style}><Glyphicon glyph="folder-open" /><Button bsSize="xsmall" onClick={ function() {this.props.updateCurrentPath(path + key)}.bind(this) } bsStyle="link">{key}</Button></div>
            <div>{this.buildDirectory(value, depth+1,path + key + '/') }</div>
          </div>
        )
      } else {
        return <div style={style}><Glyphicon glyph="file" /><Button bsSize="xsmall" onClick={ function() {this.props.updateCurrentPath(path + key)}.bind(this) } bsStyle="link">{key}</Button></div>
      }
    }.bind(this));
  },

  render: function () {
    var path = this.buildDirectory(this.props.fileTree, 0, '');

    return (
        <Well bsSize='small'>{ path }</Well>
      )
  }
});

module.exports = Directory;
