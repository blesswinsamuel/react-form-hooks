const { PORT = 3000 } = process.env;

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('./webpack.config');

config.entry.unshift(
  'react-hot-loader/patch',
  `webpack-dev-server/client?http://localhost:${PORT}`,
  'webpack/hot/only-dev-server'
);

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
  // webpack-dev-server options
  publicPath: config.output.publicPath,
  hot: true,

  // webpack-dev-middleware options
  watchOptions: {
    ignored: /node_modules/
  },

  overlay: {
    errors: true,
    warnings: true
  },

  stats: {
    colors: true
  },
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌎  Started dev server: http://localhost:${PORT}`);
});
