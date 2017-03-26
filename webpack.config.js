const webpack = require('webpack');
const path = require('path');

const env = process.env.NODE_ENV

const __DEV__ = env === 'development'
const __PROD__ = env === 'production'
const __TEST__ = env === 'test'

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env)
  })
];

if (__PROD__) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  )
}

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
  devtool: __DEV__ ? 'cheap-module-source-map' : 'source-map',
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
            cacheDirectory: __DEV__
          }
        }],
      }
    ]
  },
  plugins
};

module.exports = config;