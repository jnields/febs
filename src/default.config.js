// default build configuration.
// If want to override, client needs to provide a local config
// that febs will check for existence first.

module.exports = {

  dirname: __dirname,

  // js source directory
  src: '../test/fixtures/src/main.js',

  // build directory
  dest: 'test/fixtures/dest/',

  // using ES2015?
  es2015: false,

  // true: no minification, revisioned bundles, sourcemaps.
  // false: minification, revisioned bundles, no sourcemaps
  dev: false,

  // In memory file system
  test: true,
};
