var webpack = require("webpack");

module.exports = {
  entry: {
    index: './lib/standalone.js'
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
        test: require.resolve("./lib/LocalStorage/Expiriment"),
        loader: "expose?Expiriment"
      }, {
        test: require.resolve("./lib/Variant"),
        loader: "expose?Variant"
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