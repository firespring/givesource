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
 *@type {model}
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