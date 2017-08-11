[![Build Status](https://travis-ci.org/rei/febs.svg?branch=master)](https://travis-ci.org/rei/febs)

# FEBS

## Current Status
- This is a work in progress and things will likely change for the initial 2.0 release

## Description

FEBS is an extensible front-end build system with a simple, command-line interface that:
- builds of all of your front-end production and development assets.
- allows extension via webpack overrides of our defaults.
- runs your JavaScript unit tests.
- runs code coverage of your JavaScript.
- performs quality checks using Airbnb's style guide and ESLint rules.
- provides a live reload development server that updates as you code.

## Features
- Command-line interface (see Usage)
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

### Commands

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
