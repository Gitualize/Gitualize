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
var CommitInfo = require('./commitInfo.react.jsx');
var Tree = require('../utils/fileTreeUtils');

var $ = require('jquery');

var Visualize = React.createClass({
  mixins : [Navigation],
  getCommits: function () {
    //save accesstoken to localStorage for future repo requests
    if (!window.localStorage.gitHubAccessToken && this.props.query.accessToken) {
      window.localStorage.gitHubAccessToken = this.props.query.accessToken;
    }
    //remove accesstoken from url
    window.location.hash = window.location.hash.split('?')[0];

    // have app adjust size whenever browser window is resized
    window.onresize = function(){
      this.setState({windowHeight: $(window).height() - 305});
    }.bind(this);

    var repoFullName = this.props.params.repoOwner + '/' + this.props.params.repoName;
    $.getJSON('repos/'+repoFullName+'/commits', {accessToken: window.localStorage.gitHubAccessToken})
    .success(function(commits) {
      if (commits.msg === 'auth required') return window.location = commits.authUrl;
      if (!Array.isArray(commits)) this.transitionTo('/'); //TODO show error msg first
      commits.forEach(function(commit) {
        commit.files = JSON.parse(commit.files);
      });

      //build tree and flat path stuff before rendering
      var fileTree = {};
      Tree.updateFiles(commits[0], fileTree);
      this.setState({fileTree: fileTree, commits: commits});
      this.updatePaths();
    }.bind(this));
  },

  componentWillMount: function() {
    this.getCommits();
  },

  updatePaths: function () { //this should be in another utils fn like the tree stuff
    var filePaths = this.state.filePaths;
    var files = this.state.commits[this.state.commitIndex].files;
    files.forEach(function(file) {
      var path = file.filename;
      filePaths[path] = filePaths[path] || {};
      if (filePaths[path].raw_url) filePaths[path].last_url = filePaths[path].raw_url;
      filePaths[path].raw_url = file.raw_url;
      filePaths[path].commitIndex = this.state.commitIndex; //last updated commitIndex
      var pathArray = path.split('/');
      filePaths[path].isFolder = pathArray[pathArray.length-1] === '';
    }.bind(this));
    this.setState( {filePaths} );
  },

  updateCommitIndex: function (index) {
    Tree.updateFiles(this.state.commits[index], this.state.fileTree);
    this.setState({commitIndex: index});
    this.updatePaths();
  },

  updateCurrentPath: function (path) {
    this.setState({currentPath: path});
  },
  reset: function() {
    var fileTree = {};
    Tree.updateFiles(this.state.commits[0], fileTree);
    this.setState( {commitIndex: 0, currentPath: '', fileTree: fileTree, filePaths : {}} );
    this.updatePaths();
  },

  getInitialState: function() {
    return {windowHeight: $(window).height() - 305, commits: [], commitIndex: 0, currentPath: '', fileTree: {}, filePaths : {}};
  },

  fileOrFolder: function() {
    if (this.state.filePaths[this.state.currentPath] && !this.state.filePaths[this.state.currentPath].isFolder) {
      //<File key={this.state.currentPath + '/' + this.state.filePaths[this.state.currentPath].commitIndex} currentIndex={this.state.commitIndex} filePaths={this.state.filePaths} currentPath={this.state.currentPath}/>
      return (
        <Col xs={9} md={9} style={{height: this.state.windowHeight, overflow: 'scroll'}}>
          <File key={this.state.currentPath} currentIndex={this.state.commitIndex} filePaths={this.state.filePaths} currentPath={this.state.currentPath}/>
        </Col>
      )
    }
    else {
      return (
        <Col xs={9} md={9} style={{height: this.state.windowHeight, overflow: 'scroll'}}>
          <Folder fileTree={this.state.fileTree} currentCommit={this.state.commits[this.state.commitIndex]} currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
        </Col>
      )
    }
  },

  render: function () {
    if (Object.keys(this.state.fileTree).length > 0) { //fileTree loads last. bandaidy render check
      var maindisplay = this.fileOrFolder();

      return (
        <Grid>
          <Row className='show-grid'>
            <Col xs={12} md={12}>
             <Path repoName={this.props.params.repoName} currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
            </Col>
          </Row>

          <Row className='show-grid'>
            <Col xs={12} md={12}>
              <CommitInfo currentCommit={this.state.commits[this.state.commitIndex]}/>
            </Col>
          </Row>

          <Row className='show-grid'>
            <Col xs={3} md={3}>
              <div style={{backgroundColor: 'lightgray', height: this.state.windowHeight, overflow: 'scroll'}}>
                <Directory key={this.state.commitIndex} fileTree={this.state.fileTree} currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
              </div>
            </Col>
            {maindisplay}
          </Row>

          <Row className='show-grid'>
            <Col xs={12} md={12}>
              <div style={{position: 'relative', bottom: '0'}}>
                <Playbar style={{'marginBottom': '0'}} currentCommit={this.state.commits[this.state.commitIndex]} numberOfCommits={this.state.commits.length-1} commitIndex={this.state.commitIndex} updateCommitIndex={this.updateCommitIndex} reset={this.reset}/>
              </div>
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
