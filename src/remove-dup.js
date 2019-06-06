const { getPath } = require('./utils/getPath');
const Util = require('./utils/util');
const imgCompare = require('./img-compare');
const scanImageRefs = require('./utils/scan-image-refs');

(async function removeDuplicated() {
  const sameImgGroups = await imgCompare();
  scanImageRefs(remove);
  function remove(imgData, file, contents) {
    let writeImgs = [];
    // 遍历所有的相似图片组
    sameImgGroups.forEach((group) => {
      const replaceImg = group[0];
      // 遍历一个组里面的图片
      group.forEach((item) => {
        // 遍历要写入的一个文件里面所有的图片路径
       imgData.imgs.forEach((imgPath, index) => {
          if (Util.getAbsolutePath(item) === Util.getAbsolutePath(imgPath)) {
            imgPath = Util.getAbsolutePath(replaceImg);
            writeImgs.push({
              current: imgPath,
              original: imgData.originalImgs[index]
            })
          }
        })
      })
    })
    console.log(writeImgs)
    // 一次性写入一个文件所有的路径修改
    Util.replaceContent(writeImgs, file, contents);
  }
})()
