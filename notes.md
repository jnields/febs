## Development Notes:

- resolve default conf file when client is not overriding anything.  use a function for entry/output.

- Why are promises not being polyfilled by babel-preset-env.

- webpack.overides.conf.js.
  - Allow overriding of entry.
  - Don't allow overriding output as this is automatically handled in dev/prod.
  - Note: this contradicts creating library where we must override output. We just need
    to add additional entries to the output property.

- Options for creating shared libraries:
  - Use the libraryTarget/library in output entry.
  - Require the common module and use the
    common chunk plugin to put it in vendor bundle.
  - Inject common via febs using cb pattern in the entry module.

- Live reloading
  - Currently, the CLI seems to be more reliable than the API. API not refreshing the page. Investigate. API is preferrable since we can programmatically create the conf needed instead of pulling it from the file system.
  - Solution here: https://stackoverflow.com/questions/43747636/live-reloading-in-webpack-dev-server-when-using-node-js-api
  - ~~Need a way of overriding index.html to add additional assets.~~
  - Must contain an output entry.

- CSS/LESS
  - How is this going to be built? Required in the js module seems to be the pattern in webpack.

- Sourcemaps
  - external (more expensive) sourcemaps seem to be much better than the eval'd sourcemaps. Eval'd sourcemaps jump around when clicking on the source. There are documented issues with sourcemaps in webpack currently.

- Cleanup of dest directory between builds.
