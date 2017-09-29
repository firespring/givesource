<!--
  ~ Copyright (C) 2017  Firespring
  ~
  ~ This program is free software: you can redistribute it and/or modify
  ~ it under the terms of the GNU General Public License as published by
  ~ the Free Software Foundation, either version 3 of the License, or
  ~ (at your option) any later version.
  ~
  ~ This program is distributed in the hope that it will be useful,
  ~ but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~ GNU General Public License for more details.
  ~
  ~ You should have received a copy of the GNU General Public License
  ~ along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -->

<template>
    <div class="donation-overlay" :style="{ 'z-index': zIndex }">
        <div class="donation-overlay__wrapper">
            <div class="donation-modal donation-modal--options" ref="donationModalOptions">

                <header class="donation-modal__header">
                    <h1 class="donation-modal__title">Pick a Donation Amount</h1>
                </header>

                <div class="donation-modal__content">
                    <div class="donation-options" v-if="displayTiers">
                        <donation-tiers-option-row v-for="donationTier in donationTiers" :donationTier="donationTier" :key="donationTier.uuid" v-on:selectTier="selectTier">
                        </donation-tiers-option-row>
                    </div>

                    <div class="donation-options-custom">
                        <h2>Or Enter a Custom Amount</h2>
                        <form v-on:submit="customAmount">
                            <div class="input">
                                <input v-model="formData.customAmount" type="text" name="customAmount" id="customAmount" placeholder="Enter Amount" v-money="currencyOptions">
                            </div>
                            <div class="action">
                                <button class="btn"><i class="fa fa-arrow-right" aria-hidden="true"></i></button>
                            </div>
                        </form>
                    </div>
                </div>

                <a v-on:click="close" href="#" class="donation-close" role="button"><i class="fa fa-times-circle" aria-hidden="true"></i></a>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
    	data: function () {
    		return {
    			donationTiers: [],
                nonprofit: null,

                // Form Data
                formData: {
    				customAmount: '',
                },

			    currencyOptions: {
				    precision: 2,
				    masked: true,
				    thousands: '',
			    }
            };
        },
        computed: {
    		displayTiers: function () {
    			return this.nonprofit !== null && this.donationTiers.length;
            }
        },
    	props: {
		    data: {
			    type: Object,
			    default: {
				    nonprofit: null,
                    tiers: []
			    }
		    },
		    zIndex: {
			    type: [Number, String],
			    default: 1000
		    }
        },
        created: function () {
    		const vue = this;

            vue.addBodyClasses('has-donation-overlay');
            vue.donationTiers = vue.data.tiers;
            vue.nonprofit = vue.data.nonprofit;
        },
        methods: {
	        close: function (event) {
    			event.preventDefault();
    			const vue = this;

    			vue.removeModal('donation-tiers');
		        vue.removeBodyClasses('has-donation-overlay');
            },
	        selectTier: function (amount) {
		        const vue = this;

		        vue.$store.commit('addCartItem', {
		        	amount: amount,
                    nonprofit: vue.nonprofit
                });

		        vue.bus.$emit('updateCart');

		        $(vue.$refs.donationModalOptions).fadeOut(function () {
			        vue.removeModal('donation-tiers');
			        vue.removeBodyClasses('has-donation-overlay');

			        vue.addModal('donation-cart');
                });
	        },
            customAmount: function (event) {
	        	event.preventDefault();
	        	const vue = this;

	            const amount = Math.round(Number.parseFloat(vue.formData.customAmount) * 100);
	        	if (amount) {
			        vue.$store.commit('addCartItem', {
				        amount: amount,
				        nonprofit: vue.nonprofit
			        });

			        vue.bus.$emit('updateCartItems');
			        vue.bus.$emit('updateCartItemsCount');

			        $(vue.$refs.donationModalOptions).fadeOut(function () {
				        vue.removeModal('donation-tiers');
				        vue.removeBodyClasses('has-donation-overlay');

				        vue.addModal('donation-cart');
			        });
                }
            }
        },
        components: {
            'donation-tiers-option-row': require('./DonationTiersModalOptionRow.vue')
        }
    }
</script>