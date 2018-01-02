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