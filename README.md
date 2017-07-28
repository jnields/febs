[![Build Status](http://ci.rei.com/job/fed/job/febs_2.0/badge/icon)](http://ci.rei.com/job/fed/job/febs_2.0/)

# FEBS

## Description

- Next-gen, webpack-based prototype build system.

- Work in progress and will change as we communicate with teams to determine requirements.

- The driving philosophy is minimal code, delegating essentially all build tasks directly through to webpack.

## Goals
- Simple, minimal, reliable, maintainable.
- Re-usable across all REI microsites.
- Unit tested
- npm-based scripts, no gulp
- Overridable defaults

## Features:
- All build tasks are run through webpack. Why?
  - Take advantage of the very large community that currently rallies around webpack: new development, issue resolution, etc.
  - Webpack contains functionality that we need either itself or through its ecosystem of loaders and plugins.
  - Maintainable due to the fact that there is minimal code and it is well tested.
  - Updateable via webpack's ecosystem and local webpack conf overrides.
- No gulp. Why?
    - It's just a task runner; we want to keep it simple by utilizing package.json scripts.
- Development and production builds.
- Live reloading for fast prototyping and development.
- All features unit tested.

## Installation
- `npm install git+https://git.rei.com:7999/fedpack/febs.git`

## Usage

### Assumptions

For now, FEBS assumes the following:
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

[x] Unit tests of client code.

[ ] Code coverage of client code.

[ ] HTML snippet generation

[ ] Asset CDN integration
