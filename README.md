[![Build Status](https://travis-ci.org/rei/febs.svg?branch=master)](https://travis-ci.org/rei/febs)

# FEBS

## Description

`FEBS` is an extensible, [webpack](https://webpack.js.org/)-based front-end build system with a simple, command-line interface that builds all of your front-end production and development assets. It is essentially a very thin wrapper around `webpack`.

## Features
- Command-line interface (see [Usage](#usage))
- Support for:
  - JavaScript/ECMAScript
    - ECMAScript support via 
        - [Babel](https://babeljs.io/)
        - [babel-preset-env](https://babeljs.io/docs/plugins/preset-env/)
        - [browserslist](https://www.npmjs.com/package/browserslist)
    - [Vue](https://vuejs.org/)
    - [Riot](http://riotjs.com/)
  - Style
    - [Less](http://lesscss.org/)
    - [Sass/SCSS](https://sass-lang.com/)
    - [PostCSS](https://github.com/postcss)
        - [postcss-import](https://github.com/postcss/postcss-import)
        - [autoprefixer](https://github.com/postcss/autoprefixer)

- Creates development and versioned production builds with source maps.
- Creates manifest.json and HTML fragment with build asset names for consumption in page.
- Live reloading and code-watching for fast prototyping and development.
- Runs JavaScript lint checks via [eslint](https://eslint.org/) and [Airbnb's shared eslint config](https://www.npmjs.com/package/eslint-config-airbnb).

## Installation

    npm install -g @rei/febs

### Defaults

By default, `febs` is configured for following entry points:
  - JavaScript source/components: `/src/js/entry.js`
  - Style: `/src/style/entry.less`
  - Bundles written to: `/dist/<package name>/`.

### <a name="usage"></a>Usage

#### Help

    $ febs --help

#### Start a new febs project
Requires a `package.json` file in the same directory where you run the command.
    
    febs init

#### Production Build

    NODE_ENV=prod febs prod (or febs)

#### Development Build

    NODE_ENV=dev febs dev --no-dev-server

#### Dev Server (Live reload)

    NODE_ENV=dev febs dev

#### Dev Server (watch)

    NODE_ENV=dev febs dev --no-dev-server --watch

### Overrides

`FEBS` uses `webpack` under the hood, so we provide a mechanism for you to customize your build simply by creating a local `webpack.overrides.conf.js` file. Anything that webpack understands is fair game for the overrides file. Want to add a loader or a plugin?

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

### Todo:

[ ] Vendor code splitting.

[ ] Asset CDN integration
