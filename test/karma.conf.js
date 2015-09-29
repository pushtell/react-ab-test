module.exports = function (karma) {
  var options = {
    files: [
      'tests.bundle.js'
    ],
    frameworks: ['mocha'],
    plugins: [
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-browserstack-launcher'
    ],
    preprocessors: {
      'tests.bundle.js': [ 'webpack', 'sourcemap' ]
    },
    customLaunchers: {
      bs_windows_7_ie_9: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '7',
        browser: 'ie',
        browser_version : '9.0'
      },
      bs_windows_7_ie_10: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '7',
        browser: 'ie',
        browser_version : '10.0'
      },
      bs_windows_7_ie_11: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '7',
        browser: 'ie',
        browser_version : '11.0'
      },
      bs_windows_7_opera_latest: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '7',
        browser: 'opera',
        browser_version : 'latest'
      },
      bs_windows_7_firefox_latest: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '7',
        browser: 'firefox',
        browser_version : 'latest'
      },
      bs_osx_yosemite_safari: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: 'Yosemite',
        browser: 'safari',
        browser_version : 'latest'
      }
    },
    reporters: ['dots'],
    singleRun: true,
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            exclude: /node_modules/,
            loader: 'babel-loader',
            test: /\.jsx?$/
          }, {
            exclude: /node_modules/,
            loader: 'regenerator-loader',
            test: /\.jsx$/
          }
        ],
      }
    },
    webpackMiddleware: {
      noInfo: true,
    }
  };
  if(process.env.BROWSERSTACK_USERNAME && process.env.BROWSERSTACK_ACCESS_KEY) {
    options.browserStack = {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY
    };
    options.browsers = Object.keys(options.customLaunchers);
  } else {
    options.browsers = ['Chrome'];
  }
  karma.set(options);
};