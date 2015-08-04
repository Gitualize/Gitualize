var Path = require('../../client/js/views/path.react.jsx');
var Directory = require('../../client/js/views/directory.react.jsx');
var Playbar = require('../../client/js/views/playbar.react.jsx');
var React = require('react/addons'); //for DOM manipulation to work we need to require 'react/addons' in all other files as well
var TestUtils = React.addons.TestUtils;

describe('Test frontend.', function(){
  var shallowRender, component, node, onEvent;
  var updateCurrentPath = function(path) { onEvent = path };
  var updatePlaybarDirection = function(direction) { onEvent = direction };
  var updateCommitIndex = function(index) { onEvent = index };
  var reset = function() { onEvent = 'reset' };
  var showFileDiffualize = function() { onEvent = 'showFileDiffualize' };
  var numberOfCommits = 10;
  var totalNumCommits = 10;
  var commitIndex = 0;
  var isFile = true;
  var repoName = 'testRepo';
  var currentPath = 'topLevelFolder/secondLevelFile';
  var playbarDirection = 'forward';
  var fileTree = {
    'topLevelFolder' : {
      _folderDetails : {
        isFolder : true,
        path : 'topLevelFolder',
        value : 'topLevelFolder'
      },
      'secondLevelFile' : {
        _folderDetails : {
          isFolder : false,
          path : 'topLevelFolder/secondLevelFile',
          url : 'http://gitualize.com/#/topLevelFolder/secondLevelFile'
        },
      }
    },
    'topLevelFile' : {
      _folderDetails : {
        isFolder : false,
        path : 'topLevelFile',
        url : 'http://gitualize.com/#/topLevelFile'
      },
    }
  };

  describe('Test Path.', function() {
    beforeEach(function() {
      shallowRender = TestUtils.createRenderer();
      shallowRender.render(<Path repoName={repoName} currentPath={currentPath} updateCurrentPath={updateCurrentPath}/>);
      component = shallowRender.getRenderOutput();
    });

    it("Should be of type 'div'", function() {
      expect(component.type).toBe('div');
    });

    it("Should contain as the first child a React Button indexed to -1 as the root 'testRepo'", function() {
      expect(component._store.props.children[0]._store.props.type).toBe('button');
      expect(component._store.props.children[0]._store.props.onClick.__reactBoundArguments[0]).toBe(-1);
      expect(component._store.props.children[0]._store.props.className).toBe('path-root');
      expect(component._store.props.children[0]._store.props.children).toBe('testRepo');
    });

    it("Should contain as the next child an array of 'spans' featuring '/ topLevelFolder' and '/ secondLevelFile' React Buttons properly indexed to 0 and 1, respectively", function() {
      expect(Array.isArray(component._store.props.children[1])).toBe(true);
      expect(component._store.props.children[1][0].type).toBe('span');
      expect(component._store.props.children[1][0]._store.props.children._store.props.type).toBe('button');
      expect(component._store.props.children[1][0]._store.props.children._store.props.onClick.__reactBoundArguments[0]).toBe(0);
      expect(component._store.props.children[1][0]._store.props.children._store.props.className).toBe('path-folder');
      expect(component._store.props.children[1][0]._store.props.children._store.props.children).toBe('/ topLevelFolder');
      expect(component._store.props.children[1][1].type).toBe('span');
      expect(component._store.props.children[1][1]._store.props.children._store.props.type).toBe('button');
      expect(component._store.props.children[1][1]._store.props.children._store.props.onClick.__reactBoundArguments[0]).toBe(1);
      expect(component._store.props.children[1][1]._store.props.children._store.props.className).toBe('path-folder');
      expect(component._store.props.children[1][1]._store.props.children._store.props.children).toBe('/ secondLevelFile');
    });
  });

  describe('Test Directory.', function() {
    beforeEach(function() {
      shallowRender = TestUtils.createRenderer();
      shallowRender.render(<Directory fileTree={fileTree} updateCurrentPath={this.updateCurrentPath}/>);
      component = shallowRender.getRenderOutput();
    });
    
    it("Should be of type 'div'", function() {
      expect(component.type).toBe('div');
    });

    it("Should wrap folders in divs with a 'folder-open' Glyphicon", function() {
      expect(component._store.props.children[0].type).toBe('div');
      expect(component._store.props.children[0]._store.props.style.paddingLeft).toBe('10px');
      expect(component._store.props.children[0]._store.props.children[0]._store.props.glyph).toBe('folder-open');
      expect(component._store.props.children[0]._store.props.children[1]._store.props.type).toBe('button');
      expect(component._store.props.children[0]._store.props.children[1]._store.props.children).toBe('topLevelFolder');
    });

    it("Should wrap files in divs with a 'file' Glyphicon", function() {
      expect(component._store.props.children[1].type).toBe('div');
      expect(component._store.props.children[1]._store.props.style.paddingLeft).toBe('10px');
      expect(component._store.props.children[1]._store.props.children[0]._store.props.glyph).toBe('file');
      expect(component._store.props.children[1]._store.props.children[1]._store.props.type).toBe('button');
      expect(component._store.props.children[1]._store.props.children[1]._store.props.children).toBe('topLevelFile');
    });

    it("Should nest items", function() { //component._store.props.children[0]._store.props.children[2][0] is undefined for React reasons
      expect(component._store.props.children[0]._store.props.children[2][1].type).toBe('div');
      expect(component._store.props.children[0]._store.props.children[2][1]._store.props.style.paddingLeft).toBe('10px');
      expect(component._store.props.children[0]._store.props.children[2][1]._store.props.children[0]._store.props.glyph).toBe('file');
      expect(component._store.props.children[0]._store.props.children[2][1]._store.props.children[1]._store.props.type).toBe('button');
      expect(component._store.props.children[0]._store.props.children[2][1]._store.props.children[1]._store.props.children).toBe('secondLevelFile');
    });
  });

  describe('Test Playbar.', function() {
    beforeEach(function() {
      shallowRender = TestUtils.createRenderer();
      shallowRender.render(<Playbar playbarDirection={playbarDirection} updatePlaybarDirection={updatePlaybarDirection} numberOfCommits={numberOfCommits} commitIndex={commitIndex} updateCommitIndex={updateCommitIndex} totalNumCommits={totalNumCommits} reset={reset} showFileDiffualize={showFileDiffualize} isFile={isFile}/>);
      component = shallowRender.getRenderOutput();
    });

    it("Should be of type 'Row'", function() {
      expect(component.type.displayName).toBe('Row');
    });

    it("Should contain a 'Col' as the first child with the ProgressBar and its Tooltip", function() {
      expect(component._store.props.children[0].type.displayName).toBe('Col');
      expect(component._store.props.children[0]._store.props.children.type.displayName).toBe('OverlayTrigger');
      expect(component._store.props.children[0]._store.props.children._store.props.overlay.type.displayName).toBe('Tooltip');
      expect(component._store.props.children[0]._store.props.children._store.props.children.type.displayName).toBe('ProgressBar');
    });

    it("Should contain a 'Col' as the second child with the ButtonToolbar.", function() {
      expect(component._store.props.children[1].type.displayName).toBe('Col');
      expect(component._store.props.children[1]._store.props.children.type.displayName).toBe('ButtonToolbar');
      expect(component._store.props.children[1]._store.props.children._store.props.children.type.displayName).toBe('ButtonGroup');

      it("Should Contain a backward button wrapped in its Tooltip", function() {
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0].type.displayName).toBe('OverlayTrigger');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.overlay.type.displayName).toBe('Tooltip');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children.type.displayName).toBe('Button');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children._store.props.children.type.displayName).toBe('Glyphicon');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children._store.props.children._store.props.glyph).toBe('backward');
      });

      it("Should Contain a play button wrapped in its Tooltip", function() {
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0].type.displayName).toBe('OverlayTrigger');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.overlay.type.displayName).toBe('Tooltip');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children.type.displayName).toBe('Button');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children._store.props.children.type.displayName).toBe('Glyphicon');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children._store.props.children._store.props.glyph).toBe('play');
      });

      it("Should Contain a pause button wrapped in its Tooltip", function() {
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0].type.displayName).toBe('OverlayTrigger');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.overlay.type.displayName).toBe('Tooltip');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children.type.displayName).toBe('Button');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children._store.props.children.type.displayName).toBe('Glyphicon');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children._store.props.children._store.props.glyph).toBe('pause');
      });

      it("Should Contain a minus-sign button wrapped in its Tooltip", function() {
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0].type.displayName).toBe('OverlayTrigger');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.overlay.type.displayName).toBe('Tooltip');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children.type.displayName).toBe('Button');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children._store.props.children.type.displayName).toBe('Glyphicon');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children._store.props.children._store.props.glyph).toBe('minus-sign');
      });

      it("Should Contain a plus-sign button wrapped in its Tooltip", function() {
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0].type.displayName).toBe('OverlayTrigger');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.overlay.type.displayName).toBe('Tooltip');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children.type.displayName).toBe('Button');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children._store.props.children.type.displayName).toBe('Glyphicon');
        expect(component._store.props.children[1]._store.props.children._store.props.children._store.props.children[0]._store.props.children._store.props.children._store.props.glyph).toBe('plus-sign');
      });
    });

    it("Should contain a 'Col' as the third child with the Speed Well and its Tooltip", function() {
      expect(component._store.props.children[2].type.displayName).toBe('Col');
      expect(component._store.props.children[2]._store.props.children.type.displayName).toBe('OverlayTrigger');
      expect(component._store.props.children[2]._store.props.children._store.props.overlay.type.displayName).toBe('Tooltip');
      expect(component._store.props.children[2]._store.props.children._store.props.children.type.displayName).toBe('Well');
      expect(component._store.props.children[2]._store.props.children._store.props.children._store.props.children[0]).toBe('1');
    });

    it("Should contain a 'Col' as the fourth child with the Commits Well and its Tooltip", function() {
      expect(component._store.props.children[3].type.displayName).toBe('Col');
      expect(component._store.props.children[3]._store.props.children.type.displayName).toBe('OverlayTrigger');
      expect(component._store.props.children[3]._store.props.children._store.props.overlay.type.displayName).toBe('Tooltip');
      expect(component._store.props.children[3]._store.props.children._store.props.children.type.displayName).toBe('Well');
      expect(component._store.props.children[3]._store.props.children._store.props.children._store.props.children[0]).toBe(0);
      expect(component._store.props.children[3]._store.props.children._store.props.children._store.props.children[2]).toBe(10);
    });

    it("Should contain a 'Col' as the fifth child with the Diffualize Button", function() {
      expect(component._store.props.children[4].type.displayName).toBe('Col');
      expect(component._store.props.children[4]._store.props.children.type.displayName).toBe('Button');
      expect(component._store.props.children[4]._store.props.children._store.props.children[0].type.displayName).toBe('Glyphicon');
      expect(component._store.props.children[4]._store.props.children._store.props.children[0]._store.props.glyph).toBe('modal-window');
      expect(component._store.props.children[4]._store.props.children._store.props.children[1]).toBe(' Diffualize');
    });
  });
});
