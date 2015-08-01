var _ = require('underscore');

//update the fileTree with all of the files changed in the current commit
module.exports.updateTree = function(currentCommit, fileTree, direction) {
  if (!currentCommit || !currentCommit.files) {
    return null;
  }
  //if the user is rewinding, we have to remove files with status added, and add files with status removed
  if (direction === 'backward') {
    currentCommit.files.forEach(function(file) {
      file.status === 'added' || file.status === 'renamed' ? removeFile(fileTree, file) : addFile(fileTree, file);
      cleanTree(fileTree);
    });
  } else {
    currentCommit.files.forEach(function(file) {
      if (file.status === 'renamed') {
        //remove the old version
        removeFile(fileTree, {filename: file.previous_filename});
        //and add the new
        addFile(fileTree, file);
      } else if (file.status === 'removed'){
        removeFile(fileTree, file);
      } else {
        addFile(fileTree, file);
      }
    });
  }
  //clean tree in case removing/renaming files left us with empty folders
  cleanTree(fileTree);
};

//add a file to the fileTree
var addFile = function (tree, file) {
  var path = file.filename.split('/');
  var originalPath = file.filename.split('/');
  var currentFolder = tree;
  var folderMatch, folder;
  //enter next folder level until we get to the last element in path
  while (path.length > 1) {
    folderMatch = false;
    for (folder in currentFolder) {
      if (folder === path[0]) {
        currentFolder = currentFolder[folder];
        folderMatch = true;
      }
    }
    //if the file we are adding is inside a folder that doesn't exist yet, create the folder
    if (!folderMatch) {
      //the path of the folder we are creating is the original path minus anything after the current folder
      var folderPath = originalPath.slice(0, originalPath.length - path.length + 1).join('/');
      //currentFolder is the parent of the folder we are creating, path[0] is the name of the folder we are creating
      currentFolder[path[0]] = {_folderDetails: {isFolder: true, path: folderPath, value: path[0]}};
      //after creating the folder, go inside it
      currentFolder = currentFolder[path[0]];
    }
    //we are now inside the path[0] folder, so remove it from path
    path.shift();
  }
  //path is now a single element, so we are in the parent folder of the file, and we can create the file here
  currentFolder[path[0]] = {_folderDetails: {isFolder: false, path: file.filename, url: file.raw_url}};
};

var removeFile = function (tree, file) {
  var path = file.filename.split('/');
  var currentFolder = tree;
  var folderOrFileName, targetFolderOrFileName;
  targetFolderOrFileName = path[0];
  //enter next folder level until we get to the last element in path
  while (path.length > 1) {
    var found = _.find(currentFolder, function(contents, folderOrFileName) {
      if (folderOrFileName === targetFolderOrFileName) {
        currentFolder = currentFolder[folderOrFileName];
        return true;
      }
    });
    //if the folder this file is inside can't be found
    if (!found) {
      return null;
    }
    //we are now inside the path[0] folder, so remove it from path
    path.shift();
    targetFolderOrFileName = path[0];
  }
  delete currentFolder[targetFolderOrFileName];
  cleanTree(tree);
};

//for deleting nested empty folders
var cleanTree = function (tree) {
  for (var node in tree) {
    //if node is a folder
    if (tree[node]._folderDetails && tree[node]._folderDetails.isFolder){
      //if _folderDetails is the only element in the current folder
      if (Object.keys(tree[node]).length === 1) {
        delete tree[node];
      } else {
        //recursively clean all child folders
        cleanTree(tree[node]);
      }
    }
  }
}
