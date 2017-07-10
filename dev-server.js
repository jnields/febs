/**
 * Start webpack dev server.
 *
 * Merge overrides and dev confs.
 * Fire it up.
 */
const devServer = (conf) => {
  const WDS = require('webpack-dev-server');
  const compiler = createCompiler(conf);

  // Go.
  const port = 9000;
  const server = new WDS(compiler, {
    port,
    stats: {
      colors: true,
      detailed: true,
    },
    contentBase: path.join(__dirname, '../dest'),
    publicPath: '/dest/',
    compress: true,
    clientLogLevel: 'info',
    open: true,
  });
  server.listen(9000, '127.0.0.1', () => {
    console.log(`Starting server on http://localhost:${port}`);
  });
};