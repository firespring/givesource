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

const _ = require('lodash');
const InvalidInputException = require('./../exceptions/invalidInput');
const moment = require('moment-timezone');
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
 * Attribute mutators for this model
 *
 * @type {{}}
 */
Model.prototype.mutators = {};

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
 * Base model mutators
 *
 * @type {{}}
 * @private
 */
Model.prototype._mutators = {
	createdOn: function (value, options) {
		const date = new Date(value);
		if (options.timezone) {
			return moment(date).tz(options.timezone).format('M/D/YYYY h:mm:ss A');
		} else {
			return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
		}
	},
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
 * Get all mutators for this model
 *
 * @return {{}}
 */
Model.prototype.getMutators = function () {
	return _.extend({}, this._mutators, this.mutators);
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

/**
 * Get all non-empty fields
 *
 * @return {{}}
 */
Model.prototype.nonEmpty = function () {
	const all = this.all();
	return _.pick(all, Object.keys(all).filter(function (key) {
		return (all[key] !== '' && all[key] !== null && all[key] !== undefined);
	}));
};

/**
 * Get the mutated version of this model
 *
 * @param {Array} [properties]
 * @param {Object} options
 */
Model.prototype.mutate = function (properties, options) {
	properties = properties || this.getAttributes();
	options = options || {};

	const mutated = {};
	const mutators = this.getMutators();
	const values = this.only(properties);

	properties.forEach(function (property) {
		if (values.hasOwnProperty(property)) {
			mutated[property] = (mutators.hasOwnProperty(property) && typeof mutators[property] === 'function') ? mutators[property](values[property], options) : values[property];
		}
	});

	return mutated;
};

module.exports = Model;