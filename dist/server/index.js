/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(4);

var _express2 = _interopRequireDefault(_express);

var _helmet = __webpack_require__(5);

var _helmet2 = _interopRequireDefault(_helmet);

var _path = __webpack_require__(0);

var _path2 = _interopRequireDefault(_path);

var _compression = __webpack_require__(6);

var _compression2 = _interopRequireDefault(_compression);

var _basicAuth = __webpack_require__(7);

var _basicAuth2 = _interopRequireDefault(_basicAuth);

var _bodyParser = __webpack_require__(8);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _serveStatic = __webpack_require__(9);

var _serveStatic2 = _interopRequireDefault(_serveStatic);

__webpack_require__(10);

var _logger = __webpack_require__(11);

var _logger2 = _interopRequireDefault(_logger);

var _redirects = __webpack_require__(14);

var _redirects2 = _interopRequireDefault(_redirects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.get('/health', function (req, res) {
  res.status(200).end();
});

app.use((0, _helmet2.default)({
  hsts: false,
  noSniff: false
}));

app.use((0, _compression2.default)());

if (process.env.NODE_ENV !== 'production') {
  var username = process.env.AUTH_USER || 'prototype';
  var password = process.env.AUTH_PASS || 'prototype';
  app.use(function (req, res, next) {
    var user = (0, _basicAuth2.default)(req);
    if (user === undefined || user.name !== username || user.pass !== password) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="prototype"');
      res.end('Unauthorized');
    } else {
      next();
    }
  });
}

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if (process.env.NODE_ENV !== 'production') {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }

  next();
});

app.get('/robots.txt', function (req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    res.end();
  } else {
    next();
  }
});

app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.raw({ limit: 2 * 1024 * 1024, type: 'application/octet-stream' })); // File uploads capped to 2 MB

(0, _redirects2.default)(app);

