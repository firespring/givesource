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

const Model = require('./model');

/**
 * PageContent constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function PageContent(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {model}
 */
PageContent.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
PageContent.prototype.attributes = [
	'content',
	'key',
	'pageSlug',
	'sortOrder',
	'type',
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
PageContent.prototype.constraints = {
	content: {
		presence: true,
		type: 'string'
	},
	key: {
		presence: true,
		type: 'string',
	},
	pageSlug: {
		presence: true,
		type: 'string'
	},
	sortOrder: {
		presence: true,
		type: 'number'
	},
	type: {
		presence: true,
		type: 'string'
	}
};

module.exports = PageContent;