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

const validate = require('validate.js');

// Add "label" validator to allow custom label mapping functionality
validate.validators.label = () => {
	return [];
};

// Add image validator
validate.validators.image = (value, options) => {
	let extensions = ['gif', 'jpeg', 'jpg', 'png'];
	options = options || true;

	if (!value || value === false || typeof value === 'undefined' || value === null) {
		return null;
	}

	if (Array.isArray(options)) {
		extensions = options;
	}

	if ((value instanceof File && extensions.indexOf(value.name.split('.').pop().toLowerCase()) < 0) || (!(value instanceof File) && extensions.indexOf(value.filename.split('.').pop().toLowerCase()) < 0)) {
		return 'is not a valid image.';
	}

	return null;
};

// Add favicon validator
validate.validators.favicon = (value, options) => {
	let extensions = ['gif', 'ico', 'png'];
	options = options || true;

	if (!value || value === false || typeof value === 'undefined' || value === null) {
		return null;
	}

	if (Array.isArray(options)) {
		extensions = options;
	}

	if ((value instanceof File && extensions.indexOf(value.name.split('.').pop().toLowerCase()) < 0) || (!(value instanceof File) && extensions.indexOf(value.filename.split('.').pop().toLowerCase()) < 0)) {
		return 'is not a valid favicon.';
	}

	return null;
};

const mixin = {
	methods: {
		validate(data, constraints) {
			return this.getErrorMessages(validate(data, constraints, {fullMessages: false}), constraints);
		},
		getErrorMessages(errors, constraints) {
			const validationErrors = {};
			for (let field in errors) {
				if (errors.hasOwnProperty(field) && errors[field].length > 0) {
					const label = constraints[field].hasOwnProperty('label') ? constraints[field].label : validate.capitalize(validate.prettify(field));
					validationErrors[field] = label + ' ' + errors[field][0];
				}
			}
			return validationErrors;
		},
		scrollToError(selector) {
			this.$nextTick(() => {
				const $el = selector ? $(selector) : $('.c-form-control-error:first').closest('.c-form-item').first('.c-form-item-label-text');
				if ($el.length) {
					$el[0].scrollIntoView(true);
				}
			});
		}
	}
};

export default mixin;