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
const SlideHelper = require('./../helpers/slide');

/**
 * Slide constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function Slide(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {Model}
 */
Slide.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
Slide.prototype.attributes = [
	'caption',
	'embedUrl',
	'externalId',
	'filename',
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
Slide.prototype.constraints = {
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
		type: 'string'
	},
	filename: {
		presence: false,
		type: 'string'
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
		inclusion: [SlideHelper.TYPE_IMAGE, SlideHelper.TYPE_VIMEO, SlideHelper.TYPE_YOUTUBE]
	},
	url: {
		presence: true,
		url: true
	}
};

module.exports = Slide;