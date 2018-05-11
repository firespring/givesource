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
			this.addBodyClasses(...classes);
		},
		setPageTitle: function (title) {
			document.title = title;
		},
		formatMoney: function (amount) {
			return numeral(amount / 100).format('$0,0.00');
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