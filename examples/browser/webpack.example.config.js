var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    index: path.resolve(__dirname, './app.jsx')
  },
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ["stage-1", "es2015", "react"]
        }
      }, {
        exclude: /node_modules/,
        loader: 'regenerator-loader',
        test: /\.jsx$/
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
  devtool: 'inline-source-map'
};