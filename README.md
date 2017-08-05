[![Build Status](https://travis-ci.com/rei/febs.svg?token=aB3sLfhn5YbJtayKJo1q&branch=master)](https://travis-ci.com/rei/febs)

# FEBS

## Description

- Next-gen, webpack-based prototype build system.

- Work in progress and will change as we communicate with teams to determine requirements.

- The driving philosophy is minimal code, delegating essentially all build tasks directly through to webpack.

## Goals
- Simple, minimal, reliable, maintainable.
- Re-usable across all REI microsites.
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
- No gulp?
    - It's just a task runner; we use npm scripts.

## Installation
- `npm install git+https://github.com/rei/febs.git`

## Usage

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

[x] Development build (ES, LESS)

[x] Riot

[x] Vue

[x] Sourcemaps (development, inline)

[x] Sourcemaps (production, external)

[x] Production build (asset versioning, minification)

[x] Live reloading (via CLI)

[x] Live reloading (via Node API).

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
