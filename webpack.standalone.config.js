var webpack = require("webpack");

module.exports = {
  entry: {
    index: './index.js'
  },
  output: {
    path: './',
    filename: 'standalone.min.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ["stage-1", "es2015", "react"],
          plugins: ["add-module-exports"]
        }
      }, {
        exclude: /node_modules/,
        loader: 'regenerator-loader',
        test: /\.jsx$/
      }, {
        test: require.resolve("./lib/Experiment"),
        loader: "expose?Experiment"
      }, {
        test: require.resolve("./lib/Variant"),
        loader: "expose?Variant"
      }, {
        test: require.resolve("./lib/emitter"),
        loader: "expose?emitter"
      }, {
        test: require.resolve("./lib/debugger"),
        loader: "expose?experimentDebugger"
      }, {
        test: require.resolve("./lib/helpers/mixpanel"),
        loader: "expose?mixpanelHelper"
      }, {
        test: require.resolve("./lib/helpers/segment"),
        loader: "expose?segmentHelper"
      }
    ],
    postLoaders: [
      {
        loader: "transform?envify"
      }
    ],
    plugins: [
      new webpack.optimize.UglifyJsPlugin()
    ]
  },
  externals: {
    react: 'React',
    'react-dom': "ReactDOM"
  }
};