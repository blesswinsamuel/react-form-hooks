const webpack = require('webpack');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development'

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(ENV)
  })
];

const config = {
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    }
  },
  entry: './src/index.js',
  devtool: ENV === 'development' ? 'cheap-module-source-map' : 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    library: 'reactForm',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: ENV === 'development'
          }
        }],
      }
    ]
  },
  plugins
};

module.exports = config;