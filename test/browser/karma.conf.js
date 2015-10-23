var path = require("path");

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
      'karma-coveralls',
      'karma-coverage',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-browserstack-launcher'
    ],
    preprocessors: {
      'tests.bundle.js': ['webpack', 'sourcemap']
    },
    customLaunchers: {
      Chrome_without_localstorage: {
        base: 'Chrome',
        flags: ['--disable-local-storage']
      },
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
      bs_windows_7_chrome_latest: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '7',
        browser: 'chrome',
        browser_version : 'latest'
      },
      bs_osx_yosemite_safari: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: 'Yosemite',
        browser: 'safari',
        browser_version : 'latest'
      },
      bs_android_4_default: {
        base: 'BrowserStack',
        os_version: "4.1",
        device: "Google Nexus 7",
        browser_version: null,
        os: "android",
        browser: "android"
      },
      bs_ios_8_default: {
        base: 'BrowserStack',
        os_version: "8.3",
        device: "iPhone 6",
        browser_version: null,
        os: "ios",
        browser: "iphone"
      }
    },
    reporters: ['dots', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    singleRun: true,
    webpack: {
      resolve: {
        extensions: ['', '.js', '.jsx']
      },
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            exclude: /(node_modules|lib|example)/,
            loader: 'babel-loader',
            test: /\.jsx?$/
          }, {
            exclude: /(node_modules|lib|example)/,
            loader: 'regenerator-loader',
            test: /\.jsx?$/
          }, {
            include: path.resolve('src'),
            loader: 'isparta',
            test: /\.jsx?$/
          }
        ]
      }
    },
    webpackMiddleware: {
      noInfo: true,
    }
  };
  if(process.env.BROWSERSTACK_USERNAME && process.env.BROWSERSTACK_ACCESS_KEY) {
    options.browserStack = {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
      pollingTimeout: 10000
    };
    options.browsers = Object.keys(options.customLaunchers).filter(function(key){
      return key.indexOf("bs_") !== -1;
    });
  } else {
    options.browsers = ['Chrome'];
  }
  if(process.env.COVERALLS_REPO_TOKEN) {
    options.reporters.push('coveralls');
  }
  karma.set(options);
};