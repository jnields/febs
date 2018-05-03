const path = require('path');
const MemoryFS = require('memory-fs');
const R = require('ramda');
const febsModule = require('../../index');

module.exports = {

  // Set up an in-memory file system for tests.
  createFS: () => new MemoryFS(),

  /**
   * Utility to create webpack conf override fragment.
   * @param {*} obj Object to add to override fragment, typically
   * the entry.
   */
  createConf: obj => Object.assign({}, obj, {}),

  /**
   * Webpack curried compile helper for unit tests.
   * Sets up and runs webpack with in-memory file system.
   *
   * @param {Object} fs The memory-fs instance.
   * @param {Object} conf The override conf object.
   * @return {Promise}  Promise resolving with an object containing
   *                    compiled code and webpack output.
   */

  createCompileFn: R.curry((fs, conf) => new Promise((resolve, reject) => {
      // create compiler instance
    const febs = febsModule({
      fs,
    });

    const compiler = febs.createCompiler(conf);

      // Set up in-memory file system for tests.
    compiler.outputFileSystem = fs;

      // Run webpack
    compiler.run((err, stats) => {
        // call the source done callback.
      febs.webpackCompileDone(err, stats);

      const entrypoints = stats.toJson('verbose').entrypoints;

        // Reject webpack errors
      if (err) return reject(err);

      if (stats.compilation.errors && stats.compilation.errors.length > 0) {
        return reject(stats.compilation.errors);
      }

        // Resolve with wp compile results.
      const code = Object.keys(entrypoints).map((key) => { // key is entrypoint key (e.g. "app")
        const res = {};
        res[key] = []; // an array of built assets will be under the key

        const assets = entrypoints[key].assets; // array of assets under that key.
        assets.forEach((asset) => {
          const o = {};
          o.filename = asset;
          o.content = fs.readFileSync(path.resolve(`${compiler.outputPath}/${asset}`), 'utf8');
          res[key].push(o);
        });

        return res;
      });

      return resolve({ err, stats, code, options: compiler.options });
    });
  })),

  // Absolute path relative to the /test dir.
  absPath: relPath => path.resolve(__dirname, '..', relPath),

  /**
   * Helper to return json object from a file of json content.
   * filePath -> Object
   * @param String The path to file.
   * @returns Object The json object.
   */
  getJsonFromFile: fs => R.compose(
    JSON.parse,
    file => fs.readFileSync(file, 'utf8')
  ),
};
