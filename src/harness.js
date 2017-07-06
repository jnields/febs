const febs = require('./index');


febs.buildJS({
  dirname: __dirname,
  src: '../test/fixtures/src/main-es2015.js',
  dest: '../test/fixtures/dest/',
  dev: false,
  test: false,
  es2015: true,
  riot: false,
  watch: true,
});
