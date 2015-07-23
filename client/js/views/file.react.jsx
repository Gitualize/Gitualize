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
  componentWillReceiveProps: function(nextProps) { //TODO refactor DRY with componentWillMount
    //var nextFile = nextProps.filePaths[this.props.currentPath];
    var currFile = this.props.filePaths[this.props.currentPath];
    var url = currFile.last_url;
    var nextUrl = currFile.raw_url; //:( TODO I think nextFile is the same as the currFile since we are building the filepath as we go...convert to react niceness like below
    //var nextUrl = nextFile.raw_url;
    if (url === nextUrl) return;
    $.get(url)
    .always(function(data) { //for each tick of commitIndex, we get the previous data again...why?? refactor
      //always is workaround for now, this goes to the .error if encounters JS (but data in responseText)
      data = data.responseText || data || '';
      $.get(nextUrl)
      .always(function(nextData) {
        nextData = nextData.responseText || nextData;
        this.compare(nextData,data,url);
      }.bind(this));
    }.bind(this));
  },

  componentWillMount: function() { //TODO i don't think this file should know about ALL the other files via filePaths
    var currentFile = this.props.filePaths[this.props.currentPath];
    var url = currentFile.raw_url;
    var prevUrl = currentFile.last_url || url;

    $.get(prevUrl)
    .always(function(prevData) { //for each tick of commitIndex, we get the previous data again...why?? refactor
      //always is workaround for now, this goes to the .error if encounters JS (but data in responseText)
      prevData = prevData.responseText || prevData || '';
      $.get(url)
      .always(function(data) {
        data = data.responseText || data;
        this.compare(data,prevData,url);
      }.bind(this));
    }.bind(this));
  },

  compare: function(data, pdata, url) {
    debugger;
    if (typeof data === 'object') { //when is it an obj? TODO
      data = JSON.stringify(data);
      pdata = JSON.stringify(pdata);
    }
    var diff = jsDiff.diffLines(pdata, data); //try to diff, but may be noncode data
    this.setState ( {diff} ); //can return and set in above fn
    //this.setState ( {code: this.codeOr(diff, url)} );
  },

  formatFile: function(diff) { //html object to render surrounding the code or img
    //if (typeof data === 'object') return JSON.stringify(data); //something something json
    //if (typeof data === 'string' && fileType !== 'json') return data;
    //
    var fileType = this.props.currentPath.split('.').pop();
    if (fileType === 'png' || fileType === 'gif' || fileType === 'jpg' || fileType === 'jpeg') {
      var url = this.props.filePaths[this.props.currentPath].raw_url;
      return (
          <Well bsSize='small'>
            <img src={url}/>
          </Well>
        )
    }
    if (typeof diff === 'string') return diff; //TODO ???only initial case?

    function color(part) {
      return {color: part.added ? 'green' : part.removed ? 'red' : 'grey'};
    };
    var style = {
      wordWrap: 'break-word; white-space; pre-wrap'
    }
    return (
        <pre style={style}>
          { diff.map(function(part) {
            return (<span style={color(part)}>{part.value}</span>);
          })}
        </pre>
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
