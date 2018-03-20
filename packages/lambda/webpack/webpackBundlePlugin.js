/*
 * Copyright 2018 Firespring, Inc.
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

const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

/**
 * Custom Webpack plugin to create a lambda-ready archive
 *
 * @param {{}} [options]
 * @constructor
 */
function WebpackLambdaArchivePlugin(options) {
	options = options || {};
	this.options = options;
}

/**
 * Webpack plugin hook
 *
 * @param compiler
 */
WebpackLambdaArchivePlugin.prototype.apply = function (compiler) {
	const options = this.options;

	compiler.plugin('after-emit', function (compilation, callback) {
		const outputPath = compilation.options.output.path;

		compilation.chunks.forEach(function (chunk) {
			const stream = archiver('zip', {zlib: {level: 9}});
			const output = options.output ? options.output : outputPath;

			const archive = fs.createWriteStream(path.resolve(output, `${chunk.name}.zip`));
			stream.pipe(archive);

			chunk.files.forEach(function (file) {
				const filepath = path.resolve(outputPath, file);
				let filename = file;
				if (options.assetName && typeof options.assetName === 'function') {
					filename = options.assetName(file);
				}
				stream.append(fs.createReadStream(filepath), {name: filename});
			});

			stream.finalize();
		});

		callback();
	});
};

module.exports = WebpackLambdaArchivePlugin;