[![Build Status](https://travis-ci.org/rei/febs.svg?branch=master)](https://travis-ci.org/rei/febs)

# FEBS

## Description

`FEBS` is an extensible front-end build system with a simple, command-line interface that builds all of your front-end production and development assets.

## Features
- Command-line interface (see [Usage](#usage))
- Supports building:
  - Vue
  - Riot
  - Less
- Creates development and versioned production builds with sourcemaps.
- Live reloading and code-watching for fast prototyping and development.
- Runs JavaScript quality checks:
  - eslint (Airbnb style)
  - unit tests
  - code coverage

## Installation
- `npm install --save-dev git+https://github.com/rei/febs.git`

### Defaults

By default febs is configured for:
  - Source entry point: `/src/entry.js`
  - Bundles written to: `/dist`.

### <a name="usage"></a>Usage

#### Help

    $ febs --help

#### Start a new febs project
Requires a package.json file in the same dir where you run the command
    
    $ febs init

#### Production Build

    $ NODE_ENV=prod febs prod (or febs)

#### Development Build

    $ NODE_ENV=dev febs dev --no-dev-server

#### Dev Server (Live reload)

    $ NODE_ENV=dev febs dev

#### Dev Server (watch)

    $ NODE_ENV=dev febs --no-dev-server --watch

### Overrides

`FEBS` uses webpack under the hood, so we provide a mechanism for you to customize your build simply by creating a local `webpack.overrides.conf.js` file. Anything that webpack understands is fair game for the overrides file. Want to add a loader or a plugin?

```js
// webpack.overrides.conf.js
module.exports = {
  .
  .
  module: {
    rules: [{
      test: '/\.js$/'
      use: {
        loader: 'cool-js-loader'
      }
    }]
  },
  .
  .
  plugins: [
    new CoolPlugin() 
  ]
};
```

### Todo:

[ ] rename package from febs to rei-febs or scope package to @rei/febs

[ ] Vendor code splitting.

[ ] Unit tests of client code.
    [x] Node
    [ ] Riot
    [ ] Vue

[ ] Code coverage of client code:
    [x] Node
    [ ] Riot
    [ ] Vue

[x] HTML snippet generation

[ ] Asset CDN integration
