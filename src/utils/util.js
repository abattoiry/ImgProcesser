const path = require('path');
const fs = require('fs');

function getProjectAbsolutePath(imgPath) {
  const localPath = `${imgPath.replace(path.resolve(process.cwd()), '')}`;
  if (localPath.startsWith('.')) {
    return localPath.slice(1, localPath.length);
  } else {
    return localPath;
  }
}

/**
 * 返回文件中图片链接的相对路径
 *
 * @param {*} filePath 文件路径
 * @param {*} imgPath 图片路径
 * @returns
 */
function getImgRelativePathOfFile(filePath, imgPath) {

  let _filePath = path.resolve(process.cwd(), filePath);
  let _imgPath = path.resolve(process.cwd(), `.${imgPath}`);
  let dup = '';
  Array.from(_filePath).some((char, index) => {
    if (char === _imgPath[index]) {
      dup = dup + char;
    } else {
      return true;
    }
  });

  _filePath = _filePath.replace(dup, '');
  _imgPath = _imgPath.replace(dup, '');
  let prefix = './';
  for (let i = 0; i < _filePath.split('/').length - 1; i++) {
    prefix = prefix + '../';
  }
  return prefix + _imgPath;
}

/**
 * 一次性写入一个文件的所有修改，同时修改一个文件会被覆盖
 *
 * @param {*} writeContent 一个列表包含所有修改的地方，将origin改成current
 * @param {*} file 文件名
 * @param {*} content 文件原始内容
 */
function replaceContent(writeContent, file, content) {
  writeContent.forEach((item) => {
    content = content.replace(item.original, item.current);
    console.log(`将文件 \x1B[32m ${file} \u001b[39m 中的图片路径 \x1B[32m ${item.original} \u001b[39m 修改为 \x1B[32m ${item.current} \u001b[39m`);
  })
  fs.writeFileSync(file, content, 'utf8');
}

module.exports = {
  getProjectAbsolutePath: getProjectAbsolutePath,
  replaceContent: replaceContent,
  getImgRelativePathOfFile: getImgRelativePathOfFile
}
