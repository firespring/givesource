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
		data() {
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
			isCartEmpty() {
				return this.$store.state.cartItems.length === 0;
			}
		},
		created() {
			this.addBodyClasses('has-donation-overlay');
		},
		mounted() {
			$(this.$refs.donationModalCart).fadeIn();
		},
		methods: {
			close() {
				const vm = this;

				$(vm.$refs.donationModalCart).fadeOut(() => {
					vm.removeModal('donation-cart');
					vm.removeBodyClasses('has-donation-overlay');
				});
			},
			checkoutBtn() {
				const vm = this;

				if (!vm.hasError) {
					$(vm.$refs.donationModalCart).hide();
					vm.removeModal('donation-cart');
					vm.removeBodyClasses('has-donation-overlay');
					vm.$router.push({name: 'cart'});
				}
			},
			helpMoreBtn() {
				const vm = this;

				if (!vm.hasError) {
					$(vm.$refs.donationModalCart).hide();
					vm.removeModal('donation-cart');
					vm.removeBodyClasses('has-donation-overlay');

					vm.$router.push({
						name: vm.$route.name === 'leaderboard' ? 'leaderboard' : 'search-results',
						query: vm.$route.query ? vm.$route.query : {}
					});
				}
			},
			findNonprofit() {
				const vm = this;

				$(vm.$refs.donationModalCart).hide();
				vm.removeModal('donation-cart');
				vm.removeBodyClasses('has-donation-overlay');

				vm.$router.push({
					name: vm.$route.name === 'leaderboard' ? 'leaderboard' : 'search-results',
					query: vm.$route.query ? vm.$route.query : {}
				});
			},
			hasDonationErrors(hasError) {
				this.hasError = hasError;
			}
		},
		components: {
			'donation-cart-modal-list-table': ComponentDonationCartModalListTable,
		}
	};
</script>