var Path = require('../../client/js/views/path.react.jsx');
var Directory = require('../../client/js/views/directory.react.jsx');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('Test frontend.', function(){
  var shallowRender, component;

  describe('Test Path.', function() {
    shallowRender = TestUtils.createRenderer();
    shallowRender.render(<Path repoName={'blog-project'} currentPath={'athing/bthing'} updateCurrentPath={function(path) { onClick = path; }}/>);
    component = shallowRender.getRenderOutput();

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
    shallowRender = TestUtils.createRenderer();
    shallowRender.render(<Path repoName={'blog-project'} currentPath={'athing/bthing'} updateCurrentPath={function(path) { onClick = path; }}/>);
    component = shallowRender.getRenderOutput();
  })
});
