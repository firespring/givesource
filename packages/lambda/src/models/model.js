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

const _ = require('lodash');
const InvalidInputException = require('./../exceptions/invalidInput');
const UUID = require('node-uuid');
const validate = require('validate.js');
const ValidationHelper = require('./../helpers/validation');

/**
 * Model constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function Model(data) {
	data = data || {};

	this.populate(data);
}

/**
 * The allowed attributes for this model
 *
 * @type {[]}
 */
Model.prototype.attributes = [];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
Model.prototype.constraints = {};

/**
 * Default values for this model
 *
 * @return {{}}
 */
Model.prototype.defaults = function () {
	return {};
};

/**
 * Event fired for this model before validation
 */
Model.prototype.beforeValidate = function () {
	return true;
};

/**
 * Event fired for this model before saving
 */
Model.prototype.beforeSave = function () {
	return true;
};

/**
 * Base Model attributes
 *
 * @type {[]}
 * @private
 */
Model.prototype._attributes = ['createdOn', 'isDeleted', 'uuid'];

/**
 * Base Model constraints
 *
 * @type {{}}
 * @private
 */
Model.prototype._constraints = {
	createdOn: {
		presence: true,
		type: 'number',
		numericality: {
			onlyInteger: true,
			greaterThan: 0
		}

	},
	isDeleted: {
		presence: true,
		type: 'number',
		numericality: {
			onlyInteger: true,
			greaterThanOrEqualTo: 0,
			lessThanOrEqualTo: 1
		}
	},
	uuid: {
		presence: true,
		uuid: 4,
	}
};

/**
 * Base Model defaults
 *
 * @type {{}}
 * @private
 */
Model.prototype._defaults = function () {
	return {
		createdOn: new Date().getTime(),
		isDeleted: 0,
		uuid: UUID.v4()
	};
};

/**
 * Get all attributes for this model
 *
 * @return {[]}
 */
Model.prototype.getAttributes = function () {
	return this._attributes.concat(this.attributes);
};

/**
 * Get all constraints for this model
 *
 * @return {{}}
 */
Model.prototype.getConstraints = function () {
	return _.extend({}, this._constraints, this.constraints);
};

/**
 * Get all defaults for this model
 *
 * @return {{}}
 */
Model.prototype.getDefaults = function () {
	return _.extend({}, this._defaults(), this.defaults());
};

/**
 * Fill expected attributes from data
 *
 * @param {{}} [data]
 */
Model.prototype.populate = function (data) {
	let attributes = this.getAttributes();
	let defaults = this.getDefaults();
	for (const key in attributes) {
		let prop = attributes[key];
		if (data.hasOwnProperty(prop)) {
			this[prop] = data[prop];
		} else if (this.hasOwnProperty(prop)) {
			// Property is already set, move on.
		} else if (defaults.hasOwnProperty(prop)) {
			this[prop] = defaults[prop];
		} else {
			this[prop] = null;
		}
	}
};

/**
 * Validate this model's properties
 *
 * @param {[]} [fields]
 * @return {Promise}
 */
Model.prototype.validate = function (fields) {
	const model = this;
	model.beforeValidate();
	return new Promise(function (resolve, reject) {
		ValidationHelper.loadCustom();
		let err;
		if (fields) {
			err = validate(model.only(fields), _.pick(model.constraints, fields));
		} else {
			err = validate(model.all(), model.getConstraints());
		}
		if (err) {
			reject(new InvalidInputException(JSON.stringify(err)));
		}
		resolve();
	});
};

/**
 * Get all attributes and values of this model
 *
 * @return {{}}
 */
Model.prototype.all = function () {
	let all = {};
	let attributes = this.getAttributes();
	for (const key in attributes) {
		let prop = attributes[key];
		all[prop] = this.hasOwnProperty(prop) ? this[prop] : null;
	}

	return all;
};

/**
 * Get only the attributes and values in properties
 *
 * @param {[]} [properties]
 * @return {{}}
 */
Model.prototype.only = function (properties) {
	let only = {};
	for (const key in this.all()) {
		if (properties.indexOf(key) > -1) {
			only[key] = this.all()[key];
		}
	}

	return only;
};

/**
 * Get all attributes and values excluding properties
 *
 * @param {[]} [properties]
 * @return {{}}
 */
Model.prototype.except = function (properties) {
	let except = {};
	for (const key in this.all()) {
		if (!(properties.indexOf(key) > -1)) {
			except[key] = this.all()[key];
		}
	}
	return except;
};

module.exports = Model;