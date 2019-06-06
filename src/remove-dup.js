const fs = require('fs');
const glob = require('glob');
const path = require('path');
const { getPath } = require('./utils/getPath');
const config = require(getPath('src/utils/config.js'));
const getFiles = require('./utils/getFiles');
const Util = require('./utils/util');
const imgCompare = require('./img-compare');

const URL_PIC_REG = /(require\(|url\(|[^:]src=)(\'|\")?(.*?(\.png|\.jpg))/g;
console.log(__dirname);



async function scanImageRefs(fileList) {
  const sourceFiles = await getFiles(config.rdDir, [], ['html']);
  // 获取所有相同图片
  const sameImgGroups = await imgCompare();

  const usedImageList = [];
  sourceFiles.forEach(file => {
    const contents = fs.readFileSync(file, 'utf8');
    console.log(contents)
    while ((result = URL_PIC_REG.exec(contents)) != null) {
      let imgPath = result[3];
      const originalImgPath = result[3];
      console.log(imgPath);
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
      sameImgGroups.forEach((group) => {
        const replaceImg = group[0];
        group.forEach((item) => {
          if (item === imgPath) {
            imgPath = replaceImg;
            Util.replaceContent(file, contents, originalImgPath, Util.getAbsolutePath(imgPath));
          }
        })
      })
    }
  });

  for (let i = 0; i < fileList.length; i++) {
    if (!usedImageList.includes(path.resolve(fileList[i]))) {
      // logger('未使用的图片：', fileList[i]);
    }
  }

  return fileList;
}

scanImageRefs([])
