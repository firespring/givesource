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

const { styles } = require('@ckeditor/ckeditor5-dev-utils')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const BrowserSyncSpa = require('browser-sync-middleware-spa')
const { CKEditorTranslationsPlugin } = require('@ckeditor/ckeditor5-dev-translations')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

const transpileDependencies = [
  '@ckeditor',
  'amazon-cognito-identity-js'
]

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
          test: /\.(jpe?g|png|gif|svg)$/i,
          exclude: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'assets/img/[name].[ext]'
            }
          }]
        },
        {
          test: /\.css$/,
          exclude: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.js$/,
          exclude: new RegExp(`node_modules/(?!(${transpileDependencies.join('|')})/).*`),
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env']
              ]
            }
          }
        },
        {
          test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                injectType: 'singletonStyleTag',
                attributes: {
                  'data-cke': true
                }
              }
            },
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: styles.getPostCssConfig({
                  themeImporter: {
                    themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                  },
                  minify: true
                })
              }
            }
          ]
        },
        {
          test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
          loader: 'raw-loader'
        }
      ]
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      },
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify')
      }
    },
    target: 'web',
    entry: [
      '@babel/polyfill',
      'whatwg-fetch',
      './src/admin-pages/app.js'
    ],
    output: {
      path: path.resolve(__dirname, './../build/admin-pages'),
      filename: 'bundle.js',
      publicPath: '/'
    },
    devtool: 'hidden-source-map',
    plugins: [
      new CKEditorTranslationsPlugin({ language: 'en' }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        Promise: 'es6-promise-promise',
        'window.jQuery': 'jquery'
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './config/**/*.json',
            to: '[name][ext]',
            globOptions: {
              ignore: [
                '**/deploy-info.json'
              ]
            }
          },
          { from: './config/robots-deny.txt', to: 'robots.txt' },
          { from: './src/admin-pages/assets/css', to: 'assets/css' },
          { from: './src/admin-pages/assets/img', to: 'assets/img' }
        ]
      }),
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/admin-pages/index.html'
      }),
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        server: {
          baseDir: './../frontend/build/admin-pages',
          index: 'index.html',
          middleware: [
            BrowserSyncSpa(/^[^.]+$/, path.join(__dirname, '/../build/admin-pages/index.html'))
          ]
        },
        files: ['bundle.js', 'assets/**/*.css', 'settings.json'],
        open: false
      })
    ]
  }
  if (env === 'production') {
    config.optimization = {
      minimizer: [
        new TerserPlugin()
      ]
    }
  }
  return config
}
