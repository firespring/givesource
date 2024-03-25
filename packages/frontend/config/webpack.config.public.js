/*
 * Copyright 2019 Firespring, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../../../.env` })

const path = require('path')
const webpack = require('webpack')
const BrowserSyncSpa = require('browser-sync-middleware-spa')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FetchDynamicContent = require('./../bin/fetch-dynamic-content')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

function RunOnBuild (callback) {
  this.callback = callback
}

RunOnBuild.prototype.apply = function (compiler) {
  compiler.hooks.done.tap('GDPublic', this.callback)
}

module.exports = function () {
  const env = process.env.NODE_ENV || 'development'
  const config = {
    mode: env,
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          exclude: /node_modules/,
          options: {
            loaders: {
              js: 'babel-loader'
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                insert: function insertIntoTarget (element, options) {
                  // style tags need to come before custom.css so that custom.css styles overrides
                  // custom.css is managed outside of webpack so can't be compiled into the rest of the css
                  document.head.insertBefore(element, document.getElementById('custom_css'))
                }
              }
            },
            'css-loader'
          ]
        },
        {
          test: /\.(jpe?g|png|svg|gif)$/,
          type: 'asset'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.runtime.esm-bundler.js'
      }
    },
    target: 'web',
    entry: [
      './src/public-pages/app.js'
    ],
    output: {
      path: path.resolve(__dirname, './../build/public-pages'),
      filename: 'assets/js/bundle.[contenthash].js',
      chunkFilename: '[name].[contenthash][ext]',
      assetModuleFilename: 'assets/[name].[contenthash][ext]',
      publicPath: '/'
    },
    devtool: 'hidden-source-map',
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        Promise: 'es6-promise-promise',
        'window.jQuery': 'jquery'
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: './config/settings.json', to: 'settings.json' },
          { from: './config/robots-allow.txt', to: 'robots.txt' }
        ]
      }),
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/public-pages/index.html'
      }),
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3002,
        server: {
          baseDir: './../frontend/build/public-pages',
          index: 'index.html',
          middleware: [
            BrowserSyncSpa(/^[^.]+$/, path.join(__dirname, '/../build/public-pages/index.html'))
          ]
        },
        files: ['bundle.js', 'assets/**/*.css', 'settings.json'],
        open: false
      }),
      new RunOnBuild(FetchDynamicContent.fetch)
    ]
  }
  if (env === 'production') {
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin()
      ]
    }
  }
  return config
}
