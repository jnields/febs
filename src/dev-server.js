const WDS = require('webpack-dev-server');
const path = require('path');

/**
 * Start webpack dev server.
 */
module.exports = (compiler) => {
  const port = 8080;
  const cwd = process.cwd();
  const server = new WDS(compiler, {
    port,
    stats: {
      colors: true,
      detailed: true,
    },
    // contentBase: path.join(__dirname, '../dest'),
    // contentBase: path.join(cwd, 'dest'),
    contentBase: cwd,
    publicPath: '/dest/',
    compress: true,
    clientLogLevel: 'info',
    open: true,
    openPage: '',
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(`Starting server on http://localhost:${port}`);
  });
};
