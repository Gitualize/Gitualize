var _ = require('underscore');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Views = require('./views.jsx');

var App = React.createClass({
  render () {
    return (
      <div><h1>Gitualizer</h1>
        <RouteHandler/>
      </div>
    );
  }
});
var routes = (
  <Route path='/' handler={App}>
    <Route path="about" handler={Views.About}/>
    <Route path="repos/:repoName" handler={Views.Folder}/>
    <Route path="*" handler={Views.Landing}/>
    <DefaultRoute handler={Views.Landing}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});
