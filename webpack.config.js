const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CssNano = require('cssnano');
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  entry: [
    './src/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      },
      {
        test: /\.vue$/,
        loader: [
        {
            loader: 'vue-loader',
            options: {
                loaders: {
                    scss: [
                        'vue-style-loader',
                        MiniCssExtractPlugin.loader,
                        'css-loader?sourceMap',
                        'sass-loader?sourceMap'
                    ],
                    css: [
                        'vue-style-loader',
                        MiniCssExtractPlugin.loader,
                        'css-loader?sourceMap'
                    ]
                }
            }
        }
    ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    filename: '[name]-bundle.js',
    chunkFilename: '[name]-chunk.js',
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: true,
          compress: {
            drop_console: true,
            passes: 5,
            toplevel: true, // Maybe dangerous
          }
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true
        },
      }
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name].css`
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: CssNano,
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        },
        discardUnused: true
      }
    }),
    new WebpackBundleSizeAnalyzerPlugin('../../bundle-size-report.txt')
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    compress: true,
    port: 9000,
    host: "0.0.0.0",
    allowedHosts: [
      'monsquaz.org'
    ]
  }
};
