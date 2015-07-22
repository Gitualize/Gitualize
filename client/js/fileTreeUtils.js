var updateFiles = function(currentCommit, fileTree) {
  var filepath;
  currentCommit.files.forEach(function(file) {
    filepath = file.filename;
    file.status === 'deleted' ? removeFile(fileTree, filepath) : addFile(fileTree, filepath);
  });
};
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
  currentFolder[path[0]] = {isFolder: false, path: filePath};
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

// TODO-CLEANUP: return json type but keep the boostrap icon name; handle folders with dot in name
var getFileType = function(fileName){
  var images = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'svg'];
  var idx = fileName.lastIndexOf('.');
  if(idx > -1) {
    var format = (fileName.substring(idx + 1)).toLowerCase();
    return images.indexOf(format) > -1? 'picture' : 'file';
  } else {
    return 'folder-close';
  }
};


module.exports = {addFile: addFile, removeFile: removeFile, updateFiles: updateFiles, getFileType: getFileType};
module.exports.addFile = addFile;
module.exports.removeFile = removeFile;
module.exports.getFileType = getFileType;

