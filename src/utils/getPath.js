const path = require('path');

module.exports = {
  getPath: function (exactPath) {
    return path.resolve(process.cwd(), exactPath);
  }
}