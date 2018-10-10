/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback, func-names */

// Dependencies.
const assert = require('assert');
const lib = require('./lib');

describe('FEBS Production Tests', function () {
  let compile;

  beforeEach(function () {
    process.env.FEBS_TEST = true;

    compile = lib.createCompileFn(lib.createFS());
  });

  it('js is minified', async function () {
    const compiled = await compile(lib.createConf({
      entry: {
        app1: lib.absPath('fixtures/src/main-es2015.js'),
      },
    })
      );

    assert(compiled.code[0].app1[0].content.includes('add:function'));
  });

  it('js contains sourcemap', async function () {
    const compiled = await compile(lib.createConf({
      entry: {
        app1: lib.absPath('fixtures/src/main-es2015.js'),
      },
    })
      );

      // source and sourcemap.
    assert.equal(compiled.code[0].app1.length, 2); // js and map

      // sourcemap
    assert(compiled.code[0].app1[1].filename.includes('.map'));
    assert(compiled.code[0].app1[0].content.length > 0);
  });

  it('js is versioned', async function () {
    const compiled = await compile(lib.createConf({
      entry: {
        app1: lib.absPath('fixtures/src/main-es2015.js'),
      },
    })
      );

    assert(compiled.code[0].app1[0].filename.match(/-[a-z0-9]{10,}\.js$/));
  });

  it('css is versioned', async function () {
    const compiled = await compile(lib.createConf({
      entry: {
        app1: lib.absPath('fixtures/src/main.less'),
      },
    }));

    assert(compiled.code[0].app1[1].filename.match(/-[a-z0-9]{10,}\.css$/));
  });

  it('should return exit code 1 on syntax errors', async function () {
    await compile(lib.createConf({
      entry: {
        app1: lib.absPath('fixtures/src/main-es2015-syntax-errors.js'),
      },
    })
    ).then((o) => {
      assert.equal(o.exitCode, 1);
    });
  });

  it('should not return exit code 1 only lint errors', async function () {
    await compile(lib.createConf({
        entry: {
          app1: lib.absPath('fixtures/src/main-es2015-lint-errors.js'),
        },
      })).then((o) => {
      assert.equal(o.exitCode, 0)
    })
  });
});
