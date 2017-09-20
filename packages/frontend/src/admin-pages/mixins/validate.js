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

// Add "label" validator to allow custom label mapping functionality
validate.validators.label = function () {
	return [];
};

exports.mixin = {
	methods: {
		validate: function (data, constraints) {
			return this.getErrorMessages(validate(data, constraints, {fullMessages: false}), constraints);
		},
		getErrorMessages: function (errors, constraints) {
			const validationErrors = {};
			for (let field in errors) {
				if (errors.hasOwnProperty(field) && errors[field].length > 0) {
					const label = constraints[field].hasOwnProperty('label') ? constraints[field].label : validate.capitalize(validate.prettify(field));
					validationErrors[field] = label + ' ' + errors[field][0];
				}
			}
			return validationErrors;
		}
	}
};