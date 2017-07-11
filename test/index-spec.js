/* eslint-disable prefer-arrow-callback */

// Dependencies.
const assert = require('assert');
const path = require('path');
const MemoryFS = require('memory-fs');
const util = require('../src/lib/util');

// const logger = require('../../lib/logger');
// const sinon = require('sinon');
// const touch = require('touch'); // eslint-disable-line import/no-extraneous-dependencies

// Bring in module
const mod = require('../src/index');

/**
 * Webpack compile helper. Sets up and runs webpack with in-memory
 * file system.
 * @param {Object} conf The override conf object.
 * @return {Promise}  Promise resolving with an object containing
 *                    compiled code and webpack output.
 */
const compile = conf => new Promise((resolve, reject) => {
  const compiler = mod.createCompiler(conf);
  const fs = new MemoryFS();
  compiler.outputFileSystem = fs;

  compiler.run((err, stats) => {
    const entrypoints = stats.toJson('verbose').entrypoints;
    const errors = util.getWebpackErrors(err, stats);

    // Reject webpack errors
    if (errors) {
      return reject(errors);
    }

    // Resolve with compile results.
    const code = Object.keys(entrypoints).map((key) => {  // key is entrypoint key (e.g. "app")
      const res = {};
      res[key] = [];  // an array of built assets will be under the key

      const assets = entrypoints[key].assets;  // array of assets under that key.
      assets.forEach((asset) => {
        const o = {};
        o.filename = asset;
        o.content = fs.readFileSync(path.resolve(__dirname, `../dest/${asset}`), 'utf8');
        res[key].push(o);
      });

      return res;
    });

    return resolve({ err, stats, code });
  });
});

const absPath = relPath => path.resolve(__dirname, relPath);

describe('FEBS Build', () => {
  describe('Production mode', function () {
    beforeEach(function () {
      process.env.NODE_ENV = 'prod';
    });

    it('builds ES production bundle - versioned, minified, sourcemaps', async function () {
      const compiled = await compile({
        entry: {
          app: absPath('fixtures/src/main-es2015.js'),
          app2: absPath('fixtures/src/main-es2015.js'),
        },
      }).catch(util.logErrors);
      assert.equal(compiled.code.length, 2);

      // source and sourcemap.
      assert.equal(compiled.code[0].app.length, 2); // js and map

      // sourcemap
      assert(compiled.code[0].app[1].filename.includes('.map'));
      assert(compiled.code[0].app[1].content.length > 0);

      // minified
      assert(compiled.code[0].app[0].content.includes('add:function'));
    });
  });

  describe('Development mode', function () {
    beforeEach(function () {
      process.env.NODE_ENV = 'dev';
    });

    describe('ECMAScript', async function () {
      it('builds ES bundle', async function () {
        const compiled = await compile({
          entry: {
            app: absPath('fixtures/src/main-es2015.js'),
          },
        }).catch(util.logErrors);
        assert.equal(compiled.code[0].app[0].filename, 'app.bundle.js');
        assert(compiled.code[0].app[0].content.includes('add: function add()'));
      });

      it('builds multiple ES bundles', async function () {
        const compiled = await compile({
          entry: {
            app1: absPath('fixtures/src/main-es2015.js'),
            app2: absPath('fixtures/src/main-es2015.js'),
          },
        }).catch(util.logErrors);
        assert(compiled.code[0].app1[0].content.includes('add: function add()'));
        assert(compiled.code[1].app2[0].content.includes('add: function add()'));
      });

      it('detects ES syntax errors', async function () {
        await compile({
          entry: {
            app: absPath('fixtures/src/main-es2015-syntax-errors.js'),
          },
        }).catch((errors) => {
          assert(errors.compile);
          assert(errors.compile[0].includes('SyntaxError'));
        });
      });
    });

    describe('Riot', function () {
      it('compiles Riot tags', async function () {
        const compiled = await compile({
          entry: {
            app: absPath('fixtures/src/main-riot.js'),
          },
        }).catch(util.logErrors);

        assert(compiled.code[0].app[0].content.includes('coolcomponent'));
      });

      it('detects Riot parse errors', async function () {
        await compile({
          entry: {
            app: absPath('fixtures/src/main-riot-syntax-error.js'),
          },
        }).catch((errors) => {
          assert(errors.compile);
        });
      });
    });

    describe('Vue', function () {
      it('compiles Vue tags', async function () {
        const compiled = await compile({
          entry: {
            app: absPath('fixtures/src/main-vue.js'),
          },
        }).catch(util.logErrors);

        assert(compiled.code[0].app[0].content.includes('Vue says'));
      });

      it('detects Vue parse errors', async function () {
        await compile({
          entry: {
            app: absPath('fixtures/src/main-vue-syntax-error.js'),
          },
        }).catch((errors) => {
          assert(errors.compile);
        });
      });
    });

    describe('Sourcemaps', async function () {
      it('generates inline ES sourcemaps', async function () {
        const compiled = await compile({
          entry: {
            app: absPath('fixtures/src/main-es2015.js'),
          },
        }).catch(util.logErrors);
        assert(compiled.code[0].app[0].content.includes('sourceURL'));
      });
    });

    describe('LESS', async function () {
      it('compiles LESS', async function () {
        const compiled = await compile({
          entry: {
            // app: absPath('../../core-css-build/test/fixtures/src/main.less'),
            app: absPath('fixtures/src/main-with-less.js'),
          },
        }).catch(util.logErrors);

        // todo: How to not write extraneous js file (due to the output entry in webpack.config)
        // that is always generated when LESS compile runs.
        // Currently, need to require less in the js.. Is this how we should be
        // pulling in less in wp?
        assert(compiled.code[0].app[1].content.includes('border-color'));
      });
    });
  });
});
