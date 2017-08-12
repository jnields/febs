[![Build Status](https://travis-ci.org/rei/febs.svg?branch=master)](https://travis-ci.org/rei/febs)

# FEBS

## Current Status
- This is a work in progress and things will likely change for the initial 2.0 release

## Description

`FEBS` is an extensible front-end build system with a simple, command-line interface that:
- builds all of your front-end production and development assets.
- allows extension via webpack overrides of our defaults.
- runs JavaScript unit tests.
- runs JavaScript code coverage.
- performs quality checks using Airbnb's style guide and ESLint rules.
- provides you with a live-reload development server.

## Features
- Command-line interface (see [Usage](#usage))
- Supports building:
  - Vue
  - Riot
  - Less
- Creates development and versioned production builds.
- Creates source maps.
- Live reloading for fast prototyping and development.
- Runs quality checks
  - eslint
  - unit tests
  - code coverage

## Decisions:
- Why webpack
  - Take advantage of the very large open-source community that currently rallies around webpack: new development, issue resolution, etc.
  - webpack contains functionality that we need either itself or through its ecosystem of loaders and plugins.
  - Maintainable due to the fact that there is minimal code and it is well tested.
  - Updateable via webpack's ecosystem and local webpack conf overrides.

## Installation
- `npm install --global --save-dev git+https://github.com/rei/febs.git`

### Defaults

By default febs is configured for:
  - Source entry point: `/src/entry.js`
  - Bundles written to: `/dist`.

### <a name="usage"></a>Usage

#### Help
```
$ febs --help
```
#### Start a new febs project
```
$ febs init
```
#### Production Build
```
$ febs prod (or febs)
```
#### Development Build
```
$ febs dev
```
#### Dev Server (Live reload)
```
$ febs dev-server
```

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
    [ ] Node
    [ ] Riot
    [ ] Vue

[x] HTML snippet generation

[ ] Asset CDN integration
