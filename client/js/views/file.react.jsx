var ReactBootstrap = require('react-bootstrap');
var React = require('react');
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Well = ReactBootstrap.Well;
var $ = require('jquery');
var jsDiff = require('diff');

var File = React.createClass({
  getInitialState: function() {
    return {
      html : ''
    };
  },

  componentDidMount: function() {
    var url = this.props.filePaths[this.props.currentPath].raw_url.split('/');
    url[2] = 'cdn.rawgit.com';
    url.splice(5,1);
    url = url.join('/');
    this.setState ( {url} );

    $.get(url, function(success) {
      data = success;
      if (this.props.filePaths[this.props.currentPath].commitIndex === this.props.currentIndex && !!this.props.filePaths[this.props.currentPath].last_url) {
        this.secondaryMount(data,url);
      } else {
        this.setState ( {html: this.codeOr(data, url)} )
      }
    }.bind(this))
    .fail(function(error) {
      data = error.responseText;
      if (this.props.filePaths[this.props.currentPath].commitIndex === this.props.currentIndex && !!this.props.filePaths[this.props.currentPath].last_url) {
        this.secondaryMount(data,url);
      } else {
        this.setState ( {html: this.codeOr(data, url)} )
      }
    }.bind(this))
  },

  secondaryMount: function(data, url) {
    var previousUrl = this.props.filePaths[this.props.currentPath].last_url.split('/');
    previousUrl[2] = 'cdn.rawgit.com';
    previousUrl.splice(5,1);
    previousUrl = previousUrl.join('/');
    var previousData = '';
    $.get(previousUrl, function(previousSuccess) {
      previousData = previousSuccess;
      this.diff(data,previousData,url);
    }.bind(this))
    .fail(function(previousError) {
      previousData = previousError.responseText;
      this.diff(data,previousData,url);
    }.bind(this))
  },

  diff: function(data, pdata, url) {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
      pdata = JSON.stringify(pdata);
    }
    var diff = jsDiff.diffWords(pdata, data);
    this.setState ( {html: this.codeOr(diff, url)} );
  },

  codeOr: function(data, url) {
    var fileType = this.props.currentPath.split('.').pop();
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
        if (typeof data === 'string') {
          return (
              <pre style={style}>
                {data}
              </pre>
            )
        } else {
          return (
              <pre style={style}>
                {data.map(function(part) {
                  var colorStyle = {
                    color : part.added ? 'green' : part.removed ? 'red' : 'grey'
                  }
                  return (
                      <span style={colorStyle}>{part.value}</span>
                    )
                })}
              </pre>
            )
        }
      } else {
        if (typeof data === 'object') {
          return (
              <pre style={style}>
                {JSON.stringify(data)}
              </pre>
            )
        } else {
          return (
              <pre style={style}>
                {data.map(function(part) {
                  var colorStyle = {
                    color : part.added ? 'green' : part.removed ? 'red' : 'grey'
                  }
                  return (
                      <span style={colorStyle}>{part.value}</span>
                    )
                })}
              </pre>
            )
        }
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
