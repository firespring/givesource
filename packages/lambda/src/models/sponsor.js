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

/**
 * Sponsor constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function Sponsor(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {model}
 */
Sponsor.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
Sponsor.prototype.attributes = [
	'fileUuid',
	'name',
	'sortOrder',
	'sponsorTierUuid',
	'url',
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
Sponsor.prototype.constraints = {
	fileUuid: {
		presence: false,
		uuid: 4
	},
	logoUrl: {
		presence: false,
		type: 'string'
	},
	name: {
		presence: true,
		type: 'string'
	},
	sortOrder: {
		presence: true,
		type: 'number'
	},
	sponsorTierUuid: {
		presence: true,
		uuid: 4
	},
	url: {
		presence: false,
		url: true,
	},
};

module.exports = Sponsor;