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

const Model = require('./model');
const SponsorHelper = require('./../helpers/sponsor');

/**
 * SponsorTier constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function SponsorTier(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {model}
 */
SponsorTier.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
SponsorTier.prototype.attributes = [
	'name',
	'size',
	'sortOrder',
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
SponsorTier.prototype.constraints = {
	name: {
		presence: true,
		type: 'string'
	},
	size: {
		presence: true,
		type: 'string',
		inclusion: [SponsorHelper.SIZE_LARGE, SponsorHelper.SIZE_DEFAULT, SponsorHelper.SIZE_SMALL]
	},
	sortOrder: {
		presence: true,
		type: 'number'
	},
};

module.exports = SponsorTier;