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
    return {
      html : ''
    };
  },

  componentDidMount: function() {
    var path = this.props.currentPath.join('/');
    this.path = path;
    var url = '';
    var data = '';
    var files = [];
    if (this.props.currentCommit && this.props.currentCommit.files) {
      var files = JSON.parse(this.props.currentCommit.files);
    }
    for (var i = 0; i < files.length; i++) {
      if (files[i].filename === path) {
        url = files[i].raw_url.split('/');
        url[2] = 'cdn.rawgit.com';
        url.splice(5,1);
        url = url.join('/');
        this.setState ( {url} );
        break;
      }
    }
    $.get(url, function(success) {
      data = success;
      this.setState ( {html: this.codeOr(data, url, path)})
    }.bind(this))
    .fail(function(error) {
      data = error.responseText;
      this.setState ( {html: this.codeOr(data, url, path)})
    }.bind(this))
  },

  codeOr: function(data, url, path) {
    var fileType = path.split('.').pop();
    if (fileType === 'png' || fileType === 'gif' || fileType === 'jpg' || fileType === 'jpeg') {
      return (
          <Well bsSize='small'>
            <img src={url}/>
          </Well>
        )
    } else  {
      var style = {
        wordWrap: 'break-word; white-space; pre-wrap'
      }
      if (fileType !== 'json') {
        return (
          <pre style={style}>
            {data}
          </pre>
        )
      } else {
        return (
          <pre style={style}>
            {JSON.stringify(data)}
          </pre>
        )
      }
    }
  },

  render: function () {
    return (
        <div>
          {this.state.html}
        </div>
      )
  }
});

module.exports = File;
