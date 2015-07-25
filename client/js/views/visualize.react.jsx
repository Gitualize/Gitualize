var React = require('react');
var Navigation = require('react-router').Navigation;
var $ = require('jquery');
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Modal = ReactBootstrap.Modal;
var Input = ReactBootstrap.Input;
var ButtonInput = ReactBootstrap.ButtonInput;

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
      if (commits.msg === 'auth required') { //redirect to auth
        return window.location = commits.authUrl;
      }
      if (!Array.isArray(commits)) { //repo fetch failed
        return this.transitionTo('/', null, {error: 'badRepo'});
      }

      commits.forEach(function(commit) {
        commit.files = JSON.parse(commit.files);
      });
      //build tree and flat path stuff before rendering
      Tree.updateFiles(commits[0], this.state.fileTree);
      this.updatePaths(0, commits);
      this.setState({commits: commits});
    }.bind(this));
  },

  componentWillMount: function() {
    this.getCommits();
  },

  updatePaths: function (index, commits) { //this should be in another utils fn like the tree stuff
    var filePaths = this.state.filePaths;
    var files = commits? commits[index].files : this.state.commits[index].files;
    files.forEach(function(file) {
      var path = file.filename;
      filePaths[path] = filePaths[path] || {};
      if (filePaths[path].raw_url) filePaths[path].last_url = filePaths[path].raw_url;
      filePaths[path].raw_url = file.raw_url;
      filePaths[path].commitIndex = this.state.commitIndex; //last updated commitIndex
      var pathArray = path.split('/');
      filePaths[path].isFolder = pathArray[pathArray.length-1] === '';
    }.bind(this));
  },

  updateCommitIndex: function (index) {
    Tree.updateFiles(this.state.commits[index], this.state.fileTree);
    this.updatePaths(index);
    this.setState( {commitIndex: index, filePaths: this.state.filePaths, fileTree: this.state.fileTree} );
  },

  updateCurrentPath: function (path) {
    this.setState({currentPath: path});
  },

  showFileGitualize: function() {
    this.setState( {showFileGitualize: true} );
  },

  closeFileGitualize: function() {
    this.setState( {showFileGitualize: false, urls: {form: '', to: ''}, help: 'Read up on tips and tricks!'} );
  },

  reset: function() {
    var fileTree = {};
    Tree.updateTree(this.state.commits[0], fileTree);
    this.setState( {commitIndex: 0, currentPath: '', fileTree: fileTree, filePaths : {}} );
    this.updatePaths();
  },

  getInitialState: function() {
    return {windowHeight: $(window).height() - 305, commits: [], commitIndex: 0, currentPath: '', fileTree: {}, filePaths : {}, showFileGitualize: false, urls: {form: '', to: ''}, help: 'Read up on tips and tricks!'};
  },

  fileOrFolder: function() {
    if (this.state.filePaths[this.state.currentPath] && !this.state.filePaths[this.state.currentPath].isFolder) {
      //<File key={this.state.currentPath + '/' + this.state.filePaths[this.state.currentPath].commitIndex} currentIndex={this.state.commitIndex} filePaths={this.state.filePaths} currentPath={this.state.currentPath}/>
      return (
        <Col xs={9} md={9} style={{height: this.state.windowHeight, overflow: 'scroll'}}>
          <File key={this.state.currentPath} currentIndex={this.state.commitIndex} urls={this.state.urls} filePaths={this.state.filePaths} currentPath={this.state.currentPath}/>
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

  validCommit : function(to,from) {
    if (!from && this.state.commitIndex + to >= 0 && this.state.commitIndex + to < this.state.commits.length) return true;
    else if (from <= to && from >= 0 && to < this.state.commits.length) return true;
    return false;
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var from = parseInt(this.refs.from.getValue());
    var to = parseInt(this.refs.to.getValue());
    var repoFullName = this.props.params.repoOwner + '/' + this.props.params.repoName;
    if (!isNaN(from) && !isNaN(to) && this.validCommit(to,from)) {
      var toUrl = this.state.commits[to].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + this.state.currentPath;
      var fromUrl = this.state.commits[from].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + this.state.currentPath;
      console.log(toUrl,fromUrl);
      $.get(toUrl)
      .always(function(toStatus) {
        $.get(fromUrl)
        .always(function(fromStatus) {
          if (toStatus.status === 'OK' && fromStatus.status === 'OK') {
            this.setState ( {urls: {from: fromUrl, to: toUrl}} );
          } else if (toStatus.status === 'OK') {
            this.setState( {help: "File doesn't exist at: " + from + '!'});
          } else if (fromStatus.status === 'OK') {
            this.setState( {help: "File doesn't exist at: " + to + '!'});
          } else {
            this.setState( {help: "File doesn't exist at: " + from + ', or: ' + to +'!'});
          }
        });
      });
    } else if (!isNaN(to) && this.validCommit(to)) {
      to = this.state.commitIndex + to;
      var toUrl = this.state.commits[to].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + this.state.currentPath;
      var fromUrl = '';
      $.get(toUrl)
      .always(function(toStatus) {
        if (toStatus.status === 'OK') {
          if (to < this.state.commitIndex) {
            fromUrl = toUrl;
            toUrl = this.state.commits[this.state.commitIndex].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + this.state.currentPath;
          } else {
            fromUrl = this.state.commits[this.state.commitIndex].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + this.state.currentPath;
          }
          this.setState ( {urls: {from: fromUrl, to: toUrl}} );
        } else {
          this.setState( {help: "File doesn't exist at: " + to + '!'});
        }
      });
    } else {
      this.setState( {help: 'Invalid Entry!'});
    }
  },

  modalOrNo: function() {
    if (this.state.showFileGitualize) {
      return (
          <Modal.Body>
            <Input label='Enter a commit range' help={this.state.help + ' The current commit index is: ' + this.state.commitIndex} wrapperClassName='wrapper'>
              <Row>
                <Col xs={4}><Input type='text' ref='from' addonBefore='From:' bsSize="small" placeholder='here' className='form-control' /></Col>
                <Col xs={4}><Input type='text' ref='to' addonBefore='To:' bsSize="small" placeholder='there' className='form-control' /></Col>
                <Col xs={4}><ButtonInput onSubmit={this.handleSubmit} onClick={this.handleSubmit} bsSize="small" type='submit' value='Gitualize'/></Col>
              </Row>
            </Input>
            <hr />
            <div style={{height: this.state.windowHeight, overflow: 'scroll'}}>
              <File urls={this.state.urls} currentIndex={this.state.commitIndex} filePaths={this.state.filePaths} currentPath={this.state.currentPath}/>
            </div>
          </Modal.Body>
        )
    } else {
      return ;
    }
  },

  render: function () {
    if (Object.keys(this.state.fileTree).length > 0) { //fileTree loads last. bandaidy render check
      //TODO uncomment these- it's logging multiple times on first load??
      //console.dir(this.state.commits);
      //console.log('filetree: ',this.state.fileTree);
      //console.log('commit index: ',this.state.commitIndex);
      var maindisplay = this.fileOrFolder();
      var modal = this.modalOrNo();

      return (
        <div>
          <Grid>
            <Row className='show-grid'>
              <Col xs={12} md={12}>
                <Path repoName={this.props.params.repoName} currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
              </Col>
            </Row>

            <CommitInfo currentCommit={this.state.commits[this.state.commitIndex]}/>

            <Row className='show-grid'>
              <Col xs={3} md={3}>
                <div style={{backgroundColor: 'lightgray', height: this.state.windowHeight, overflow: 'scroll'}}>
                  <Directory fileTree={this.state.fileTree} currentPath={this.state.currentPath} updateCurrentPath={this.updateCurrentPath}/>
                </div>
              </Col>
              {maindisplay}
            </Row>

            <Playbar currentCommit={this.state.commits[this.state.commitIndex]} numberOfCommits={this.state.commits.length-1} commitIndex={this.state.commitIndex} updateCommitIndex={this.updateCommitIndex} reset={this.reset} showFileGitualize={this.showFileGitualize} isFile={this.state.filePaths[this.state.currentPath] && !this.state.filePaths[this.state.currentPath].isFolder}/>
          </Grid>

          <Modal show={this.state.showFileGitualize} onHide={this.closeFileGitualize}>
            <Modal.Header closeButton>
              <Modal.Title>Gitualizing {this.state.currentPath}</Modal.Title>
            </Modal.Header>
            {modal}
          </Modal>
        </div>
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