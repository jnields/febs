/**
 * webpack-dev-server module.
 *
 * Starts the dev-server at localhost:8080.
 *
 */
const expressThymeleaf = require('express-thymeleaf');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const request = require('request');

/**
 * Run the webpack-dev-server.
 *
 * @param {Object} compiler Webpack instance configured with a webpack.conf.js
 */
const runDevServer = (compiler, WDS) => {
  const port = 8080;
  const projectPath = process.cwd();
  const server = new WDS(compiler, {
    port,
    stats: {
      colors: true,
      detailed: true,
    },
    contentBase: projectPath,
    publicPath: '/dist/',
    compress: true,
    clientLogLevel: 'info',

    // These options *should* open a new browser but apparently aren't supported
    // in the node api.
    open: true,
    openPage: '',
  });

  const app = server.app;

  const {
    TemplateEngine,
    STANDARD_CONFIGURATION,
  } = require('thymeleaf');

  const templateEngine = new TemplateEngine(STANDARD_CONFIGURATION);

  app.engine('html', expressThymeleaf(templateEngine));

  app.set('views', path.resolve(`${projectPath}/../resources/templates`));

  app.set('view engine', 'html');

  app.get('/favicon.ico', (req, res) => res.send());

  app.get(/^\/satchel\/(.*)/, (req, res) => {
    // modify the url in any way you want
    const newUrl = `https://satchel.rei.com/${req.params[0]}`;
    request(newUrl).pipe(res);
  });

  app.get('/pages/:page', (req, res) => {
    let dataPath;
    let pageData = {};

    try {
      dataPath = path.resolve('./test-data', req.query.file || `${req.params.page}.json`);
      pageData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (e) {
      logger.error('no test-data found for page', dataPath, e);
    }

    res.render(
      `${req.params.page}.html`,
      {
        pageData: JSON.stringify(Object.assign(
          { url: req.url },
          pageData
        )),
        staticEnv: true,
      }
    );
  });


  server.listen(port, '127.0.0.1', () => {
    logger.info(`Starting server on http://localhost:${port}`);
  });
  return server;
};

module.exports = runDevServer;
