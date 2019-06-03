const { compare } = require('resemblejs');
const fs = require('fs');
const glob = require('glob');

const options = {
  output: {
    errorColor: {
      red: 255,
      green: 0,
      blue: 255
    },
    errorType: 'movement',
    transparency: 0.3,
    largeImageThreshold: 1200,
    useCrossOrigin: true,
    outputDiff: false,
  },
  scaleToSameSize: false,
  ignore: null
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
          resolve(data)
        }
      }
    );
  })
}

// 总列表
const imgArrs = [];
(async function run() {
  let files;
  try {
    files = await new Promise((resolve, reject) => {
      glob('**/*.png', (err, data) => {
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
    // 子列表
    const arr = [];
    // 每次取出来第一个
    item = files.shift();
    // 从第二个开始遍历
    for (let i = 0; i < files.length; i++) {
      const _item = files[i];
      try {
        let res = await imgCompare(item, _item)
        if (res.rawMisMatchPercentage < 20) {
          // 如果是这次do的第一次匹配就将取出来的item push进列表，并将列表push到总列表里
          if (flag) {
            arr.push(item);
            imgArrs.push(arr);
            flag = false;
          }
          arr.push(_item);
          // 从列表中去除掉
          files.splice(i, 1);
          // 列表缩短了所以index要-1
          i--;
        }
      } catch (err) {
        console.log('resemble compare error', err);
      }
    }
  } while (item);
  console.log(imgArrs);
})()

module.exports = {
  imgCompare
}
