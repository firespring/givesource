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
            <div class="donation-modal donation-modal--cart" ref="donationModalCart">

                <header class="donation-modal__header">
                    <h1 class="donation-modal__title">Your Donations</h1>
                </header>

                <div class="donation-modal__content">

                    <donation-cart-modal-list-table v-on:close="close" v-on:updateCartItemsCount="updateCartItemsCount"></donation-cart-modal-list-table>

                    <div class="donation-footer" v-if="displayCheckout">
                        <a v-on:click.prevent="checkoutBtn" href="#" class="btn btn--lg btn--green"><strong>Begin Checking Out</strong></a>
                        <a v-on:click.prevent="helpMoreBtn" href="#" class="btn btn--lite"><strong>Help More Nonprofits</strong></a>
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
    			displayCheckout: true,
            };
        },
    	props: {
    		data: {},
		    zIndex: {
			    type: [Number, String],
			    default: 1000
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
		    close: function (event) {
			    event.preventDefault();
			    const vue = this;

			    $(vue.$refs.donationModalCart).fadeOut(function () {
				    vue.removeModal('donation-cart');
				    vue.removeBodyClasses('has-donation-overlay');
                });
		    },
            checkoutBtn: function () {
		    	const vue = this;

	            $(vue.$refs.donationModalCart).hide();
	            vue.removeModal('donation-cart');
	            vue.removeBodyClasses('has-donation-overlay');
	            vue.$router.push({ name: 'cart' });
            },
            helpMoreBtn: function () {
		    	const vue = this;

	            $(vue.$refs.donationModalCart).hide();
                vue.removeModal('donation-cart');
		        vue.removeBodyClasses('has-donation-overlay');
		        vue.$router.push({ name: 'search-results' });
            },
		    updateCartItemsCount: function (count) {
		    	const vue = this;

                vue.displayCheckout = count;
            }
        },
        components: {
    		'donation-cart-modal-list-table': require('./DonationCartModalListTable.vue')
        }
    };
</script>