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
    <div>
        <layout-hero>
            <h1 slot="title">Your Donations</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">

                <form v-on:submit="submit">
                    <cart-donations v-model="donationAmounts" :displayTotal="!isCartEmpty"></cart-donations>

                    <fieldset v-if="!isCartEmpty">
                        <legend>Your Contact & Billing Info</legend>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="donorNameFirst">Your Name</label>
                            </div>
                            <div class="form-item__control">
                                <div class="grid">
                                    <div class="grid-item">
                                        <input type="text" name="donorNameFirst" id="donorNameFirst" placeholder="First Name" required>
                                    </div>
                                    <div class="grid-item">
                                        <input type="text" name="donorNameLast" id="donorNameLast" placeholder="Last Name" required>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="donorEmail">Your Email</label>
                            </div>
                            <div class="form-item__control">
                                <input type="email" name="donorEmail" id="donorEmail" required>
                            </div>
                        </div>

                        <div class="form-item form-item--address form-item--required">
                            <div class="form-item__label">
                                <label for="billingAddress1">Your Billing Address</label>
                            </div>
                            <div class="form-item__control">

                                <div class="address1">
                                    <input type="text" name="billingAddress1" id="billingAddress1" placeholder="Address Line 1">
                                </div>

                                <div class="address2">
                                    <input type="text" name="billingAddress2" id="billingAddress2" placeholder="Address Line 2">
                                </div>

                                <div class="city-state-zip">

                                    <div class="city-state-zip__city">
                                        <input type="text" name="billingCity" id="billingCity" placeholder="City" required="">
                                    </div>

                                    <div class="city-state-zip__state select-wrap">
                                        <select name="billingState" id="billingState" required="">
                                            <option value="">State</option>
                                            <option value="" disabled="disabled">-----</option>
                                            <option value="AL">Alabama</option>
                                            <option value="AK">Alaska</option>
                                            <option value="AZ">Arizona</option>
                                            <option value="AR">Arkansas</option>
                                            <option value="CA">California</option>
                                            <option value="CO">Colorado</option>
                                            <option value="CT">Connecticut</option>
                                            <option value="DE">Delaware</option>
                                            <option value="FL">Florida</option>
                                            <option value="GA">Georgia</option>
                                            <option value="HI">Hawaii</option>
                                            <option value="ID">Idaho</option>
                                            <option value="IL">Illinois</option>
                                            <option value="IN">Indiana</option>
                                            <option value="IA">Iowa</option>
                                            <option value="KS">Kansas</option>
                                            <option value="KY">Kentucky</option>
                                            <option value="LA">Louisiana</option>
                                            <option value="ME">Maine</option>
                                            <option value="MD">Maryland</option>
                                            <option value="MA">Massachusetts</option>
                                            <option value="MI">Michigan</option>
                                            <option value="MN">Minnesota</option>
                                            <option value="MS">Mississippi</option>
                                            <option value="MO">Missouri</option>
                                            <option value="MT">Montana</option>
                                            <option value="NE">Nebraska</option>
                                            <option value="NV">Nevada</option>
                                            <option value="NH">New Hampshire</option>
                                            <option value="NJ">New Jersey</option>
                                            <option value="NM">New Mexico</option>
                                            <option value="NY">New York</option>
                                            <option value="NC">North Carolina</option>
                                            <option value="ND">North Dakota</option>
                                            <option value="OH">Ohio</option>
                                            <option value="OK">Oklahoma</option>
                                            <option value="OR">Oregon</option>
                                            <option value="PA">Pennsylvania</option>
                                            <option value="RI">Rhode Island</option>
                                            <option value="SC">South Carolina</option>
                                            <option value="SD">South Dakota</option>
                                            <option value="TN">Tennessee</option>
                                            <option value="TX">Texas</option>
                                            <option value="UT">Utah</option>
                                            <option value="VT">Vermont</option>
                                            <option value="VA">Virginia</option>
                                            <option value="WA">Washington</option>
                                            <option value="WV">West Virginia</option>
                                            <option value="WI">Wisconsin</option>
                                            <option value="WY">Wyoming</option>
                                        </select>
                                    </div>

                                    <div class="city-state-zip__zip">
                                        <input type="text" name="billingZip" id="billingZip" placeholder="ZIP" required>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="billingPhone">Your Billing Phone</label>
                            </div>
                            <div class="form-item__control">
                                <input type="tel" name="billingPhone" id="billingPhone" required>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset v-if="!isCartEmpty">
                        <legend>Your Payment Info</legend>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="cc_num">Credit Card #</label>
                            </div>
                            <div class="form-item__control">
                                <input type="text" name="cc_num" id="cc_num" autocomplete="cc-number" required>

                                <div class="notes notes--below accepted-cc">
                                    <div class="cc visa">
                                        <i class="fa fa-cc-visa" aria-hidden="true"></i>
                                    </div>
                                    <div class="cc mastercard">
                                        <i class="fa fa-cc-mastercard" aria-hidden="true"></i>
                                    </div>
                                    <div class="cc amex">
                                        <i class="fa fa-cc-amex" aria-hidden="true"></i>
                                    </div>
                                    <div class="cc discover">
                                        <i class="fa fa-cc-discover" aria-hidden="true"></i>
                                    </div>
                                    <div class="cc dinersclub">
                                        <i class="fa fa-cc-diners-club" aria-hidden="true"></i>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="cc_name">Name on Card</label>
                            </div>
                            <div class="form-item__control">
                                <input type="text" name="cc_name" id="cc_name" required>
                            </div>
                        </div>

                        <div class="form-item">
                            <div class="grid">

                                <div class="grid-item grid-item--collapse">

                                    <div class="form-item form-item--required">
                                        <div class="form-item__label">
                                            <label for="cc_exp_month">Expiration Date</label>
                                        </div>
                                        <div class="form-item__control" style="display: flex;">

                                            <div class="select-wrap" style="margin: 0 .5rem 0 0;">
                                                <select id="cc_exp_month" name="cc_exp_month" required>
                                                    <option value="01">01</option>
                                                    <option value="02">02</option>
                                                    <option value="03">03</option>
                                                    <option value="04">04</option>
                                                    <option value="05">05</option>
                                                    <option value="06">06</option>
                                                    <option value="07">07</option>
                                                    <option value="08">08</option>
                                                    <option value="09">09</option>
                                                    <option value="10">10</option>
                                                    <option value="11">11</option>
                                                    <option value="12">12</option>
                                                </select>
                                            </div>

                                            <div class="select-wrap">
                                                <select id="cc_exp_month" name="cc_exp_month" required>
                                                    <option value="2017">2017</option>
                                                    <option value="2018">2018</option>
                                                    <option value="2019">2019</option>
                                                    <option value="2020">2020</option>
                                                    <option value="2021">2021</option>
                                                    <option value="2022">2022</option>
                                                    <option value="2023">2023</option>
                                                    <option value="2024">2024</option>
                                                    <option value="2025">2025</option>
                                                    <option value="2026">2026</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                                <div class="grid-item">

                                    <div class="form-item form-item--required">
                                        <div class="form-item__label">
                                            <label for="cc_csc">Security Code</label>
                                        </div>
                                        <div class="form-item__control">
                                            <input type="text" name="cc_csc" id="cc_csc" autocomplete="off" required>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </fieldset>

                    <div class="form-actions flex justify-center items-center" v-if="!isCartEmpty">
                        <button type="submit" class="btn btn--green btn--round btn--lg">
                            Complete Your Donation
                        </button>
                    </div>

                </form>

            </div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				isCartEmpty: true,

				donationAmounts: {
					fees: 0,
					subtotal: 0,
					total: 0
                },

				// Form Data
                formData: {
                }
            };
        },
        created: function () {
			const vue = this;

			vue.isCartEmpty = !vue.$store.state.cartItems.length;
	        vue.bus.$on('updateCartItemsCount', function () {
		        vue.isCartEmpty = !vue.$store.state.cartItems.length;
	        });
        },
        beforeDestroy: function () {
			const vue = this;

	        vue.bus.$off('updateCartItemsCount');
        },
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle('Your Donations');
		},
        methods: {
			prevent: function (event) {
				event.preventDefault();
            },
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.$store.commit('clearCartItems');
				vue.bus.$emit('updateCartItems');
				vue.bus.$emit('updateCartItemsCount');
				vue.bus.$emit('updateCartItemsCounter');

				vue.$router.push({ name: 'cart-response' });
            }
        },
		components: {
			'cart-donations': require('./CartDonations.vue'),
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('../layout/Hero.vue'),
			'layout-sponsors': require('../layout/Sponsors.vue'),
		}
	};
</script>