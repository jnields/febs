[![Build Status](https://travis-ci.org/rei/febs.svg?branch=master)](https://travis-ci.org/rei/febs)

# FEBS

## Current Status
- Work in progress and things will change significantly for the initial 2.0 release

## Description

- Next-gen, webpack-based prototype build system.

- The driving philosophy is minimal code, delegating essentially all build tasks directly through to webpack.

## Goals
- Simple, minimal, reliable, maintainable.
- 100% code coverage.
- npm-based scripts, no gulp.
- Overridable defaults.

## Features
- Super simple command-line interface with help
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
- webpack?
  - Take advantage of the very large open-source community that currently rallies around webpack: new development, issue resolution, etc.
  - webpack contains functionality that we need either itself or through its ecosystem of loaders and plugins.
  - Maintainable due to the fact that there is minimal code and it is well tested.
  - Updateable via webpack's ecosystem and local webpack conf overrides.

## Installation
- `npm install --global --save-dev git+https://github.com/rei/febs.git`

### Assumptions

FEBS assumes and creates the following:
  - Source entry point is `/src/entry.js`
  - Bundles written to `/dest`.

### Commands

#### Help
```
$ febs --help
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
