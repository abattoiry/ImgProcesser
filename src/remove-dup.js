const { getPath } = require('./utils/getPath');
const Util = require('./utils/util');
const imgCompare = require('./img-compare');
const scanImageRefs = require('./utils/scan-image-refs');

(async function removeDuplicated() {
  // 获取图片对比列表
  const sameImgGroups = await imgCompare();
  // 查找所有文件里面的img链接
  scanImageRefs(remove);

  /**
   * scanImageRefs的回调，不是每个链接回调，而是每个文件回调
   *
   * @param {*} imgData 多个文件的原始链接和处理后链接
   * @param {*} file 文件名称
   * @param {*} content 文件内容
   */
  function remove(imgData, file, content) {
    let writeImgs = [];
    // 遍历所有的相似图片组
    sameImgGroups.forEach((group) => {
      const replaceImg = group[0];
      // 遍历一个组里面的图片
      group.forEach((item) => {
        // 遍历要写入的一个文件里面所有的图片路径
        imgData.imgs.forEach((imgPath, index) => {
          if (item === imgPath) {
            imgPath = replaceImg;
            writeImgs.push({
              current: imgPath,
              original: imgData.originalImgs[index]
            })
          }
        })
      })
    })
    // 一次性写入一个文件所有的路径修改
    Util.replaceContent(writeImgs, file, content);
  }
})()
