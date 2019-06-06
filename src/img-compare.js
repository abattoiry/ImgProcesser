#!/usr/bin/env node
/* eslint-disable */
const { compare } = require('resemblejs');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const config = require(path.resolve(process.cwd(), 'src/utils/config.js'));

/*
  compareThreshold有两个作用：
  1. 图片区别率在这个值以下的为相似图片
  2. 当计算图片区别率时，超过这个值就不再计算了，可以极大的提高效率
  默认为5
*/
const compareThreshold = config.compareThreshold;

const options = {
  scaleToSameSize: false,
  ignore: null,
  returnEarlyThreshold: compareThreshold,
};

function imgCompare(img1, img2) {
  console.log(img1, img2)
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
async function run() {
  let files;
  // 获取图片路径
  try {
    files = await new Promise((resolve, reject) => {
      glob(`${config.compareDir}/**/*.png`, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      })
    })
  } catch (err) {
    console.log('glob error', err);
    return;
  }
  console.log(files)
  let item, flag;
  do {
    flag = true;
    const arr = []; // 一组相似图片
    // 用来做对比的图片提取出来删除掉
    item = files.shift();
    for (let i = 0; i < files.length; i++) {
      const _item = files[i];
      try {
        let res = await imgCompare(item, _item);
        if (res.rawMisMatchPercentage < compareThreshold) {
          if (flag) {
            arr.push(item);
            imgArrs.push(arr);
            flag = false;
          }
          arr.push(_item);
          // 对比过相似的图片删除掉
          files.splice(i, 1);
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
  return imgArrs;
}

module.exports = run;

