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