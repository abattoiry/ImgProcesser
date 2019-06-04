const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

(async () => {
  const files = await imagemin(['**/*.{jpg,png}'], '', {
    plugins: [
      imageminJpegtran(),
      imageminPngquant()
    ],
    verbose: true
  }, {
    }).then((res, err) => {
      console.log('res', res)
      // console.log('err', err)
    });
})();