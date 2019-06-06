const path = require('path');
const fs = require('fs');

function getAbsolutePath(imgPath) {
  const fullPath = path.resolve(process.cwd());
  return `${imgPath.replace(fullPath, '')}`;
}

function replaceContent(file, content, origin, current) {
  console.log('aaaaa', origin, current)
  content = content.replace(origin, current);
  fs.writeFileSync(file, content, 'utf8');
}

module.exports = {
  getAbsolutePath: getAbsolutePath,
  replaceContent: replaceContent
}