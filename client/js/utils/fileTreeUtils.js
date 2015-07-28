var _ = require('underscore');

module.exports.updateTree = function(currentCommit, fileTree, direction) {
  var filepath;
  if (direction === 'backward') {
    currentCommit.files.forEach(function(file) {
      file.status === 'added' || file.status === 'renamed' ? removeFile(fileTree, file) : addFile(fileTree, file);
    });
  } else {
    currentCommit.files.forEach(function(file) {
      //filepath = file.filename;
      file.status === 'removed' ? removeFile(fileTree, file) : addFile(fileTree, file);
    });
  }
  cleanTree(fileTree);
};

var addFile = function (tree, file) {
  var filePath = file.filename;
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
      var index = filePath.indexOf(path[0]) + path[0].length;
      var folderPath = filePath.slice(0, index > -1? index : filePath.length);
      //currentFolder[path[0]] = {isFolder: true, path: folderPath};
      currentFolder[path[0]] = {_folderDetails: {isFolder: true, path: folderPath, value: path[0]}};
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
  var currentFolder = tree;
  var parentFolder, folderOrFileName, targetFolderOrFileName;
  targetFolderOrFileName = path[0];
  while (path.length > 1) {
    var found = _.find(currentFolder, function(contents, folderOrFileName) {
      if (folderOrFileName === targetFolderOrFileName) {
        parentFolder = currentFolder;
        currentFolder = parentFolder[folderOrFileName];
        return true;
      }
    });
    if (!found) return console.log('File or Folder not found in our tree: ', targetFolderOrFileName);
    path.shift();
    targetFolderOrFileName = path[0];
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

var cleanTree = function (tree) {
  for (var node in tree) {
    if (tree[node]._folderDetails && tree[node]._folderDetails.isFolder){
      if (Object.keys(tree[node]).length === 1) {
        delete tree[node];
      } else {
        cleanTree(tree[node]);
      }
    }
  }
}
