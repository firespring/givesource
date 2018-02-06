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
    <tr>
        <td class="organization">
            <strong>{{ nonprofit.legalName }}</strong>
        </td>
        <td class="donation">
            <div class="donation-amount">
                <input v-model.lazy="localAmount" type="text" name="amount" required v-money="currencyOptions" :class="{ 'has-error': error}">
            </div>
            <div v-if="error" class="notes notes--below notes--error">
                A donation amount must be at least $10.00
            </div>
        </td>
        <td class="actions nowrap">
            <a v-on:click="deleteCartItem" href="#" class="btn btn--sm btn--icon btn--red">
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
                error: null,

                currencyOptions: {
                    precision: 2,
                    masked: true,
                    thousands: '',
                }
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
            'timestamp'
        ],
        watch: {
            localAmount: function (value, oldValue) {
                const vue = this;

                if (value !== oldValue && vue.timestamp) {
                    vue.$emit('updateCartItem', vue.timestamp, vue.localAmount);
                }
            },
            amount: function (value, oldValue) {
                const vue = this;

                if (value === oldValue) {
                    return;
                }
                vue.formErrors = vue.validate({amount: value}, vue.getConstraints());
                vue.error = (Object.keys(vue.formErrors).length) ? true : false;
                vue.$emit('hasError', vue.error);

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
            deleteCartItem: function (event) {
                event.preventDefault();
                const vue = this;

                vue.$store.commit('removeCartItem', vue.timestamp);
                vue.$emit('removeCartItem', vue.timestamp);

                vue.bus.$emit('updateCartItems');
                vue.bus.$emit('updateCartItemsCount');
                vue.bus.$emit('updateCartItemsCounter');
            }
        }
    };
</script>