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

const dotenv = require('dotenv');

dotenv.config({path: `${__dirname}/../../../../.env`});
const nodeEnv = process.env.hasOwnProperty('NODE_ENV') ? process.env.NODE_ENV : 'production';

/**
 * Log a message to the console.
 * Ignore in tests.
 *
 * @param {String} message
 * @param {*} [options]
 */
exports.log = function (message, options) {
	if (nodeEnv !== 'test') {
		console.log(message, options);
	}
};

/**
 * Log an error message to the console.
 * Ignore in tests.
 *
 * @param {String} message
 * @param {*} [options]
 */
exports.error = function (message, options) {
	if (nodeEnv !== 'test') {
		console.error(message, options);
	}
};

/**
 * Log an info message to the console.
 * Ignore in tests.
 *
 * @param {String} message
 * @param {*} [options]
 */
exports.info = function (message, options) {
	if (nodeEnv !== 'test') {
		console.info(message, options);
	}
};

/**
 * Log a warning message to the console.
 * Ignore in tests.
 *
 * @param {String} message
 * @param {*} [options]
 */
exports.warn = function (message, options) {
	if (nodeEnv !== 'test') {
		console.warn(message, options);
	}
};

/**
 * Log a debug message to the console.
 * Ignore in tests.
 *
 * @param {String} message
 * @param {*} [options]
 */
exports.debug = function (message, options) {
	if (nodeEnv !== 'test') {
		console.debug(message, options);
	}
};