const path = require('path');

const importConfig = require(path.resolve(process.cwd(), 'package.json')).imgProcessor;

// 处理路径
for (let key in importConfig) {
  let value = importConfig[key];
  // 去掉多余的 / 结尾
  if (value[value.length - 1] === '/') {
    if (value.length !== 2) {
      importConfig[key] = value.slice(0, value.length - 1);
    }
  }
  // 如果链接为空，给一个默认当前相对路径
  if (!value){
    importConfig[key] = './';
  }
}

config = Object.assign({
  rdDir: './src',
  absoluteRoot: './',
  imgPathType: 'relative',
  compareThreshold: 1,
  compareDir: './src',
}, importConfig);
console.log(config)
module.exports = config;