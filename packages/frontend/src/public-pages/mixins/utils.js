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

const mixin = {
	methods: {
		addBodyClasses: function (...classes) {
			document.body.classList.add(...classes);
		},
		removeBodyClasses: function (...classes) {
			document.body.classList.remove(...classes);
		},
		setBodyClasses: function (...classes) {
			document.body.className = '';
			document.body.classList.add(...classes);
		},
		setPageTitle: function (title) {
			document.title = title;
		},
		formatMoney: function (amountInCents) {
			return numeral(amountInCents / 100).format('$0,0.00');
		},
		pad: function (number, places) {
			return new Array(Math.max(places - String(number).length + 1, 0)).join(0) + number;
		},
		calculateFees: function (cartItems, transactionFlatFee, transactionPercentFee) {
			let fees = 0;
			cartItems.forEach(function (cartItem) {
				fees += Math.floor(Math.round((cartItem.amount + transactionFlatFee) / (1 - transactionPercentFee) - cartItem.amount));
			});
			return fees;
		}
	}
};

export default mixin;