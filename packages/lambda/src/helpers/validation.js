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

const validate = require('validate.js');
const validateUuid = require('uuid-validate');
const InvalidInputException = require('../exceptions/invalidInput');

exports.loadCustom = function () {

	validate.validators.type = function (value, options, key, attributes) {
		let isValid = false;
		let types = (typeof options === 'string' && options.length > 0) ? options.split('|') : [];

		if (!value || value === false || typeof value === 'undefined' || value === null) {
			return null;
		}

		for (let i in types) {
			let type = types[i].toLowerCase();
			switch (type) {
				case 'array':
					if (value instanceof Array) {
						isValid = true;
					}
					break;

				case 'boolean':
				case 'function':
				case 'number':
				case 'object':
				case 'string':
				case 'symbol':
				case 'undefined':
				default:
					if (typeof value === type) {
						isValid = true;
					}
					break;
			}
		}

		if (!isValid) {
			let message = types.join(', ');
			throw new InvalidInputException(`${key} is not one of the expected types: ${message}`);
		}

		return null;
	};

	validate.validators.uuid = function (value, options, key, attributes) {
		let isValid = false;

		if (!value || value === false || typeof value === 'undefined' || value === null) {
			return null;
		}

		if (options && typeof options === 'number') {
			isValid = validateUuid(value, options);
		} else {
			isValid = validateUuid(value);
		}

		if (!isValid) {
			throw new InvalidInputException(`${key} is an invalid uuid`);
		}

		return null;
	};

};