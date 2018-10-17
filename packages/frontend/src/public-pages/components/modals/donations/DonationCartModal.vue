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
    <div class="donation-overlay" :style="{ 'z-index': zIndex }">
        <div class="donation-overlay__wrapper">
            <div class="donation-modal donation-modal--cart" ref="donationModalCart">

                <header class="donation-modal__header">
                    <h1 class="donation-modal__title">Your Donations</h1>
                </header>

                <div class="donation-modal__content">

                    <donation-cart-modal-list-table v-on:close="close" v-on:findNonprofit="findNonprofit" v-on:hasError="hasDonationErrors"></donation-cart-modal-list-table>

                    <div class="donation-footer" v-if="!isCartEmpty">
                        <a v-on:click.prevent="checkoutBtn" href="#" class="btn btn--lg btn--accent"><strong>Begin Checking Out</strong></a>
                        <a v-on:click.prevent="helpMoreBtn" href="#" class="btn btn--lite"><strong>Help More Nonprofits</strong></a>
                    </div>

                </div>

                <a v-on:click.prevent="close" href="#" class="donation-close" role="button"><i class="fas fa-times-circle" aria-hidden="true"></i></a>
            </div>
        </div>
    </div>
</template>

<script>
	import ComponentDonationCartModalListTable from './DonationCartModalListTable.vue';

	export default {
		data: function () {
			return {
				hasError: false,
			};
		},
		props: {
			data: {},
			zIndex: {
				type: [Number, String],
				default: 1000
			}
		},
		computed: {
			isCartEmpty: function () {
				return this.$store.state.cartItems.length === 0;
			}
		},
		created: function () {
			const vue = this;
			vue.addBodyClasses('has-donation-overlay');
		},
		mounted: function () {
			const vue = this;
			$(vue.$refs.donationModalCart).fadeIn();
		},
		methods: {
			close: function () {
				const vue = this;

				$(vue.$refs.donationModalCart).fadeOut(function () {
					vue.removeModal('donation-cart');
					vue.removeBodyClasses('has-donation-overlay');
				});
			},
			checkoutBtn: function () {
				const vue = this;

				if (!vue.hasError) {
					$(vue.$refs.donationModalCart).hide();
					vue.removeModal('donation-cart');
					vue.removeBodyClasses('has-donation-overlay');
					vue.$router.push({name: 'cart'});
				}
			},
			helpMoreBtn: function () {
				const vue = this;

				if (!vue.hasError) {
					$(vue.$refs.donationModalCart).hide();
					vue.removeModal('donation-cart');
					vue.removeBodyClasses('has-donation-overlay');
					vue.$router.push({name: 'search-results'});
				}
			},
			findNonprofit: function () {
				const vue = this;

				$(vue.$refs.donationModalCart).hide();
				vue.removeModal('donation-cart');
				vue.removeBodyClasses('has-donation-overlay');
				vue.$router.push({name: 'search-results'});
			},
			hasDonationErrors: function (hasError) {
				const vue = this;
				vue.hasError = hasError;
			}
		},
		components: {
			'donation-cart-modal-list-table': ComponentDonationCartModalListTable,
		}
	};
</script>