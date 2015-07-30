var Path = require('../../client/js/views/path.react.jsx');
var Directory = require('../../client/js/views/directory.react.jsx');
var React = require('react/addons'); //for DOM manipulation to work we need to require 'react/addons' in all other files as well
var TestUtils = React.addons.TestUtils;

describe('Test frontend.', function(){
  var shallowRender, component, node, onClick;
  var updateCurrentPath = function(path) { onClick = path; };
  var repoName = 'blog-project';
  var currentPath = 'athing/bthing';
  var fileTree = {
    'athing' : {
      _folderDetails : {
        isFolder : true,
        path : 'athing',
        value : 'athing'
      },
      'cthing' : {
        _folderDetails : {
          isFolder : false,
          path : 'athing/cthing',
          url : 'www.something/cthing.gov'
        },
      }
    },
    'bthing' : {
      _folderDetails : {
        isFolder : false,
        path : 'bthing',
        url : 'www.somehing/bthing.gov'
      },
    }
  };

  describe('Test Path.', function() {
    beforeEach(function() {
      shallowRender = TestUtils.createRenderer();
      shallowRender.render(<Path repoName={repoName} currentPath={currentPath} updateCurrentPath={updateCurrentPath}/>);
      component = shallowRender.getRenderOutput();
    })
    it("Should be of type 'div'", function() {
      expect(component.type).toBe('div');
    });

    it("Should contain as the first child a React Button indexed to -1 as the root 'blog-project'", function() {
      expect(component._store.props.children[0]._store.props.type).toBe('button');
      expect(component._store.props.children[0]._store.props.onClick.__reactBoundArguments[0]).toBe(-1);
      expect(component._store.props.children[0]._store.props.className).toBe('path-root');
      expect(component._store.props.children[0]._store.props.children).toBe('blog-project');
      // node = component._store.props.children[0]._store.props.onClick.__reactBoundContext.getDOMNode();
      // TestUtils.Simulate.click(node);
      // expect(onClick).toBe('');
    });

    it("Should contain as the next child an array of 'spans' featuring '/ athing' and '/ bthing' React Buttons properly indexed to 0 and 1, respectively", function() {
      expect(Array.isArray(component._store.props.children[1])).toBe(true);
      expect(component._store.props.children[1][0].type).toBe('span');
      expect(component._store.props.children[1][0]._store.props.children._store.props.type).toBe('button');
      expect(component._store.props.children[1][0]._store.props.children._store.props.onClick.__reactBoundArguments[0]).toBe(0);
      expect(component._store.props.children[1][0]._store.props.children._store.props.className).toBe('path-folder');
      expect(component._store.props.children[1][0]._store.props.children._store.props.children).toBe('/ athing');
      expect(component._store.props.children[1][1].type).toBe('span');
      expect(component._store.props.children[1][1]._store.props.children._store.props.type).toBe('button');
      expect(component._store.props.children[1][1]._store.props.children._store.props.onClick.__reactBoundArguments[0]).toBe(1);
      expect(component._store.props.children[1][1]._store.props.children._store.props.className).toBe('path-folder');
      expect(component._store.props.children[1][1]._store.props.children._store.props.children).toBe('/ bthing');
    });
  });

  describe('Test Directory.', function() {
    beforeEach(function() {
      shallowRender = TestUtils.createRenderer();
      shallowRender.render(<Directory fileTree={fileTree} updateCurrentPath={this.updateCurrentPath}/>);
      component = shallowRender.getRenderOutput();
    })
    
    it("Should be of type 'Well'", function() {
      expect(component.type.displayName).toBe('Well');
    });

    it("Should wrap folders in divs with a 'folder-open' Glyphicon", function() {
      expect(component._store.props.children[0].type).toBe('div');
      expect(component._store.props.children[0]._store.props.style.paddingLeft).toBe('10px');
      expect(component._store.props.children[0]._store.props.children[0]._store.props.glyph).toBe('folder-open');
      expect(component._store.props.children[0]._store.props.children[1]._store.props.type).toBe('button');
      expect(component._store.props.children[0]._store.props.children[1]._store.props.children).toBe('athing');
    });

    it("Should wrap files in divs with a 'file' Glyphicon", function() {
      expect(component._store.props.children[1].type).toBe('div');
      expect(component._store.props.children[1]._store.props.style.paddingLeft).toBe('10px');
      expect(component._store.props.children[1]._store.props.children[0]._store.props.glyph).toBe('file');
      expect(component._store.props.children[1]._store.props.children[1]._store.props.type).toBe('button');
      expect(component._store.props.children[1]._store.props.children[1]._store.props.children).toBe('bthing');
    });

    it("Should nest items", function() { //component._store.props.children[0]._store.props.children[2][0] is undefined for React reasons
      expect(component._store.props.children[0]._store.props.children[2][1].type).toBe('div');
      expect(component._store.props.children[0]._store.props.children[2][1]._store.props.style.paddingLeft).toBe('10px');
      expect(component._store.props.children[0]._store.props.children[2][1]._store.props.children[0]._store.props.glyph).toBe('file');
      expect(component._store.props.children[0]._store.props.children[2][1]._store.props.children[1]._store.props.type).toBe('button');
      expect(component._store.props.children[0]._store.props.children[2][1]._store.props.children[1]._store.props.children).toBe('cthing');
    });
  });
});
