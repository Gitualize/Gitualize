var React = require('react');
var socketURL = process.env.SOCKET_URL || 'http://localhost:3000';
var socket = require('socket.io-client')(socketURL);
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
var Loading = require('./loading.react.jsx');

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
    socket.emit('getCommits', {accessToken: window.localStorage.gitHubAccessToken, repoFullName: repoFullName});
    socket.on('gotCommitsError', function(error) { //error scraping w/ spooky, probably b/c repo doesn't exist. (first step in getting commit data)
      return this.transitionTo('/', null, {error: 'badRepo'});
    }.bind(this));
    socket.on('authRequired', function(data) {
      window.location = data.authUrl; //redirect to auth
    });
    //ye olde HTTP request way
    //$.getJSON('repos/'+repoFullName+'/commits', {accessToken: window.localStorage.gitHubAccessToken})
    //.success(function(commits) {
      //if (commits.msg === 'auth required') { //redirect to auth
        //return window.location = commits.authUrl;
      //}
      //console.log('normal get request gets db commits for now:', commits);
      //if (!Array.isArray(commits)) { //repo fetch failed
      //return this.transitionTo('/', null, {error: 'badRepo'});
      //}
      ////commits.forEach(function(commit) {
      ////commit.files = JSON.parse(commit.files);
      ////});
    //});
    var firstCommit = true; //for now
    socket.on('gotCommits', function(commits) {
      commits = JSON.parse(commits);
      console.log('got socket commits: ', commits);
      commits.forEach(function(commit) {
        commit.files = JSON.parse(commit.files);
      });
      //build tree and flat path stuff before rendering
      if (firstCommit) {
        Tree.updateTree(commits[0], this.state.fileTree);
        this.updatePaths(0, commits);
        firstCommit = false;
      }
      this.setState({commits: this.state.commits.concat(commits)});
    }.bind(this));
  },

  componentWillMount: function() {
    socket.on('connect', function(socket) {
      console.log('connected to server to get chunks of commits');
    });
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
    if (index >= this.state.commits.length) {
      return null;
    }
    if (this.state.playbarDirection === 'forward') {
      Tree.updateTree(this.state.commits[index], this.state.fileTree, 'forward');
      this.updatePaths(index);
      this.setState( {commitIndex: index, filePaths: this.state.filePaths, fileTree: this.state.fileTree} );
      return;
    }
    if (index >= 0) {
      Tree.updateTree(this.state.commits[index + 1], this.state.fileTree, 'backward');
    }
    this.updatePaths(index);
    this.setState( {commitIndex: index, filePaths: this.state.filePaths, fileTree: this.state.fileTree} );
  },

  updateCurrentPath: function (path) {
    this.setState({currentPath: path});
  },

  showFileDiffualize: function() {
    this.setState( {showFileDiffualize: true} );
  },

  closeFileDiffualize: function() {
    this.setState( {showFileDiffualize: false, urls: {form: '', to: ''}, help: 'Read up on tips and tricks!'} );
  },

  updatePlaybarDirection: function (direction) {
    this.setState({playbarDirection: direction});
  },

  reset: function() {
    var fileTree = {};
    Tree.updateTree(this.state.commits[0], fileTree);
    this.state.filePaths = {};
    this.updatePaths(0);
    this.setState( {commitIndex: 0, currentPath: '', fileTree: fileTree, playbarDirection: 'forward'} );
  },
  //getDefaultProps: function () { //please put defaults here (if you must) instead of state
  //return { hi: 'hey' };
  //},

  getInitialState: function() {
    return {windowHeight: $(window).height() - 305, commits: [], commitIndex: 0, currentPath: '', fileTree: {}, filePaths : {}, playbarDirection: 'forward', showFileDiffualize: false, help: 'Read up on tips and tricks!', urls: {from: '', to: ''}};
    //please keep state minimal
    //all diffualize stuff (show diffualize, help, urls (from, to)) should be removed from state
  },

  fileOrFolder: function() {
    if (this.state.filePaths[this.state.currentPath] && !this.state.filePaths[this.state.currentPath].isFolder) {
      //<File key={this.state.currentPath + '/' + this.state.filePaths[this.state.currentPath].commitIndex} currentIndex={this.state.commitIndex} filePaths={this.state.filePaths} currentPath={this.state.currentPath}/>
      return (
        <Col xs={9} md={9} style={{height: this.state.windowHeight, overflow: 'scroll'}}>
          <File currentIndex={this.state.commitIndex} urls={{to : '', from: ''}} filePaths={this.state.filePaths} currentPath={this.state.currentPath}/>
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
    var context = this;
    if (!isNaN(from) && !isNaN(to) && this.validCommit(to,from)) {
      var toUrl = this.state.commits[to].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + this.state.currentPath;
      var fromUrl = this.state.commits[from].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + this.state.currentPath;
      $.get(toUrl)
      .always(function(toStatus) {
        $.get(fromUrl)
        .always(function(fromStatus) {
          if ((typeof toStatus === 'string' || toStatus.statusText === 'OK') && (typeof fromStatus === 'string' || fromStatus.statusText === 'OK')) {
            context.setState ( {urls: {from: fromUrl, to: toUrl}, help: 'Diffualizing from commit ' + from + ' to ' + to + '!'} );
          } else if (typeof toStatus === 'string' || toStatus.statusText === 'OK') {
            context.setState( {help: "File doesn't exist at: " + from + '!'});
          } else if (typeof fromStatus === 'string' || fromStatus.statusText === 'OK') {
            context.setState( {help: "File doesn't exist at: " + to + '!'});
          } else {
            context.setState( {help: "File doesn't exist at: " + from + ', or: ' + to +'!'});
          }
        });
      });
    } else if (!isNaN(to) && this.validCommit(to,from)) {
      to = this.state.commitIndex + to;
      var toUrl = this.state.commits[to].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + this.state.currentPath;
      var fromUrl = context.state.commits[context.state.commitIndex].files[0].raw_url.split('/').slice(0,6).join('/') + '/' + context.state.currentPath;
      $.get(toUrl)
      .always(function(toStatus) {
        if (typeof toStatus === 'string' || toStatus.statusText === 'OK') {
          if (to < context.state.commitIndex) {
            context.setState ( {urls: {from: toUrl, to: fromUrl}, help: 'Diffualizing from commit ' + to + ' to ' + context.state.commitIndex + '!'} );
          } else {
            context.setState ( {urls: {from: fromUrl, to: toUrl}, help: 'Diffualizing from commit ' + context.state.commitIndex + ' to ' + to + '!'} );
          }
        } else {
          context.setState( {help: "File doesn't exist at: " + to + '!'});
        }
      });
    } else {
      this.setState( {help: 'Invalid Entry!'});
    }
  },

  modalOrNo: function() {
    if (this.state.showFileDiffualize) {
      return (
        <Modal.Body>
          <Input label='Enter a commit range' help={this.state.help + ' The current commit index is: ' + this.state.commitIndex} wrapperClassName='wrapper'>
            <Row>
              <Col xs={4}><Input type='text' ref='from' addonBefore='From:' bsSize="small" placeholder='here' className='form-control' /></Col>
              <Col xs={4}><Input type='text' ref='to' addonBefore='To:' bsSize="small" placeholder='there' className='form-control' /></Col>
              <Col xs={4}><ButtonInput onSubmit={this.handleSubmit} onClick={this.handleSubmit} bsSize="small" type='submit' value='Diffualize'/></Col>
            </Row>
          </Input>
          <hr />
          <div style={{height: this.state.windowHeight, overflow: 'scroll'}}>
            <File key={this.state.urls.from+this.state.urls.to} urls={this.state.urls} currentIndex={this.state.commitIndex} filePaths={this.state.filePaths} currentPath={this.state.currentPath}/>
          </div>
        </Modal.Body>
      )
    } else {
      return ;
    }
  },

  render: function () {
    if (this.state.commits.length > 0) {
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

            <Playbar playbarDirection={this.state.playbarDirection} updatePlaybarDirection={this.updatePlaybarDirection} currentCommit={this.state.commits[this.state.commitIndex]} numberOfCommits={this.state.commits.length-1} commitIndex={this.state.commitIndex} updateCommitIndex={this.updateCommitIndex} reset={this.reset} showFileDiffualize={this.showFileDiffualize} isFile={this.state.filePaths[this.state.currentPath] && !this.state.filePaths[this.state.currentPath].isFolder}/>
          </Grid>

          <Modal show={this.state.showFileDiffualize} onHide={this.closeFileDiffualize}>
            <Modal.Header closeButton>
              <Modal.Title>Diffualizing {this.state.currentPath}</Modal.Title>
            </Modal.Header>
            {modal}
          </Modal>
        </div>
      )
    } else {
      return (
        <Loading/>
      )
    }
  }
});

module.exports = Visualize;
