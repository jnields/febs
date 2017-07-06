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

    // console.log(Object.keys(entrypoints));
    // console.log(entrypoints);

    // Resolve with compile results.
    const code = Object.keys(entrypoints).map((key) => {
      if (entrypoints[key].assets.length === 1) {
        return fs.readFileSync(path.resolve(__dirname, `../dest/${key}.bundle.js`), 'utf8');
      }
      return fs.readFileSync(path.resolve(__dirname, `../dest/${key}.bundle.css`), 'utf8');
    });
    return resolve({ err, stats, code });
  });
});

const absPath = relPath => path.resolve(__dirname, relPath);

describe('FEBS Build', () => {
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
        assert(compiled.code[0].includes('add: function add()'));
      });

      it('builds multiple ES bundles', async function () {
        const compiled = await compile({
          entry: {
            app1: absPath('fixtures/src/main-es2015.js'),
            app2: absPath('fixtures/src/main-es2015.js'),
          },
        }).catch(util.logErrors);
        assert(compiled.code[0].includes('add: function add()'));
        assert(compiled.code[1].includes('add: function add()'));
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

        assert(compiled.code[0].includes('coolcomponent'));
      });

      it('detects Riot parse errors', async function () {
        await compile({
          entry: {
            app: absPath('fixtures/src/main-riot-syntax-error.js'),
          },
        }).catch((errors) => {
          assert(errors.compile);
          assert(errors.compile[0].includes('Unexpected'));
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
        assert(compiled.code[0].includes('sourceURL'));
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
        assert(compiled.code[0].includes('border-color'));
      });
    });
  });
});
