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

/**
 * Calculate donation fees
 *
 * @param {number} amountInCents
 * @param {bool} isFeeCovered
 * @param {number} transactionFlatFee
 * @param {number} transactionPercentFee
 * @return {number}
 */
exports.calculateFees = function (amountInCents, isFeeCovered, transactionFlatFee, transactionPercentFee) {
	if (isFeeCovered) {
		return ~~(Math.round((amountInCents + transactionFlatFee) / (1 - transactionPercentFee) - amountInCents));
	} else {
		return ~~(Math.round((amountInCents * transactionPercentFee) + (transactionFlatFee)));
	}
};