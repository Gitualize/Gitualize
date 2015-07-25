var _ = require('underscore');
module.exports.updateTree = function(currentCommit, fileTree) {
  var filepath;
  currentCommit.files.forEach(function(file) {
    //filepath = file.filename;
    file.status === 'removed' ? removeFile(fileTree, file) : addFile(fileTree, file);
  });
};
var addFile = function (tree, file) {
  var filePath = file.filename;
  if (filePath === 'docs/images/lens.jpg') debugger;
  var path = filePath.split('/');
  var currentFolder = tree;
  var folderMatch, folder;
  while (path.length > 1) {
    folderMatch = false;
    for (folder in currentFolder) {
      if (folder === path[0]) {
        currentFolder = currentFolder[folder];
        folderMatch = true;
      }
    }
    if (!folderMatch) {
      var index = filePath.lastIndexOf('/');
      var folderPath = filePath.slice(0, index > -1? index : filePath.length);
      //currentFolder[path[0]] = {isFolder: true, path: folderPath};
      currentFolder[path[0]] = {_folderDetails: {isFolder: true, path: folderPath, value: path[path.length-2]}};
      //isFolder if there is something in the obj other than details?
      currentFolder = currentFolder[path[0]];
    }
    path.shift();
  }
  currentFolder[path[0]] = {_folderDetails: {isFolder: false, path: filePath, url: file.raw_url}};
};

var removeFile = function (tree, file) {
  var filePath = file.filename;
  var path = filePath.split('/');
  var currentFolder = tree, parentFolder;
  var folderOrFileName, targetFolderOrFileName;
  while (path.length > 1) {
    targetFolderOrFileName = path[0];
    var found = _.find(currentFolder, function(contents, folderOrFileName) {
      if (folderOrFileName === targetFolderOrFileName) {
        parentFolder = currentFolder;
        currentFolder = parentFolder[folderOrFileName];
        return true;
      }
    });
    if (!found) return console.log('File or Folder not found in our tree');
    path.shift();
  }
  delete currentFolder[targetFolderOrFileName]; //delete the file

  // if the currentFolder is now empty, delete the folder
  if (_.every(currentFolder, function(contents, filename) { //detect if folder empty
    return (filename === '_folderDetails'); //if there is only folderDetails in folder
  })) {
    var folderName = currentFolder._folderDetails.value;
    parentFolder && delete parentFolder[folderName]; //delete the folder if it's empty now
  }
};
