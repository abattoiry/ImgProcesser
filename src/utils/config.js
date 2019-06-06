const path = require('path');
const { getPath } = require('./getPath');

config = Object.assign({
  rdDir: './',
  compareThreshold: 5,
  compareDir: './'
}, require(getPath('package.json')).imgProcessor);

module.exports = config;