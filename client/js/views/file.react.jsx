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
      diff : ''
    };
  },
  componentWillReceiveProps: function(nextProps) {
    var currFile = this.props.filePaths[nextProps.currentPath];
    var nextUrl = this.props.urls.to || currFile.raw_url;
    var url = this.props.urls.from || currFile.last_url || nextUrl;
    $.get(url)
    .always(function(data) {
      data = data.responseText || data || '';
      $.get(nextUrl)
      .always(function(nextData) {
        nextData = nextData.responseText || nextData;
        this.compare(nextData,data,url);
      }.bind(this));
    }.bind(this));
  },

  componentWillMount: function() {
    var currentFile = this.props.filePaths[this.props.currentPath];
    var url = this.props.urls.to || currentFile.raw_url;
    var prevUrl = this.props.urls.from || currentFile.last_url || url;
    $.get(prevUrl)
    .always(function(prevData) {
      prevData = prevData.responseText || prevData || '';
      $.get(url)
      .always(function(data) {
        data = data.responseText || data;
        this.compare(data,prevData,url);
      }.bind(this));
    }.bind(this));
  },

  compare: function(data, pdata, url) {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
      pdata = JSON.stringify(pdata);
    }
    var diff = jsDiff.diffLines(pdata, data); //try to diff, but may be noncode data
    this.setState ( {diff} );
  },

  formatFile: function(diff) { //html object to render surrounding the code or img
    var fileType = this.props.currentPath.split('.').pop();
    if (fileType === 'png' || fileType === 'gif' || fileType === 'jpg' || fileType === 'jpeg') {
      var url = this.props.filePaths[this.props.currentPath].raw_url;
      return (
          <Well bsSize='small'>
            <img src={url}/>
          </Well>
        )
    }
    if (typeof diff === 'string') return diff;

    function color(part) {
      return {color: part.added ? 'green' : part.removed ? 'red' : 'grey'};
    };
    return (
        <div>
          { diff.map(function(part) {
            return (<span style={color(part)}>{part.value}</span>);
          })}
        </div>
      )
  },
  render: function () {
    return (
      <div>
        {this.formatFile(this.state.diff)}
      </div>
    )
  }
});

module.exports = File;
