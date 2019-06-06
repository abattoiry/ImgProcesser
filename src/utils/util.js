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

/**
 * 一次性写入一个文件的所有修改，同时修改一个文件会出问题
 *
 * @param {*} writeContent 一个列表包含所有修改的地方，将origin改成current
 * @param {*} file 文件名
 * @param {*} content 文件原始内容
 */
function replaceContent(writeContent, file, content) {
  writeContent.forEach((item) => {
    content = content.replace(item.original, item.current);
  })
  fs.writeFile(file, content, 'utf8', () => { });
}

module.exports = {
  getAbsolutePath: getAbsolutePath,
  replaceContent: replaceContent
}