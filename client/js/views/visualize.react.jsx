var React = require('react');
var Navigation = require('react-router').Navigation;
var $ = require('jquery');
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;

var Path = require('./path.react.jsx');
var Directory = require('./directory.react.jsx');
var File = require('./file.react.jsx');
var Folder = require('./folder.react.jsx');
var Playbar = require('./playbar.react.jsx');
var Tree = require('../fileTreeUtils');

var Visualize = React.createClass({
  mixins : [Navigation],
  getCommits: function () {
    //console.log('accessToken now: ', this.props.query.accessToken);
    var repoFullName = this.props.params.repoOwner + '/' + this.props.params.repoName;
    $.getJSON('repos/'+repoFullName+'/commits', {accessToken: this.props.query.accessToken})
    .success(function(commits) {
      if (commits.msg === 'auth required') {
        window.location = commits.authUrl; //transitionTo doesn't work for external urls
      }
      this.setState({commits: commits});
      this.updateFiles();
    }.bind(this));
  },

  addFile: function (filePath) {
    return Tree.addFile(this.state.fileTree, filePath);
  },

  removeFile: function (filePath) {
    Tree.removeFile(this.state.fileTree, filePath);
  },

  updateFiles: function () {
    var files = JSON.parse(this.state.commits[this.state.commitIndex].files);
    for (var i = 0; i < files.length; i++) {
      if (files[i].status === 'added') {
        this.addFile(files[i].filename);
      } else if (files[i].status === 'deleted') {
        this.removeFile(files[i].filename);
      } else {
        console.log('modified: ', files[i].filename);
        this.addFile(files[i].filename);
      }
    }
  },

  componentDidMount: function() {
    this.getCommits();
    //add all the files, but after getCommits finishes
    // var files = JSON.parse(this.state.commits[this.state.commitIndex].files);
    // for (var i = 0; i < files.length; i++) {
    //   this.addFile(files[i].filename);
    // }
  },

  updateCommitIndex: function (index) {
    this.setState({commitIndex: index});
    this.updateFiles();
  },

  updateCurrentPath: function (path) {
    if (typeof path === 'string') path = path.split('/');
    this.setState({currentPath: path});
  },

  getInitialState: function() {
    return {commits: [], commitIndex: 0, currentPath: [], fileTree: {}};
  },

  fileOrFolder: function() {
    var current = this.state.fileTree;
    for (var i = 0; i < this.state.currentPath.length; i++) current = current[this.state.currentPath[i]];
    if (current.isFolder) {
      return (
          <Col xs={9} md={9}>
            <Folder currentCommit={this.state.commits[this.state.commitIndex]} currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
          </Col>
        )
    }
    else {
      return (
          <Col xs={9} md={9}>
            <File key={this.state.currentPath} currentCommit={this.state.commits[this.state.commitIndex]} currentPath={this.state.currentPath}/>
          </Col>
        )
    }
  },

  render: function () {
    var maindisplay = this.fileOrFolder();

    if (this.state.commits.length > 0) {
      return (
        <Grid>
          <Row className='show-grid'>
            <Col xs={12} md={12}>
              <Path currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
            </Col>
          </Row>

          <Row className='show-grid'>
            <Col xs={3} md={3}>
              <Directory fileTree={this.state.fileTree} currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
            </Col>
            {maindisplay}
          </Row>

          <Row className='show-grid'>
            <Col xs={12} md={12}>
              <Playbar currentCommit={this.state.commits[this.state.commitIndex]} numberOfCommits={this.state.commits.length} commitIndex={this.state.commitIndex} updateCommitIndex={this.updateCommitIndex}/>
            </Col>
          </Row>
        </Grid>
      )
    } else {
      return (
          <div>
          </div>
        )
    }
  }
});

module.exports = Visualize;
