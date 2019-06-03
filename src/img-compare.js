/* eslint-disable */
const { compare } = require('resemblejs');
const fs = require('fs');
const glob = require('glob');

// 超过此值不在继续计算区别，提高效率
const compareThreshold = 5;

const options = {
  scaleToSameSize: false,
  ignore: null,
  returnEarlyThreshold: compareThreshold,
};

function imgCompare(img1, img2) {
  return new Promise((resolve, reject) => {
    compare(
      fs.readFileSync(img1),
      fs.readFileSync(img2),
      options, (err, data) => {
        if (err) {
          console.log('resemble compare error', err);
          reject(err);
        } else {
          resolve(data);
        }
      }
    )
  });
}

// 所有相似图片组
const imgArrs = [];
(async function run() {
  let files;
  try {
    files = await new Promise((resolve, reject) => {
      glob('./src/**/*.png', (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      })
    })
  } catch (error) {
    console.log('glob error', err);
    return;
  }
  let item, flag;
  do {
    flag = true;
    const arr = []; // 一组相似图片
    // 每次取出来一张图片
    item = files.shift();
    // 遍历剩下的图片列表
    for (let i = 0; i < files.length; i++) {
      const _item = files[i];
      try {
        let res = await imgCompare(item, _item);
        if (res.rawMisMatchPercentage < compareThreshold) {
          // 每次遍历对比的第一次成功
          if (flag) {
            // 将之前取出的图片放入输出列表里，证明这张图片是有类似图片的
            arr.push(item);
            imgArrs.push(arr);
            flag = false;
          }
          // 将对比成功的图片放入输出列表
          arr.push(_item);
          // 从文件列表中去除掉对比成功的图片，以后不再作对比
          files.splice(i, 1);
          // 列表缩短了所以index要-1
          i--;
        }
      } catch (err) {
        console.log('resemble compare error', err);
      }
    }
    if (arr.length > 0) {
      console.log(arr);
      console.log('========================================')
    }
  } while (item);
  console.log(`一共存在${imgArrs.length}组相似图片`);
})()

module.exports = {
  imgCompare
};
