var addFile = function (tree, filePath) {
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
      currentFolder[path[0]] = {isFolder: true};
      currentFolder = currentFolder[path[0]];
    }
    path.shift();
  }
  currentFolder[path[0]] = {isFolder: false};
};

var removeFile = function (tree, filePath) {
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
      console.log('Folder not found');
      return;
    }
    path.shift();
  }
  delete currentFolder[path[0]];
};

module.exports.addFile = addFile;
module.exports.removeFile = removeFile;