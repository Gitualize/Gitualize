var ReactBootstrap = require('react-bootstrap');
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Well = ReactBootstrap.Well;
var $ = require('jquery');
var jsDiff = require('diff');

var File = React.createClass({
  getInitialState: function() {
    return {
      diff : [] 
    };
  },
  componentWillReceiveProps: function(nextProps) { //selecting a new path changes the state of visualize which sets the props of file
    var currFile = this.props.filePaths[nextProps.currentPath];
    //url props used by the diffualizer but not mainpage visualize
    var nextUrl = this.props.urls.to || currFile.raw_url;
    var url = this.props.urls.from || currFile.last_url || nextUrl;
    $.get(url)
    .always(function(data) {
      //http requests to rawgit.com will sometimes fail but return the expected data in the responseText
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
    //url props used by the diffualizer but not mainpage visualize
    var url = this.props.urls.to || currentFile.raw_url;
    var prevUrl = this.props.urls.from || currentFile.last_url || url;
    $.get(prevUrl)
    .always(function(prevData) {
      //http requests to rawgit.com will sometimes fail but return the expected data in the responseText
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
  color : function(line) {
    return {color: line.added ? 'green' : line.removed ? 'red' : 'grey'};
  },
  //formatFile: function(diff) { //html object to render surrounding the code or img
    //var fileType = this.props.currentPath.split('.').pop();
    //if (fileType === 'png' || fileType === 'gif' || fileType === 'jpg' || fileType === 'jpeg') {
      //var url = this.props.filePaths[this.props.currentPath].raw_url;
      //return (
        //<Well bsSize='small'>
          //<img src={url}/>
        //</Well>
      //)
    //}
    //if (typeof diff === 'string') return diff; 

    //function color(line) {
    //return {color: line.added ? 'green' : line.removed ? 'red' : 'grey'};
    //};

    //return (
    //{ diff.map(function(line) {
    //return (<span style={color(line)}>{line.value}</span>);
    //})}
    //);
  //},
  render: function () {
    //if (this.state.diff === '') return;
    var diff = this.state.diff.map(function(line, i) {
      return (<span style={this.color(line)} key={line.value}> {line.value} </span>);
    }.bind(this));
    //<div>
    //{this.formatFile(this.state.diff)}
    //</div>

    return (
      <ReactCSSTransitionGroup transitionName="example">
        {diff}
      </ReactCSSTransitionGroup>
    )
  }
});

module.exports = File;
