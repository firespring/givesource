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

const ChangeCase = require('change-case');

/**
 * Return model ready data from CloudSearch Fields
 *
 * @param {Model} model
 * @param {Array} fields
 * @return {{}}
 */
exports.convertCloudSearchFields = function (model, fields) {
	const params = {};
	const constraints = model.getConstraints();

	Object.keys(fields).forEach(function (key) {
		let value = fields[key][0];
		const attribute = ChangeCase.camelCase(key);
		if (constraints.hasOwnProperty(attribute) && constraints[attribute].hasOwnProperty('type')) {
			switch (constraints[attribute].type) {
				case 'boolean':
					value = Boolean(value);
					break;
				case 'number':
					value = Number(value);
					break;
				case 'string':
					value = String(value);
					break;
			}
		}
		params[attribute] = value;
	});

	return params;
};