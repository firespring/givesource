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
 * NonprofitDonationTier constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function NonprofitDonationTier(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {Model}
 */
NonprofitDonationTier.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
NonprofitDonationTier.prototype.attributes = [
	'amount',
	'description',
	'nonprofitUuid',
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
NonprofitDonationTier.prototype.constraints = {
	amount: {
		presence: true,
		type: 'number',
		numericality: {
			onlyInteger: true,
			greaterThanOrEqualTo: 1000,
		}
	},
	description: {
		presence: false,
		type: 'string'
	},
	nonprofitUuid: {
		presence: true,
		uuid: 4
	},
};

module.exports = NonprofitDonationTier;