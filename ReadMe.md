[![Build Status](https://travis-ci.org/rei/febs.svg?branch=master)](https://travis-ci.org/rei/febs)

# FEBS

## Summary

`FEBS` is an extensible [Webpack](https://webpack.js.org/)-based [front-end build
system](https://engineering.rei.com/frontend/the-rei-front-end-build-system.html) designed to be used by a community of front-end developers or a series of projects using a similar set of technologies in order to reduce duplicate effort on build configuration.

It's code falls into two categories

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

FEBS exposes an executable named `febs` to be used within the scripts of your `package.json`

    "scripts": {
      "build": "NODE_ENV=prod febs prod",
      "dev": "NODE_ENV=dev febs dev --no-dev-server",
      "live-reload": "NODE_ENV=dev febs dev"
      "watch": "NODE_ENV=dev febs dev --no-dev-server --watch"
    }

There is [some work](#23) to remove the requirement on `NODE_ENV` and give full
respect to the second argument.

#### Update or use [defaults](#default-configuration) to specify paths for the css and js you want to compile and [run](#run)

### Run

`npm run build` - Uses the [Production build task](#production-build-task)

`npm run dev` - Uses the [Development build task](#development-build-task)

`npm run live-reload` - Uses the [Live reloading](#live-reloading) feature

`npm run watch` - Uses the [Code watching](#live-reloading) feature

See [Command-line Interface]() for more details and additional ways to run.

## Default Configuration

### Entry points
  - Default JavaScript entry point: `/src/js/entry.js`
  - Default Style entry point: `/src/style/entry.css`

### Output path
  - Bundles written to: `/dist/<package name>/`.

Given the above defaults, FEBS will generate two bundles at the following paths:

    ./dist/app.1234.js
    ./dist/app.1234.css

You can adjust these default configurations using the [febs configuration](#febs-configuration)

## Build Features

### JavaScript
  - [Vue](https://vuejs.org/)
  - [Riot](http://riotjs.com/) - [deprecated](#deprecation)

@TODO: additional detail

### Style
  - [Less](http://lesscss.org/) - [deprecated](#deprecation)
  - PostCSS

@TODO: additional detail

### Source Maps
@TODO: additional detail

If you'd like to further configure febs, you can look at the [Webpack overrides]()

### Linting
Linting is provided via [eslint](https://eslint.org/)

 `eslint` will run on both JavaScript and Vue components using the `.eslintrc.json` that is created on `febs init`.
This config is used by both `webpack` during a build and `eslint` at the command line so the results should be identical.

- To run eslint at the command line:  `npx eslint <file/directory/etc>`

- To fix eslint errors, `npx eslint --fix <file/directory/etc>`

- Currently, `febs init` copies over the `.eslintrc.json` file but in the future we'll likely be creating a shared eslint config used by both `wp` and the `eslint` at the command line.

- `febs` is configured to return Linux compatible exit codes in order to signal to a global build
 tool (such as maven) the success/failure of the front-end build. In the case of lint-only 
 errors, we do not return an error code 1 (error) as we don't want to fail the global build due 
 to linting errors, however, they are still reported. In the near future, this will be configurable.

### Code watching
@TODO: additional detail

### Live reloading
@TODO: additional detail
  - [Sass/SCSS](https://sass-lang.com/)
  - [PostCSS](https://github.com/postcss)

## FEBS Core

### Command-line interface
@TODO: additional detail (npx tip)

### Production and Development Builds

#### Production Build Task
@TODO: additional detail

#### Development Build Task
@TODO: additional detail


### Febs Configuration

If the default entry points / output paths don't work for you, you can override them by using a `febs-config.json` file next to your package.json that is using `febs`.

Here is an example of a entry / output configuration that might be made to use a more java like file structure.

*`febs-config.json`*

    {
      "entry": {
        "details": [
          "src/main/js/pages/details/entry.js"
        ],
        "details-reviews": [
          "src/main/js/pages/details/reviews.js"
          "src/main/js/pages/details/write-review.js"
        ]
      }
      "output": {
        "path": "./target/classes/dist"
      }
    }

####  `entry` property override

In the `febs-config.json` example above we are creating our own entry points, instead of using the [defaults](#default-configuration). We specify the path where our javascript and styles live.

#### `output` property override

In the `febs-config.json` example above we change the default output path to the java classpath where a java asset injector will be able to read for injection.

#### Example configuration output
Given the above example, FEBS will generate two bundles at the following paths:

    ./target/classes/dist/details.1234.js
    ./target/classes/dist/detail-reviews.1234.js

- `details.1234.js` will only contain Javascript contained in entry.js (including its dependencies)

- `details-reviews.1234.js` will be bundle reviews.js and write-review.js files into one bundle

#### Additional Concepts

### Overrides

FEBS uses `Webpack` to build and is providing a default Webpack configuration under the hood.

You can override or create new configurations where necissary. If you think others might need the
configuration your override or adding please file a ticket. Where you can, avoid using this feature.

To customize your build simply by creating a `Webpack.overrides.conf.js` at the root of your npm
package. Anything that Webpack understands is fair game for the overrides file. Want to add a
loader or a plugin?

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

## Additional Concepts

### Build Manifest

A manifest.json is built to `./dist/manifest.json` this is a mechanism to be used
by an asset injector to insert assets onto a page

@TODO: Additional detail

### Asset Injector

An asset injector uses a [manifest.json](#build-manifest) to insert production
assets into the markup of a webpage.

See our example Javascript implementation of the an asset injector. One could
create one for to be used by Thymleaf, Freemarker, JSP Tags, Vue, React,
Mustache, Handlebars, etc.

@TODO: publish Javascript implementation and asset pipeline architectual
diagrams and relate to an "asset pipeline".


You can find out all of the Webpack defaults by reviewing the base
[Webpack configuration file](webpack-config/webpack.base.conf.js).

### Release management

The project strictly use [semver](https://semver.org/).

The main thing to call out here is that if maintainers (intentionally) introduce
an incompatible Webpack configuration change, the major version is bumped. When
the project moves from Webpack 3 to 4, the major version is bumped.

If the project unintentionally introduces a new bug through a change through
febs core or build features, there will be a prompt fix. Additionally maintainers
will continue to improve our unit and functional testing strategies and bug
response times.

Somewhat related, the intention is to move the Webpack configuration to a separate
repository and having that configurable. At that point the project can have more fine
grained release management and flexibility as well as let people who are
not using the same technology to have some control over their base configuration.

### Deprecation

When something gets deprecated, it will not be supported in the next major
release but will continue to get [supported](#support) for the previous version.

### Support

The project focus is around FEBS core. For [Build Features](#build-features)
it should be look at as community of practice effort, this is one of the main ideas.
However, a maintainer should be a major contributors to features.

*For our internal customers:* Think of FEBS as just a base Webpack
config that you can edit that happens to be in a different repository

Maintainers support one major version behind and attempt to minimize and group
up major version releases to reduce upgrade/support burden.

#### Internal open source customers

We fully support our internal customers. That means we will respond to Slack
messages and help troubleshoot issues, feature requests, etc.

Feel free to swing by or hit us up on Slack or just file a bug here :)

#### External open source customers

Maintainers will respond to github issues within a week for issues with FEBS core.
Unfortunately, there are no guarantees for "immediate" support due to bandwidth.
However, we are happy to collaborate and work together on pull requests. You are
very much welcome and encouraged to fork this project and see where it goes.

Also, we'd love to hear your ideas and feedback on different approaches or similar solutions in the community that you think could improve FEBS.

