const { getPath } = require('./utils/getPath');
const Util = require('./utils/util');
const imgCompare = require('./img-compare');
const scanImageRefs = require('./utils/scan-image-refs');

(async function removeDuplicated() {
  const sameImgGroups = await imgCompare();
  scanImageRefs(remove);
  function remove(originalImgPath, imgPath, file, contents) {
    imgPath = Util.getAbsolutePath(imgPath);
    sameImgGroups.forEach((group) => {
      const replaceImg = group[0];
      group.forEach((item) => {
        const _item = Util.getAbsolutePath(item);
        console.log('======', _item, '========', imgPath)
        if (Util.getAbsolutePath(item) === imgPath) {
          imgPath = replaceImg;
          Util.replaceContent(file, contents, originalImgPath, Util.getAbsolutePath(imgPath));
        }
      })
    })
  }
})()
