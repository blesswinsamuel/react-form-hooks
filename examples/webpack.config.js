const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const ENV = process.env.NODE_ENV || 'development'
const { PORT = 3000 } = process.env;

module.exports = {
  mode: ENV,

  devtool: 'cheap-module-source-map',

  entry: ['./index.js'],

  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
    ]
  },

  resolve: {
    alias: {
      'react-form': path.join(__dirname, '..', 'src')
    }
  },

  devServer: {
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    port: PORT,

    stats: 'minimal',
    clientLogLevel: 'warning'
  },

  optimization: {
    namedModules: true, // NamedModulesPlugin()
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
  ]
};