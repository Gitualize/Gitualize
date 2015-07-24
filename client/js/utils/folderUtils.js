// TODO-CLEANUP: return json type but keep the boostrap icon name
var getFileType = function(fileName, isFolder){
  if(isFolder) {
    return 'folder-close';
  } else {
    var images = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'svg'];
    var idx = fileName.lastIndexOf('.');
    var format = (fileName.substring(idx + 1)).toLowerCase();

    if(idx > -1) {
      return images.indexOf(format) > -1? 'picture' : 'file';
    } else {
      return 'file';
    }
  }
};

var fileSort = function(files, options){
  options = options || {};

  var sortingOptions = {
    alphabetical: function(a, b){
      return a.filename.toLowerCase().localeCompare(b.filename.toLowerCase());
    },
    changed: function(a, b){
      var order = {'orange': 0, 'slateblue': 1, 'yellowgreen': 2, 'gold': 3, 'red': 4, 'white': 5};

      return order[a.style.backgroundColor] - order[b.style.backgroundColor];
    },
    date: function(a, b){
      // implement date sort
    }
  };

  var sorted = files.sort(function(a, b){
    return sortingOptions[options.method](a, b);
  });

  return options.reverse? sorted.reverse() : sorted;
};

module.exports = {getFileType: getFileType, fileSort: fileSort};

