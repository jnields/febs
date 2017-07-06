# FEBS

## Description

- Next-gen, webpack-based prototype build system.

- Work in progress and will change as we communicate with teams to determine requirements.

- The driving philosophy is minimal code, delegating essentially all build tasks through to webpack.

## Goals
- Simple, minimal, reliable, maintainable.
- Re-usable across all REI microsites.
- Unit tested
- npm-based scripts, no gulp
- Overridable defaults

## Current state

Current Capabilities:
- Builds JS, ES-next.
- Builds LESS
- Builds Riot components
- Development build
- Live reloading

## Features:
- All build tasks are run through webpack. Why?
  - Take advantage of the large community that currently rallies around webpack: new development, issue resolution, etc.
  - Webpack contains functionality that we need and loader/plugin system to support the future.
  - Maintainable due to the fact that we have minimal code to maintain.
  - Updateable via webpack's ecosystem and local webpack conf overrides.
- No gulp. Why?
    - It's just a task runner; we want to keep it simple by utilizing package.json scripts.
- Development and production modes.
- All features unit tested.

## Installation
- `npm install`

## Usage

```
  // Run production build
  $ febs build

  // Run development build
  $ febs build dev

  // Run unit tests
  $ febs test
```

## To run unit tests:
`npm test`

Todo:

[x] Development build (ES, LESS)

[x] Riot

[ ] Production build (asset versioning, minification)

[x] Live reloading

[ ] Vendor code splitting.

[ ] Unit tests, code coverage of client code.

[ ] Stat reporting/publishing.