const getFiles = require('./getFiles');
const fs = require('fs');
const path = require('path');
const Util = require('./util');
const config = require('./config');

const URL_PIC_REG = /(require\(|url\(|[^:]src=)(\'|\")?(.*?(\.png|\.jpg))/g;
async function scanImageRefs(callback) {
  const sourceFiles = await getFiles(config.rdDir, [], ['html']);
  sourceFiles.forEach(file => {
    const imgs = [];
    const originalImgs = [];
    const contents = fs.readFileSync(file, 'utf8');
    while ((result = URL_PIC_REG.exec(contents)) != null) {
      let imgPath = result[3];
      const originalImgPath = result[3];
      switch (imgPath.slice(0, 2)) {
        case '@/':
          imgPath = imgPath.slice(2);
          imgPath = path.resolve(config.rdDir, imgPath);
          break
        case '..':
        case './':
          imgPath = path.resolve(path.dirname(file), imgPath);
          break
        case '~@':
          imgPath = imgPath.slice(3);
          imgPath = path.resolve(config.rdDir, imgPath);
          break
        default:
          continue
      }
      imgs.push(Util.getProjectAbsolutePath(imgPath));
      originalImgs.push(originalImgPath);
    }
    callback({
      imgs: imgs,
      originalImgs: originalImgs
    }, file, contents);
  })
}

module.exports = scanImageRefs;
