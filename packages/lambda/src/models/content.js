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

const ContentHelper = require('./../helpers/content');
const Model = require('./model');

/**
 * Content constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function Content(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {Model}
 */
Content.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
Content.prototype.attributes = [
	'key',
	'parentUuid',
	'sortOrder',
	'type',
	'value'
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
Content.prototype.constraints = {
	key: {
		presence: true,
		type: 'string',
	},
	parentUuid: {
		presence: false,
		uuid: 4,
	},
	sortOrder: {
		presence: true,
		type: 'number',
	},
	type: {
		presence: true,
		inclusion: [
			ContentHelper.TYPE_COLLECTION,
			ContentHelper.TYPE_FILE,
			ContentHelper.TYPE_LINK,
			ContentHelper.TYPE_OPTION,
			ContentHelper.TYPE_RICH_TEXT,
			ContentHelper.TYPE_TEXT
		],
	},
	value: {
		presence: false,
	},
};

/**
 * Default values for this model
 *
 * @return {{}}
 */
Content.prototype.defaults = function () {
	return {
		sortOrder: 0
	};
};

/**
 * Event fired for this model before validation
 */
Content.prototype.beforeValidate = function () {
	if (this.type === ContentHelper.TYPE_COLLECTION) {
		this.value = null;
	}
};

/**
 * Event fired for this model before saving
 */
Content.prototype.beforeSave = function () {
	if (this.type === ContentHelper.TYPE_COLLECTION) {
		this.value = null;
	}
	if (!this.parentUuid) {
		this.parentUuid = this.uuid;
	}
};

module.exports = Content;