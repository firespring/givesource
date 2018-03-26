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

const Model = require('./model');
const NonprofitSlideHelper = require('../helpers/nonprofitSlide');

/**
 * NonprofitSlide constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function NonprofitSlide(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {Model}
 */
NonprofitSlide.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
NonprofitSlide.prototype.attributes = [
	'caption',
	'embedUrl',
	'externalId',
	'fileUuid',
	'nonprofitUuid',
	'sortOrder',
	'thumbnail',
	'type',
	'url'
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
NonprofitSlide.prototype.constraints = {
	caption: {
		presence: false,
		type: 'string',
		length: {
			maximum: 100
		},
	},
	embedUrl: {
		presence: false,
		url: true,
	},
	externalId: {
		presence: false,
		type: 'string|number'
	},
	fileUuid: {
		presence: false,
		uuid: 4
	},
	nonprofitUuid: {
		presence: true,
		uuid: 4
	},
	sortOrder: {
		presence: true,
		type: 'number'
	},
	thumbnail: {
		presence: false,
		url: true,
	},
	type: {
		presence: true,
		inclusion: [NonprofitSlideHelper.TYPE_IMAGE, NonprofitSlideHelper.TYPE_VIMEO, NonprofitSlideHelper.TYPE_YOUTUBE]
	},
	url: {
		presence: false,
		url: true
	}
};

module.exports = NonprofitSlide;