<!--
  ~ Copyright 2018 Firespring, Inc.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<template>
    <tr>
        <td class="organization">
            <strong>{{ nonprofit.legalName }}</strong>
        </td>
        <td class="donation">
            <div class="donation-amount" :class="{ 'u-control-icon--has-error': formErrors.amount}">
                <forms-money v-model="localAmount" name="amount" :hasError="formErrors.hasOwnProperty('amount')"></forms-money>
            </div>
            <div v-if="formErrors.amount" class="notes notes--below notes--error">
                A donation amount must be at least $10.00
            </div>
        </td>
        <td class="actions nowrap">
            <a v-on:click.prevent="deleteCartItem" href="#" class="btn btn--sm btn--icon btn--red">
                <i class="fas fa-trash-alt" aria-hidden="true"></i>Delete
            </a>
        </td>
    </tr>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				localAmount: this.amount,
				formErrors: {},
			};
		},
		computed: {
			donationAmount: function () {
				return this.formatMoney(this.amount);
			}
		},
		props: [
			'amount',
			'nonprofit',
			'timestamp',
            'index'
		],
		watch: {
			localAmount: function (value, oldValue) {
				const vue = this;

				if (value !== oldValue) {
					vue.$emit('updateCartItem', vue.index, vue.localAmount);
				}
			},
			amount: function (value, oldValue) {
				const vue = this;

				if (value === oldValue) {
					return;
				}
				vue.formErrors = vue.validate({amount: value}, vue.getConstraints());
				vue.$emit('hasError', (Object.keys(vue.formErrors).length > 0));
				vue.localAmount = value;
			}
		},
		methods: {
			getConstraints: function () {
				return {
					amount: {
						presence: true,
						numericality: {
							onlyInteger: true,
							greaterThanOrEqualTo: 1000,
						}
					},
				};
			},
			deleteCartItem: function () {
				const vue = this;

				vue.$store.commit('removeCartItem', vue.timestamp);
				vue.$emit('removeCartItem', vue.index);

				vue.bus.$emit('updateCartItems');
			}
		},
		components: {
			'forms-money': require('./../../forms/Money.vue')
		}
	};
</script>