[![Build Status](https://travis-ci.org/rei/febs.svg?branch=master)](https://travis-ci.org/rei/febs)

# FEBS

## Summary

`FEBS` is an extensible [Webpack](https://Webpack.js.org/)-based [front-end build
system](https://engineering.rei.com/frontend/the-rei-front-end-build-system.html) designed to be used by a community of front-end developers or a series of
projects using a similar set of technologies.

Its code falls into two categories

### [Build Features](#build-features)

[JavaScript](#javascript) / [Style](#style), [Source Maps](#source-maps), [Live reloading](#live-reloading),
[Code Watching](#code-watching), [Linting](#linting), etc.

### [FEBS core](#febs-core)

- [Command-line interface](#command-line-interface)
- [Development and production builds](#production-and-development-builds)
- Produces a [Build Manifest](#build-manifest) so you can insert assets on your page using an [Asset Injector](#asset-injector)

Learn more about [REI's Front-End Build System ](https://engineering.rei.com/frontend/the-rei-front-end-build-system.html)
by checking out the introductory post on the
[REI Co-op Engineering blog](https://engineering.rei.com)

## Getting Started

### Install

#### Install the dependency

`npm install --save @rei/febs`

#### Assign build tasks

FEBS exposes an executable to be used within the scripts of your package.json

    "scripts": {
      "build": "NODE_ENV=prod febs prod",
      "dev": "NODE_ENV=dev febs dev --no-dev-server",
      "live-reload": "NODE_ENV=dev febs dev"
      "watch": "NODE_ENV=dev febs dev --no-dev-server --watch"
    }

There is [some work](#23) to remove the requirement on `NODE_ENV` and give full
respect to the second argument.

#### Add code to the [default](#defaults) paths for css and js and [run](#run)

### Run

`npm run build` - Uses the [Production build task](#production-build-task)

`npm run dev` - Uses the [Development build task](#development-build-task)

`npm run live-reload` - Uses the [Live reloading](#live-reloading) feature

`npm run watch` - Uses the [Code watching](#live-reloading) feature

## Defaults

By default, `febs` is configured for following entry points:
  - JavaScript: `/src/js/entry.js`
  - Style: `/src/style/entry.css`
  - Bundles written to: `/dist/<package name>/`.

You can find out all of the Webpack defaults by reviewing the base
[Webpack configuration file](Webpack-config/Webpack.base.conf.js).

## Build Features

### JavaScript
  - [Vue](https://vuejs.org/)
  - [Riot](http://riotjs.com/) - [depreciated](#depreciation)

@TODO: additional detail

### Style
  - [Less](http://lesscss.org/) - [depreciated](#depreciation)
  - PostCSS

@TODO: additional detail

### Source Maps
@TODO: additional detail

### Linting
Linting is provided via [eslint](https://eslint.org/)

@TODO: additional detail

### Code watching
@TODO: additional detail

### Live reloading
@TODO: additional detail
  - [Sass/SCSS](https://sass-lang.com/)
  - [PostCSS](https://github.com/postcss)

## FEBS Core
@TODO: additional detail

### Production and Development Builds

#### Production Build Task
@TODO: additional detail

#### Development Build Task
@TODO: additional detail

### Build Manifest

A manifest.json is built to `./dist/manifest.json` this is a mechnism to be used
by an asset injector to insert assets onto a page

@TODO: Additional detail

### Asset Injector

An asset injector uses a [manifest.json](#build-manifest) to insert production
assets into the markup of a webpage.

See our example javascript implementation of the an asset injector. One could
create one for to be used by Thymleaf, Freemarker, JSP Tags, Vue, React,
Mustache, Handlebars, etc.

@TODO: publish javascript implementation and asset pipeline architectual
diagrams and relate to an "asset pipeline".

### Overrides

FEBS uses `Webpack` to build and is providing a default Webpack configuration. We provide a mechanism for you to customize your build simply by creating a `Webpack.overrides.conf.js` at the root of your npm package. Anything that Webpack understands is fair game for the overrides file. Want to add a loader or a plugin?

    // Webpack.overrides.conf.js
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

## Release management

We strictly use [semver](https://semver.org/).

The main thing to call out here is that if maintainers (intentionally) introduce
an incompatible Webpack configuration change, the major version is bumped. When
the project moves from Webpack 3 to 4, the major version is bumped.

If the project unintentionally introduces a new bug through a change through
febs core OR build features, there will be a prompt fix. Additionally we will
continue to improve our unit and functional testing strategies and bug
response times.

Somewhat related, the intention is to move the Webpack configuration to a separate
repository and having that configurable. At that point we can have more fine
grained release management and flexibility as well as let people who are
not using the same technology to have some control over their configuration.

## Depreciation

When something gets depreciated, it will not be supported in the next major
release but will continue to get [supported](#support) for the previous version.

## Support

The project focus is around FEBS core. For [Build Features](#build-features)
we look at this as community of practice effort, this is one of the main ideas.
However, a maintainer should be a major contributors to features.

For our internal customers, just think think of FEBS as just a base Webpack
config that you can edit that happens to be in a different repository

Maintainers support one major version behind and attempt to minimize and group
up major version releases to reduce upgrade/support burden.

### External open source customers

We will respond to github issues within a week for issues with FEBS core.
Unfortunately, there are no guarantees for "good" support due to bandwidth.
However, we are happy to collaborate and work together on pull requests. You are
very much welcome and encouraged to fork this project and see where it goes.

Also, we'd love to hear from you if you think we are approaching the problem
from the wrong direction or if there are better solutions out there that
reduce code / effort duplication for a community of front-end developers or
a series of projects using the same technologies.

### Internal open source customers

We fully support our internal customers. That means we will respond to slack
messages and help troubleshoot issues, feature requests, etc.

Feel free to swing by or hit us up on slack or just file a bug here :)

