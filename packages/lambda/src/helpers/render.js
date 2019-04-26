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

const mustache = require('mustache');

/**
 * Load and render the provided template
 *
 * @param {String} template
 * @param {Object} data
 * @returns {Promise}
 */
const renderTemplate = function (template, data) {
	return new Promise(function (resolve, reject) {
		let templatePath = template.replace(/\s/g, '').replace('.mustache', '').split('.').join('/');

		try {
			const content = require('./../templates/' + templatePath + '.mustache');
			const rendered = mustache.render(content, data);
			resolve(rendered);
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Render the provided template
 *
 * @param {String} template
 * @param {Object} data
 * @returns {Promise}
 */
const renderStringTemplate = function (template, data) {
	return new Promise(function (resolve, reject) {
		try {
			const rendered = mustache.render(template, data);
			resolve(rendered);
		} catch (err) {
			reject(err);
		}
	});
};

export {
	renderTemplate,
	renderStringTemplate
}