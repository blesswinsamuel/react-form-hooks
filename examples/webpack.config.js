const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {

  devtool: 'cheap-module-source-map',

  entry: ['./index.js'],

  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, use: ['react-hot-loader/webpack', 'babel-loader'] },
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
    ]
  },

  resolve: {
    alias: {
      'react-form': path.join(__dirname, '..', 'src')
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.HotModuleReplacementPlugin(), // Enables Hot Modules Replacement
    new webpack.NamedModulesPlugin(), // Prints more readable module names in the browser console on HMR updates
    new webpack.NoEmitOnErrorsPlugin(), // Allows error warnings but does not stop compiling.
  ]
};