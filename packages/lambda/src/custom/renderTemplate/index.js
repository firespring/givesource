/*
 * Copyright (C) 2018  Firespring
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

const mustache = require('mustache');
const Request = require('./../../aws/request');

exports.handle = function (event, context, callback) {
	const request = new Request(event, context).parameters(['template', 'data']);

	request.validate().then(function () {
		return render(request.get('template'), request.get('data', {}));
	}).then(function (rendered) {
		callback(null, rendered);
	}).catch(function (err) {
		console.log('error: %j', err);
		callback(err);
	})
};

/**
 * Find and render the template
 *
 * @param {String} template
 * @param {{}} data
 * @return {Promise}
 */
const render = function (template, data) {
	return new Promise(function (resolve, reject) {
		let templatePath = template.replace(/\s/g, '').replace('.mustache', '').split('.').join('/');

		try {
			const content = require('./../../templates/' + templatePath + '.mustache');
			const rendered = mustache.render(content, data);
			resolve(rendered);
		} catch (err) {
			reject(err);
		}
	});
};