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
};

module.exports = Content;