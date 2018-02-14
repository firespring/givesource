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
    <fieldset>
        <legend>Your Current Donations</legend>

        <div class="form-item">
            <cart-donations-list-table v-on:hasError="hasError"></cart-donations-list-table>
        </div>

        <div class="cart-totals" v-if="displayTotal">
            <div class="cart-totals__subtotal">
                Your donation subtotal is <strong>{{ subtotal }}</strong>. (
                <router-link :to="{ name: 'search-results' }">Find another nonprofit to help</router-link>
                )
            </div>
            <div class="cart-totals__transaction-fees">
                <div>
                    <label class="checkbox-solo">
                        <input v-model="localValue" type="checkbox" name="coverDonationFees" id="coverDonationFees">
                        <span>I want to cover the <strong>{{ fees }}</strong> transaction cost so 100% of my donation goes to the organization(s).</span>
                    </label>
                </div>
            </div>
            <div class="cart-totals__total">
                <strong>Your total payment will be {{ total }}.</strong>
            </div>
        </div>

    </fieldset>
</template>

<script>
    module.exports = {
        data: function () {
            return {
                localValue: false,

                donationFees: 0,
                donationSubtotal: 0,
            };
        },
        computed: {
            donationTotal: function () {
                const vue = this;

                if (vue.localValue) {
                    return this.donationFees + this.donationSubtotal;
                } else {
                    return this.donationSubtotal;
                }
            },
            fees: function () {
                const fees = JSON.parse(JSON.stringify(this.donationFees));
                return this.formatMoney(fees);
            },
            subtotal: function () {
                const subtotal = JSON.parse(JSON.stringify(this.donationSubtotal));
                return this.formatMoney(subtotal);
            },
            total: function () {
                const total = JSON.parse(JSON.stringify(this.donationTotal));
                return this.formatMoney(total);
            }
        },
        props: {
            value: {},
            displayTotal: {
                type: Boolean,
                default: false
            }
        },
        created: function () {
            const vue = this;

            vue.updateDonationsSubtotal();
            vue.bus.$on('updateCartItems', function () {
                vue.updateDonationsSubtotal();
            });
        },
        beforeDestroy: function () {
            const vue = this;

            vue.bus.$off('updateCartItems');
        },
        watch: {
            localValue: function (value, oldValue) {
                const vue = this;
                if (value === oldValue) {
                    return;
                }
                vue.$emit('input', value);
            },
            value: function (value, oldValue) {
                const vue = this;
                if (value === oldValue) {
                    return;
                }
                vue.localValue = value;
            }
        },
        methods: {
            updateDonationsSubtotal: function () {
                const vue = this;

                const cartItems = vue.$store.getters.cartItems;

                vue.donationFees = vue.calculateFees(cartItems, 30, 0.029);
                vue.donationSubtotal = 0;
                cartItems.forEach(function (cartItem) {
                    vue.donationSubtotal += cartItem.amount;
                });
            },
            hasError: function (hasError) {
                const vue = this;
                vue.$emit('hasError', hasError);
            },
        },
        components: {
            'cart-donations-list-table': require('./CartDonationsListTable.vue')
        }
    };
</script>