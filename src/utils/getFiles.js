const glob = require('glob');

async function getFiles(fileSource, excludeImageList = [], sufixList = ['png', 'jpg']) {
  const pattern = `${fileSource}/**/*.@(${sufixList.join('|')})`;

  return new Promise((resolve, reject) => {
    glob(pattern, {
      ignore: excludeImageList.map((img) => `${fileSource}/**/${img}`),
      nodir: true,
    }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      if (files.length === 0) {
        reject(new Error(`路径没有搜索到相匹配的文件：${fileSource}`));
        return;
      }
      resolve(files);
    });
  });
}

module.exports = getFiles;
