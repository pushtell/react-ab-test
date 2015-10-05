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
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.jsx?$/
      }, {
        exclude: /node_modules/,
        loader: 'regenerator-loader',
        test: /\.jsx$/
      }, {
        test: require.resolve("./LocalStorageExperiment"),
        loader: "expose?Experiment"
      }, {
        test: require.resolve("./Variant"),
        loader: "expose?Variant"
      }, {
        test: require.resolve("./emitter"),
        loader: "expose?emitter"
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
    react: 'React'
  }
};