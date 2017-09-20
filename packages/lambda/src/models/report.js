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

const Model = require('../models/model');
const ReportHelper = require('../helpers/report');

/**
 * Report constructor
 *
 * @param {{}} [data]
 * @constructor
 */
function Report(data) {
	Model.call(this, data);
}

/**
 * Extend the base Model
 *
 * @type {Model}
 */
Report.prototype = new Model();

/**
 * The allowed attributes for this model
 *
 * @type {[*]}
 */
Report.prototype.attributes = [
	'status',
	'type',
	'url'
];

/**
 * Validation constraints for this model
 *
 * @type {{}}
 */
Report.prototype.constraints = {
	status: {
		presence: true,
		inclusion: [ReportHelper.STATUS_FAILED, ReportHelper.STATUS_PENDING, ReportHelper.STATUS_SUCCESS]
	},
	type: {
		presence: true,
		inclusion: [ReportHelper.TYPE_ALL_DONATIONS, ReportHelper.TYPE_NONPROFIT_DONATIONS]
	},
	url: {
		presence: true,
		url: true
	}
};

/**
 * Default values for this model
 *
 * @return {{}}
 */
Report.prototype.defaults = function () {
	return {
		status: ReportHelper.STATUS_PENDING
	}
};

module.exports = Report;