if (process.env.NODE_ENV === 'development') {
  var webpack = __webpack_require__(2);
  var webpackDevMiddleware = __webpack_require__(15);
  var webpackHotMiddleware = __webpack_require__(16);
  var clientConfig = __webpack_require__(17).clientConfig;

  var compiler = webpack(clientConfig);

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: clientConfig.output.publicPath
  }));

  app.use(webpackHotMiddleware(compiler));

  _logger2.default.info('Running webpack dev and hot middleware!');

  app.use('*', function (req, res, next) {
    var filename = _path2.default.join(compiler.outputPath, 'index.html');

    compiler.outputFileSystem.readFile(filename, function (err, result) {
      if (err) {
        next(err);
        return;
      }

      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
} else {
  app.use((0, _serveStatic2.default)('dist/client', {
    index: ['index.html'],
    dotfiles: 'ignore',
    maxAge: process.env.NODE_ENV === 'production' ? '7d' : '0d',
    setHeaders: function setHeaders(res, path) {
      if (_serveStatic2.default.mime.lookup(path) === 'text/html') {
        res.setHeader('Cache-Control', 'public, max-age=0');
      }
    }
  }));

  app.get('*', function (req, res) {
    var filename = './dist/client/index.html';

    res.sendFile(_path2.default.resolve(filename));
  });
}

// app.get('*', (req, res) => {
//   res.status(404).end();
// });

_logger2.default.info('---------------------------');
_logger2.default.info('☕️ ');
_logger2.default.info('Starting Server');
_logger2.default.info('Environment: ' + process.env.NODE_ENV);

var preferredPort = process.env.PORT || 8080;

app.listen(preferredPort, function (error) {
  if (!error) {
    _logger2.default.info('\uD83D\uDCE1  Running on port: ' + preferredPort);
  }
});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("helmet");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("basic-auth");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("serve-static");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = __webpack_require__(12);

var _winston2 = _interopRequireDefault(_winston);

var _moment = __webpack_require__(13);

var _moment2 = _interopRequireDefault(_moment);

var _fs = __webpack_require__(1);

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var date = (0, _moment2.default)();
var timestamp = date.format('YYYY-MM-DD_hh-mm-ss');

// Create logs directory if it doesn't exist
_fs2.default.mkdir('./logs', function () {});

_winston2.default.configure({
  transports: [new _winston2.default.transports.Console({
    level: 'info',
    timestamp: true,
    colorize: true,
    humanReadableUnhandledException: true
  }), new _winston2.default.transports.File({
    filename: './logs/' + timestamp + '_log.log',
    level: 'info',
    timestamp: true,
    maxsize: 1024 * 1024 * 10, // 10 MB rolling log files
    prettyPrint: true,
    json: false
  })]
});

exports.default = {
  info: function info(message) {
    _winston2.default.log('info', message);
  },
  warn: function warn(message) {
    _winston2.default.log('warn', message);
  },
  error: function error(message) {
    _winston2.default.log('error', message);
  }
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
* Redirect rules
*/

var homepageRedirects = ['/some-unwanted-path', '/another-unwanted-path'];

exports.default = function (app) {
  app.get('*', function (req, res, next) {
    var redirectToHomepage = homepageRedirects.find(function (x) {
      return x.match(new RegExp('^' + req.path + '$'));
    });
    if (redirectToHomepage) {
      res.redirect(301, '/');
    } else {
      next();
    }
  });
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("webpack-dev-middleware");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("webpack-hot-middleware");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serverConfig = exports.clientConfig = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = __webpack_require__(0);

var _path2 = _interopRequireDefault(_path);

var _webpack = __webpack_require__(2);

var _webpack2 = _interopRequireDefault(_webpack);

var _htmlWebpackPlugin = __webpack_require__(18);

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _webpackShellPlugin = __webpack_require__(19);

var _webpackShellPlugin2 = _interopRequireDefault(_webpackShellPlugin);

var _externals = __webpack_require__(20);

var _externals2 = _interopRequireDefault(_externals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var baseConfig = {
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }]
  },
  plugins: [],
  devtool: 'source-map'
};

var clientConfig = exports.clientConfig = _extends({}, baseConfig, {
  entry: {
    client: ['react-hot-loader/patch', 'webpack-hot-middleware/client', './src/client/index.js']
  },
  output: {
    filename: 'main.[name].js',
    path: _path2.default.resolve(__dirname, 'dist/client'),
    publicPath: '/'
  },
  resolve: {
    extensions: [].concat(_toConsumableArray(baseConfig.resolve.extensions), ['.scss'])
  },
  module: _extends({}, baseConfig.module, {
    rules: [].concat(_toConsumableArray(baseConfig.module.rules), [{
      test: /\.scss$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          sourceMap: true
        }
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }]
    }, {
      test: /\.svg$/,
      use: ['babel-loader', {
        loader: 'react-svg-loader',
        options: {
          svgo: {
            plugins: [{
              removeTitle: true
            }],
            floatPrecision: 2
          }
        }
      }]
    }, {
      test: /\.(png|jpg|gif)$/,
      use: ['file-loader']
    }])
  }),
  plugins: [].concat(_toConsumableArray(baseConfig.plugins), [new _htmlWebpackPlugin2.default({
    inject: true,
    chunks: ['client'],
    template: 'src/client/index.html',
    filename: './index.html'
  }), new _webpack2.default.DefinePlugin({
    'process.env.CLIENT_ENV': JSON.stringify(process.env.NODE_ENV)
  }), new _webpack2.default.NamedModulesPlugin(), new _webpack2.default.optimize.OccurrenceOrderPlugin(), new _webpack2.default.HotModuleReplacementPlugin(), new _webpack2.default.NoEmitOnErrorsPlugin()]),
  devServer: {
    contentBase: './dist',
    hot: true
  },
  externals: {
    jquery: 'jQuery'
  }
});

var serverConfig = exports.serverConfig = function serverConfig(env) {
  var plugins = [].concat(_toConsumableArray(baseConfig.plugins));

  if (env && env.dev) {
    plugins.push(new _webpackShellPlugin2.default({
      onBuildEnd: ['cross-env NODE_ENV=development DEBUG=api nodemon ./dist/server/index.js'],
      dev: true
    }));
  }

  return _extends({}, baseConfig, {
    entry: './src/server/index.js',
    target: 'node',
    output: {
      filename: 'index.js',
      path: _path2.default.resolve(__dirname, 'dist/server'),
      publicPath: '/'
    },
    module: _extends({}, baseConfig.module, {
      rules: [].concat(_toConsumableArray(baseConfig.module.rules))
    }),
    plugins: plugins,
    externals: _externals2.default
  });
};

exports.default = [clientConfig, serverConfig];
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("html-webpack-plugin");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("webpack-shell-plugin");

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = __webpack_require__(1);

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var externals = {}; /**
                     * Allows backend to be transpiled without packing modules from node_modules.
                     */

_fs2.default.readdirSync('node_modules').filter(function (x) {
  return ['.bin'].indexOf(x) === -1;
}).forEach(function (mod) {
  externals[mod] = 'commonjs ' + mod;
});

exports.default = externals;

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map