const path = require('path');

config = Object.assign({
  rdDir: './',
  compareThreshold: 5,
  compareDir: './'
}, require(path.resolve(process.cwd(), 'package.json')).imgProcessor);

module.exports = config;