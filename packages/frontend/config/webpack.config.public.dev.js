/*
 * Copyright (C) 2017  Firespring
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const path = require('path');
const webpack = require('webpack');
const BrowserSyncSpa = require('browser-sync-middleware-spa');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackOnBuildPlugin = require('on-build-webpack');
const FetchDynamicContent = require('./../bin/fetch-dynamic-content');

module.exports = {
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loader: 'file-loader?name=assets/img/[name].[ext]'
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
		]
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		}
	},
	target: 'web',
	entry: [
		'./src/public-pages/app.js'
	],
	output: {
		path: path.resolve(__dirname, './../build/public-pages'),
		filename: 'bundle.js',
		publicPath: '/',
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		}),
		new CopyWebpackPlugin([
			{from: './config/**/*.json', to: '[name].[ext]'},
			{from: './src/public-pages/assets/css', to: 'assets/css'},
			{from: './src/public-pages/assets/img', to: 'assets/img'},
			{from: './src/public-pages/assets/temp', to: 'assets/temp'}
		], {
			ignore: [
				'deploy-info.json'
			]
		}),
		new HtmlWebpackPlugin({
			template: 'src/public-pages/templates/index.mustache',
			filename: 'templates/index.mustache'
		}),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 3002,
			server: {
				baseDir: './../frontend/build/public-pages',
				index: 'index.html',
				middleware: [
					BrowserSyncSpa(/^[^\.]+$/, __dirname + '/../build/public-pages/index.html')
				]
			},
			files: ['bundle.js', 'assets/**/*.css', 'settings.json'],
			open: false
		}),
		new WebpackOnBuildPlugin(FetchDynamicContent.fetch),
	]
};