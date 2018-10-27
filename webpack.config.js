const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Require  html-webpack-plugin plugin
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
  {
    entry: './src/app/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/', // public URL of the output directory when referenced in a browser
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /mapbox-gl/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
        },
      }],
    },
    plugins: [ // Array of plugins to apply to build chunk
      new HtmlWebpackPlugin({
        template: `${__dirname}/src/public/index.html`,
        inject: 'body',
      }),
      new CopyWebpackPlugin([{
        from: `${__dirname}/src/public/assets`,
        to: 'assets',
      }]),
    ],
    devServer: { // configuration for webpack-dev-server
      contentBase: './src/public', // source of static assets
      port: 7700, // port to run dev-server
    },
  },
  {
    entry: './src/style/app.scss',
    output: {
      // This is necessary for webpack to compile
      // But we never use style-bundle.js
      path: path.resolve(__dirname, 'dist'),
      filename: 'style-bundle.js',
    },
    module: {
      rules: [{
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'bundle.css',
            },
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['./node_modules'],
            },
          },
        ],
      }],
    },
  },
];
