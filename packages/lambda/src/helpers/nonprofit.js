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

const slug = require('slug');

exports.STATUS_ACTIVE = 'ACTIVE';
exports.STATUS_DENIED = 'DENIED';
exports.STATUS_PENDING = 'PENDING';
exports.STATUS_REVOKED = 'REVOKED';

/**
 * Generate a slug from a string
 *
 * @param {String} string
 */
exports.generateSlug = function (string) {
	return slug(string, {lower: true});
};