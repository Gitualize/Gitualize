var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Well = ReactBootstrap.Well;

var Directory = React.createClass({
  handleClick: function(path) {
    debugger;
    this.props.updateCurrentPath(path);
  },
  //map: function(obj, callback) {
    //var array = [];
    //for (var key in obj) {
      //if (key !== 'isFolder' && key !== 'path' && key !== 'deleted') {
        //array.push(callback(obj[key], key));
      //}
    //}
    //return array;
  //},
  //buildInner: function(value, depth, path) {
   //return (<div>{this.buildDirectory(value, depth, path)}</div>);
  //},
  //buildDirectory: function(obj, depth, path) {
    //var style = {
      //paddingLeft: (depth*10) + 'px'
    //};
    //return this.map(obj,function(value, key) { //TODO refactor
      //if (value.deleted) return;
      //var folderInnards;
      //if (value.isFolder) folderInnards = this.buildInner(value, depth+1, path+key+'/');
      //return (
        //<div>
          //<div style={style}><Glyphicon glyph={value.isFolder ? 'folder-open' : 'file'}/><Button bsSize="xsmall" onClick={this.handleClick(path+key)} bsStyle="link">{key}</Button></div>
          //{folderInnards}
        //</div>
      //);
    //}.bind(this));
  //},
  getInitialState: function() {
    return {path: this.props.fileTree}
  },

  render: function () {
    //var path = this.buildDirectory(this.props.fileTree, 0, '');

    return (
        <Well bsSize='small'>{ this.state.path }</Well>
      )
  }
});

module.exports = Directory;
