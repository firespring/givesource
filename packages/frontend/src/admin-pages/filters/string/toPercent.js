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

const numeral = require('numeral');

/**
 * Convert the provided whole number percent into a decimal.
 * For example 2.9 would be converted to 0.029.
 *
 * @param {*} value
 * @returns {*}
 */
function toPercent(value) {
	return numeral(value / 100).format('0.0[000000]');
}

export default toPercent;