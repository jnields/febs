/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback, func-names */

// Dependencies.
const assert = require('assert');
const path = require('path');
const MemoryFS = require('memory-fs');
const utils = require('../src/lib/util');

let util;

// Create in-memory file system for tests.
const fs = new MemoryFS();

// febs module
const febsModule = require('../src/index');

/**
 * Webpack compile helper for unit tests.
 * Sets up and runs webpack with in-memory file system.
 *
 * @param {Object} conf The override conf object.
 * @return {Promise}  Promise resolving with an object containing
 *                    compiled code and webpack output.
 */
const compile = (env, conf) => new Promise((resolve, reject) => {
  // configure utils with the wp config, fs.
  util = utils({
    wpConf: conf,
    fs,
  });

  // create compiler instance
  const febs = febsModule({
    fs,
    env,
  });

  const compiler = febs.createCompiler(conf);

  // Set up in-memory file system for tests.
  compiler.outputFileSystem = fs;

  // Run webpack
  compiler.run((err, stats) => {
    // call the source done callback.
    febs.webpackCompileDone(err, stats);

    const entrypoints = stats.toJson('verbose').entrypoints;
    const errors = util.getWebpackErrors(err, stats);

    // Reject webpack errors
    if (errors) {
      return reject(errors);
    }

    // Resolve with wp compile results.
    const code = Object.keys(entrypoints).map((key) => { // key is entrypoint key (e.g. "app")
      const res = {};
      res[key] = []; // an array of built assets will be under the key

      const assets = entrypoints[key].assets; // array of assets under that key.
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
      process.env.FEBS_TEST = true;

      // Create the destination directory
      fs.mkdirpSync(absPath('../dest'));
    });

    it('builds ES production bundle - versioned, minified, sourcemaps', async function () {
      const compiled = await compile('prod', {
        entry: {
          app1: absPath('fixtures/src/main-es2015.js'),
          app2: absPath('fixtures/src/main-es2015.js'),
        },
      }).catch(util.logErrors);
      assert.equal(compiled.code.length, 2);

      // source and sourcemap.
      assert.equal(compiled.code[0].app1.length, 2); // js and map

      // sourcemap
      assert(compiled.code[0].app1[1].filename.includes('.map'));
      assert(compiled.code[0].app1[1].content.length > 0);

      // minified
      assert(compiled.code[0].app1[0].content.includes('add:function'));
    });
  });

  describe('Development mode', function () {
    const env = 'dev';
    beforeEach(function () {
      // process.env.NODE_ENV = 'dev';
      process.env.FEBS_TEST = true;

      // Create the destination directory
      fs.mkdirpSync(absPath('../dest'));
    });

    describe('ECMAScript', async function () {
      it('builds ES bundle', async function () {
        const compiled = await compile('dev', {
          entry: {
            app: absPath('fixtures/src/main-es2015.js'),
          },
        }).catch(util.logErrors);
        assert.equal(compiled.code[0].app[0].filename, 'app.bundle.js');
        assert(compiled.code[0].app[0].content.includes('add: function add()'));
      });

      it('builds multiple ES bundles', async function () {
        const compiled = await compile('dev', {
          entry: {
            app1: absPath('fixtures/src/main-es2015.js'),
            app2: absPath('fixtures/src/main-es2015.js'),
          },
        }).catch(util.logErrors);
        assert(compiled.code[0].app1[0].content.includes('add: function add()'));
        assert(compiled.code[1].app2[0].content.includes('add: function add()'));
      });

      it('detects ES syntax errors', async function () {
        await compile('dev', {
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
        const compiled = await compile('dev', {
          entry: {
            app: absPath('fixtures/src/main-riot.js'),
          },
        }).catch(util.logErrors);

        assert(compiled.code[0].app[0].content.includes('coolcomponent'));
      });

      it('detects Riot parse errors', async function () {
        await compile('dev', {
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
        const compiled = await compile('dev', {
          entry: {
            app: absPath('fixtures/src/main-vue.js'),
          },
        }).catch(util.logErrors);

        assert(compiled.code[0].app[0].content.includes('Vue says'));
      });

      it('detects Vue parse errors', async function () {
        await compile('dev', {
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
        const compiled = await compile('dev', {
          entry: {
            app: absPath('fixtures/src/main-es2015.js'),
          },
        }).catch(util.logErrors);
        assert(compiled.code[0].app[0].content.includes('sourceURL'));
      });
    });

    describe('Asset Fragments', async function () {
      it('generates js asset fragment', async function () {
        await compile('dev', {
          entry: {
            app: absPath('fixtures/src/main-es2015.js'),
          },
        }).catch(util.logErrors);

        assert(fs.statSync(path.resolve(process.cwd(), 'dest', 'assets.js.html')).isFile());
      });
    });

    describe('LESS', async function () {
      it('compiles LESS', async function () {
        const compiled = await compile('dev', {
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

    describe('Logger', function () {
      const logger = require('../src/lib/logger');
      it('should contain setLogLevel function', function () {
        assert(logger.setLogLevel);
      });

      it('allow changing log levels', function () {
        logger.setLogLevel('warn');
        assert.equal(logger.transports.console.level, 'warn');
      });
    });

    describe('Dev Server', function () {
      const devServerFn = require('../src/dev-server');
      const devServer = devServerFn({}, function () {
        this.app = {};

        this.app.use = function () {};
        this.app.get = function () {};
        this.app.set = function () {};
        this.app.engine = function () {};

        this.listen = (port, ip, cb) => {
          cb();
        };
      });

      it('should create new server', function () {
        assert(devServer);
      });
    });
  });
});
