const path = require('path');
const fs = require('fs');

function getAbsolutePath(imgPath) {
  const fullPath = path.resolve(process.cwd());
  const localPath = `${imgPath.replace(fullPath, '')}`;
  if (localPath.startsWith('.')) {
    return localPath.slice(1, localPath.length)
  } else {
    return localPath;
  }
}

function replaceContent(file, content, origin, current) {
  content = content.replace(origin, current);
  fs.writeFile(file, content, 'utf8', () => { });
}

module.exports = {
  getAbsolutePath: getAbsolutePath,
  replaceContent: replaceContent
}