const getFiles = require('./getFiles');
const fs = require('fs');
const path = require('path');

const URL_PIC_REG = /(require\(|url\(|[^:]src=)(\'|\")?(.*?(\.png|\.jpg))/g;
async function scanImageRefs(callback) {
  const sourceFiles = await getFiles(config.rdDir, [], ['html']);
  // 获取所有相同图片
  sourceFiles.forEach(file => {
    const contents = fs.readFileSync(file, 'utf8');
    console.log(contents)
    while ((result = URL_PIC_REG.exec(contents)) != null) {
      let imgPath = result[3];
      const originalImgPath = result[3];
      switch (imgPath.slice(0, 2)) {
        case '@/':
          imgPath = imgPath.slice(2);
          imgPath = path.resolve(config.scanPath, imgPath);
          break
        case '..':
        case './':
          imgPath = path.resolve(path.dirname(file), imgPath);
          break
        case '~@':
          imgPath = imgPath.slice(3);
          imgPath = path.resolve(config.scanPath, imgPath);
          break
        default:
          console.log('不是本地链接：', imgPath);
          continue
      }
      callback(originalImgPath, imgPath, file, contents);
    }
  })
}

module.exports = scanImageRefs;