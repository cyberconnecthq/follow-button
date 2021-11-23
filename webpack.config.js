var webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
var path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, ''),
    filename: 'connect.min.js',
  },
  mode: 'production',
  // plugins: [new webpack.optimize.UglifyJsPlugin({ minimize: true })],
};
