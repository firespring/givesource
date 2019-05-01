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

const numeral = require('numeral');

const mixin = {
	methods: {
		addBodyClasses(...classes) {
			classes.forEach(bodyClass => {
				document.body.classList.add(bodyClass);
			});
		},
		removeBodyClasses(...classes) {
			classes.forEach(bodyClass => {
				document.body.classList.remove(bodyClass);
			});
		},
		setBodyClasses(...classes) {
			document.body.className = '';
			classes.forEach(bodyClass => {
				document.body.classList.add(bodyClass);
			});
		},
		setPageDescription(description) {
			if (description) {
				document.querySelector('meta[name="description"]').setAttribute('content', description);
			}
		},
		setPageTitle(title) {
			document.title = title;
		},
		formatMoney(amount) {
			return numeral(amount / 100).format('$0,0.00');
		},
		calculateFees(cartItems) {
			const vm = this;

			let transactionFlatFee = vm.$store.getters.setting('PAYMENT_GATEWAY_TRANSACTION_FEE_FLAT_RATE');
			transactionFlatFee = transactionFlatFee ? parseInt(transactionFlatFee) : 0;

			let transactionPercentFee = vm.$store.getters.setting('PAYMENT_GATEWAY_TRANSACTION_FEE_PERCENTAGE');
			transactionPercentFee = transactionPercentFee ? parseFloat(transactionPercentFee) : 0;

			let fees = 0;
			cartItems.forEach(cartItem => {
				fees += Math.floor(Math.round((cartItem.amount + transactionFlatFee) / (1 - transactionPercentFee) - cartItem.amount));
			});
			return fees;
		},
		formatErrorMessageResponse(response) {
			return {
				message: response.data.errorMessage || 'There was an error processing your request',
				type: response.data.errorType || 'Unknown'
			}
		}
	}
};

export default mixin;