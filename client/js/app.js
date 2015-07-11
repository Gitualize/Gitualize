var _ = require('underscore');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Landing = React.createClass({
  render: function () {
    return (<header><h1>Gitualizer</h1>
      <nav>
        <ul>
          <li><a href='#'>Menu</a></li>
          <li><a href='#files'>View All Files</a></li>
          <li><a href='#branches'>Branches</a></li>
        </ul>
      </nav>
    </header>);
    }
});

var AllFiles = React.createClass({
  render: function () {
    return <h2>All Files</h2>;
  }
});

// declare our routes and their hierarchy
var routes = (
  <Route handler={App}>
    <Route path="/" handler={Landing}/>
    <Route path="all-files" handler={AllFiles}/>
  </Route>
);

var App = React.createClass({
  render () {
    return (
      <div>
        <h1>App</h1>
        <RouteHandler/>
      </div>
    )
  }
});

Router.run(routes, Router.HashLocation, function (Root) {
  React.render(<Root/>, document.getElementById('content'));
});
