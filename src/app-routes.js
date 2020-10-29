/**
 * Sets up the application routes and connects them to their
 * handlers and views. It is imported into server.js
 * @module app-routes
 * @version 2.0.0
 * @see module:timestamp
 * @see module:header-parser
 * @see module:file-analyzer
 * @see module:url-shortener
 * @see module:image-abstract
 * @param {object} activeApp - ExpressJS object instance
 * @param {object} expressModule - ExpressJS module
 * @param {object} mongoDatabase - MongoDB database
 */
const setupRoutes = (activeApp, expressModule, mongoDatabase) => {
  const path = require('path');

  // Prodution and development specific settings
  const appEnv = activeApp.get('env');
  const curDir = process.cwd();
  let tgtPath = null;

  if (appEnv === 'production') {
    tgtPath = curDir + '/dist';
    activeApp.set('views', './dist/views');
  }
  else {
    tgtPath = curDir + '/src';
    activeApp.set('views', './src/views');
  }

  activeApp.set('view engine', 'pug');
  activeApp.use(expressModule.static(path.resolve(__dirname, 'views')));
  activeApp.use('/static', expressModule.static(path.resolve(__dirname, 'views/static_files')));

  const rTimestamp = expressModule.Router();
  const cbTimestamp = require(tgtPath + '/controllers/timestamp');
  rTimestamp.get('/timestamp/api/v1/:data', cbTimestamp);

  const rHeaderParser = expressModule.Router();
  const cbHeaderParser = require(tgtPath + '/controllers/header-parser');
  rHeaderParser.get('/header-parser/api/v1/whoami', cbHeaderParser);

  const rFileAnalyzer = expressModule.Router();
  const cbFileAnalyzer = require(tgtPath + '/controllers/file-analyzer');
  rFileAnalyzer.post('/file-analyzer/api/v1/findsize', cbFileAnalyzer.postData);

  const rUrlShortener = expressModule.Router();
  const cbUrlShortener = require(tgtPath + '/controllers/url-shortener');
  cbUrlShortener.readCollection(mongoDatabase);
  rUrlShortener.get('/url-shortener/api/v1/new/*', cbUrlShortener.processUrl);
  rUrlShortener.get('/url-shortener/:data', cbUrlShortener.accessLink);

  const rImageAbstract = expressModule.Router();
  const cbImageAbstract = require(tgtPath + '/controllers/image-abstract');
  cbImageAbstract.readCollection(mongoDatabase);
  rImageAbstract.get('/image-abstract/api/v1/entry/*', cbImageAbstract.getSearchResults);
  rImageAbstract.get('/image-abstract/api/v1/history', cbImageAbstract.getRecentHistory);

  activeApp.use(rTimestamp, rHeaderParser, rFileAnalyzer, rUrlShortener, rImageAbstract);

  activeApp.get('/', (req, res) => {
    res.render('index.pug', { content: 'landing', appEnv: appEnv });
  });

  activeApp.get('/timestamp/api/v1', function (req, res) {
    res.render('index.pug', { content: 'timestamp', appEnv: appEnv });
  });

  activeApp.get('/header-parser/api/v1', function (req, res) {
    res.render('index.pug', { content: 'header-parser', appEnv: appEnv });
  });

  activeApp.get('/file-analyzer', function (req, res) {
    res.render('index.pug', { content: 'file-analyzer', appEnv: appEnv });
  });

  activeApp.get('/url-shortener/api/v1', function (req, res) {
    res.render('index.pug', { content: 'url-shortener', appEnv: appEnv });
  });

  activeApp.get('/image-abstract/api/v1', function (req, res) {
    res.render('index.pug', { content: 'image-abstract', appEnv: appEnv });
  });
}

module.exports.setup = setupRoutes;