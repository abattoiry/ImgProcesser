const path = require('path');

config = Object.assign({
  rdDir: './src',
  compareThreshold: 1,
  compareDir: './src'
}, require(path.resolve(process.cwd(), 'package.json')).imgProcessor);

module.exports = config;