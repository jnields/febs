/**
 * webpack-dev-server module.
 *
 * Starts the dev-server at localhost:8080.
 *
 */
/**
 * Run the webpack-dev-server.
 *
 * @param {Object} compiler Webpack instance configured with a webpack.conf.js
 */
const runDevServer = (compiler, WDS) => {
  const port = 8080;
  const cwd = process.cwd();
  const server = new WDS(compiler, {
    port,
    stats: {
      colors: true,
      detailed: true,
    },
    contentBase: cwd,
    publicPath: '/dest/',
    compress: true,
    clientLogLevel: 'info',

    // These options *should* open a new browser but apparently aren't supported
    // in the node api.
    open: true,
    openPage: '',
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(`Starting server on http://localhost:${port}`);
  });
  return server;
};

module.exports = runDevServer;
