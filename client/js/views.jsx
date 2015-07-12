var React = require('react');
var Landing = React.createClass({
  handleSubmit: function(e) {
    console.log('submitted');
    e.preventDefault();
  },
  render: function () {
    return <hi><form className='repoForm' onSubmit={this.handleSubmit}>
      <input type='text' placeholder='Search repo...' />
      <input type='submit' value='go'/>
      </form>;
  }
});

var About = React.createClass({
  render: function () {
    return <h2>About</h2>;
  }
});
var Folder = React.createClass({
  render: function () {
    return <h2>Folder view</h2>;
  }
});
module.exports.Landing = Landing;
module.exports.About = About;
module.exports.Folder = Folder;
