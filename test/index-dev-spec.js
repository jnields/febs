/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback, func-names */

// Dependencies.
const assert = require('assert');
const path = require('path');
const lib = require('./lib');
const sinon = require('sinon');
const logger = require('../lib/logger');

// febs module
const febsModule = require('../index');

describe('FEBS Development Tests', function () {
  let compile;
  let fs;

  beforeEach(function () {
    process.env.FEBS_TEST = true;

    // Keep reference to fs for test assertions.
    fs = lib.createFS();

    // Create compile function using in-memory fs.
    compile = lib.createCompileFn(fs);
  });

  describe('ECMAScript', async function () {
    it('builds ES bundle', async function () {
      const compiled = await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-es2015.js'),
        },
      }));

      assert.equal(compiled.code[0].app[0].filename, 'app.bundle.js');
      assert(compiled.code[0].app[0].content.includes('add: function add()'));
    });

    it('builds multiple ES bundles', async function () {
      const compiled = await compile(lib.createConf({
        entry: {
          app1: lib.absPath('fixtures/src/main-es2015.js'),
          app2: lib.absPath('fixtures/src/main-es2015.js'),
        },
      }));

      assert(compiled.code[0].app1[0].content.includes('add: function add()'));
      assert(compiled.code[1].app2[0].content.includes('add: function add()'));
    });

    it('detects ES syntax errors', async function () {
      await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-es2015-syntax-errors.js'),
        },
      })).then((o) => {
        assert.ok(o.stats.compilation.errors[0].message.includes('Parsing error'));
      });
    });

    it('detects ES lint errors', async function () {
      await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-es2015-lint-errors.js'),
        },
      })).then(o => { assert.equal(o.exitCode, 0)})
    });
  });

  describe('Riot', function () {
    it('compiles Riot tags', async function () {
      const compiled = await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-riot.js'),
        },
      }));

      assert(compiled.code[0].app[0].content.includes('coolcomponent'));
    });

    it('transpiles es2015+ Riot tags', async function () {
      const compiled = await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-riot-with-es2015.js'),
        },
      }));

      assert(compiled.code[0].app[0].content.includes('var coolVar = 0'));
      assert(!compiled.code[0].app[0].content.includes('let coolVar = 0'));
    });

    it('detects Riot parse errors', async function () {
      await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-riot-syntax-error.js'),
        },
      })).then((o) => {
        assert.ok(o.stats.compilation.errors[1].message.includes('Unexpected token'));
      });
    });
  });

  describe('Vue', function () {
    it('compiles Vue tags', async function () {
      const compiled = await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-vue.js'),
        },
      }));

      assert(compiled.code[0].app[0].content.includes('Vue says'));
    });

    it('transpiles es2015+ Vue tags', async function () {
      const compiled = await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-vue.js'),
        },
      }));

      assert(compiled.code[0].app[0].content.includes('var str = \'Hello world\''));
      assert(!compiled.code[0].app[0].content.includes('const str = \'Hello world\''));
    });

    it('detects Vue JavaScript syntax errors', async function () {
      await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-vue-syntax-error.js'),
        },
      })).then((o) => {
        assert.ok(o.stats.compilation.errors[0].message.includes('SyntaxError'));
      });
    });

    it('detects Vue lint errors', async function () {
      await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-vue-lint-error.js'),
        },
      })).then((o) => {
        assert.ok(o.stats.compilation.errors[0].message.includes('Expected 1 space'));
      });
    });
  });

  describe('Sourcemaps', async function () {
    it('generates inline ES sourcemaps', async function () {
      const compiled = await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-es2015.js'),
        },
      }));
      assert(compiled.code[0].app[0].content.includes('sourceURL'));
    });
  });

  describe('Manifest', async function () {
    it('generates a manifest json file for versioned asset mappings', async function () {
      const getJsonFromFS = lib.getJsonFromFile(fs);

      const compiled = await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-es2015.js'),
        },
      }));

      const manifestFile = path.resolve(compiled.options.output.path, 'manifest.json');
      assert(fs.statSync(manifestFile).isFile());

      const manifestJson = getJsonFromFS(manifestFile);
      assert.equal(manifestJson['app.js'], 'app.bundle.js');
    });
  });

  describe('LESS', async function () {
    it('compiles LESS', async function () {
      const compiled = await compile(lib.createConf({
        entry: {
            // app: lib.absPath('../../core-css-build/test/fixtures/src/main.less'),
          app: lib.absPath('fixtures/src/main-with-less.js'),
        },
      }));

        // todo: How to not write extraneous js file (due to the output entry in webpack.config)
        // that is always generated when LESS compile runs.
        // Currently, need to require less in the js.. Is this how we should be
        // pulling in less in wp?

      assert(compiled.code[0].app[1].content.includes('border-color'));
    });
  });

  describe('SASS/SCSS', async function () {
    it('compiles SASS/SCSS', async function () {
      const compiled = await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-with-scss.js'),
        },
      }));

      assert(compiled.code[0].app[1].content.includes('color:' +
        ' #some-color-scss'));
    });
  });

  describe('Logger', function () {
    const logger = require('../lib/logger');
    it('should contain setLogLevel function', function () {
      assert(logger.setLogLevel);
    });

    it('allow changing log levels', function () {
      logger.setLogLevel('warn');
      assert.equal(logger.transports.console.level, 'warn');
    });
  });

  describe('getWebpackConfig', function () {
    it('should not return multiple plugin entries after merging confs', function () {
      const febs = febsModule({
        fs,
      });
      const wpDevConf = require('../webpack-config/webpack.base.conf');
      const expectedLength = wpDevConf.module.rules.length;
      const wpConfig = febs.getWebpackConfig(wpDevConf);
      assert.equal(expectedLength, wpConfig.module.rules.length);
    });
  });

  describe('Webpack config', async function () {
    it('Output path cannot be modified', async function () {
      const compiled = await compile(lib.createConf({
        entry: {
          app: lib.absPath('fixtures/src/main-es2015.js'),
        },
        output: {
          path: lib.absPath('build/modified-output-path'),
        },
      }));

      assert(!compiled.options.output.path.includes('build/modified-output-path'));
    });
  });

  describe('febs-config file respected', function (conf) {
    it('dist path can be changed', async function () {

      const febs = febsModule({
        fs,
      });

      let webpackConfig = febs.getWebpackConfig();

      assert(webpackConfig.output.path, './cool_output_path');

    });
  });

  describe('Exit codes', function () {
    it('should not return exit code 1 in dev mode so that watching persists)', async function () {

      await compile(lib.createConf({
        entry: {
          app1: lib.absPath('fixtures/src/main-es2015-syntax-errors.js'),
        },
      })
      ).then((o) => { assert.equal(o.exitCode, 0)});
    });
  });

  describe('Utility functions', function () {
    describe('cleanDir', function () {
      /*
        Test directory structure:
                /parent
                   /dir1
                      a
                      b
                   /dir2
                      /dir3
                        c
                        d
       */

      it('should return error if trying to delete non-existent directory', function () {

        // Create test dir structure
        fs.mkdirpSync('/parent');

        const febs = febsModule({
          fs,
        });

        assert(!febs.private.cleanDir('/parent2'), /Non-existent directory/);
      });

      it('should delete contents of a directory, leaving the parent', function () {

        // Need to stub lstatSync().isFile() values since lstatSync doesn't
        // exist in memory-fs.
        const lstatSyncStub = sinon.stub();

        lstatSyncStub.withArgs('/parent/dir1/a').returns({
          isFile: () => true
        });
        lstatSyncStub.withArgs('/parent/dir1/b').returns({
          isFile: () => true
        });
        lstatSyncStub.withArgs('/parent/dir2/dir3/c').returns({
          isFile: () => true
        });

        lstatSyncStub.withArgs('/parent/dir2/dir3/d').returns({
          isFile: () => true
        });

        lstatSyncStub.withArgs('/parent').returns({
          isFile: () => false
        });

        lstatSyncStub.withArgs('/parent/dir1').returns({
          isFile: () => false
        });

        lstatSyncStub.withArgs('/parent/dir2').returns({
          isFile: () => false
        });

        lstatSyncStub.withArgs('/parent/dir2/dir3').returns({
          isFile: () => false
        });

        // Create test dir structure
        fs.mkdirpSync('/parent/dir1');
        fs.mkdirpSync('/parent/dir2/dir3');
        fs.writeFileSync('/parent/dir1/a', 'a');
        fs.writeFileSync('/parent/dir1/b', 'b');
        fs.writeFileSync('/parent/dir2/dir3/c', 'c');
        fs.writeFileSync('/parent/dir2/dir3/d', 'd');

        fs.lstatSync = lstatSyncStub;

        const febs = febsModule({
          fs,
        });

        assert.deepEqual(fs.readdirSync('/parent'), ['dir1', 'dir2']);
        febs.private.cleanDir('/parent');
        assert.deepEqual(fs.readdirSync('/parent'), []);
      });
    });

  });

  describe('Dev Server', function () {
    const devServerFn = require('../lib/dev-server');
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
