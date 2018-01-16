/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback, func-names */

// Dependencies.
const assert = require('assert');
const util = require('../lib/util')();
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
      ).catch(util.logErrors);

    assert(compiled.code[0].app1[0].content.includes('add:function'));
  });

  it('js contains sourcemap', async function () {
    const compiled = await compile(lib.createConf({
      entry: {
        app1: lib.absPath('fixtures/src/main-es2015.js'),
      },
    })
      ).catch(util.logErrors);

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
      ).catch(util.logErrors);

    assert(compiled.code[0].app1[0].filename.match(/-[a-z0-9]{10,}\.js$/));
  });

  it('css is versioned', async function () {
    const compiled = await compile(lib.createConf({
      entry: {
        app1: lib.absPath('fixtures/src/main.less'),
      },
    })
      ).catch(util.logErrors);

    assert(compiled.code[0].app1[1].filename.match(/-[a-z0-9]{10,}\.css$/));
  });
});
