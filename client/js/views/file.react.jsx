var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Well = ReactBootstrap.Well;
var $ = require('jquery');

var currentFileCommit = {
  "sha": "000ba5b55b2e76a8c80fc5459c79f2a2efbe1382",
  "filename": "client/js/views/path.react.jsx",
  "status": "modified",
  "additions": 1,
  "deletions": 2,
  "changes": 3,
  "blob_url": "https://github.com/IncognizantDoppelganger/gitpun/blob/a47fb452b1fb20ed61ff397cecf6f709ad6b2391/client/js/views/path.react.jsx",
  "raw_url": "https://cdn.rawgit.com/IncognizantDoppelganger/gitpun/a47fb452b1fb20ed61ff397cecf6f709ad6b2391/client/js/views/path.react.jsx",
  "contents_url": "https://api.github.com/repos/IncognizantDoppelganger/gitpun/contents/client/js/views/path.react.jsx?ref=a47fb452b1fb20ed61ff397cecf6f709ad6b2391",
  "patch": "@@ -11,16 +11,15 @@ var Path = React.createClass({\n     var fullPath = this.props.currentPath.map(function(folder, index) {\n       return (\n           <span>\n+            <Button bsSize=\"xsmall\" bsStyle=\"link\" onClick={this.handleClick.bind(this,index-1)}>/</Button>\n             <Button bsSize=\"xsmall\" bsStyle=\"link\" onClick={this.handleClick.bind(this,index)}>\n               {folder}\n             </Button>\n-            <Button bsSize=\"xsmall\" bsStyle=\"link\">/</Button>\n           </span>\n         )\n     }.bind(this));\n     return (\n         <div>Path: \n-          <Button bsSize=\"xsmall\" bsStyle=\"link\" onClick={this.handleClick.bind(this,-1)}>/</Button>\n           {fullPath}\n         </div>\n       )"
}

var File = React.createClass({
  getInitialState: function() {
    setTimeout(this.getFileContent, 10);
    return {
      data : ''
    };
  },

  getFileContent: function() {
    $.get(currentFileCommit.raw_url, function(data) {
      this.setState( {data} );
    }.bind(this))
  },

  render: function () {
    var style = {
      wordWrap: 'break-word; white-space; pre-wrap'
    }
    return (
        <pre style={style}>
          {this.state.data}
        </pre>
      )
  }
});

module.exports = File;
