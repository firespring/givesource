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
        <footer class="page-footer">
            <slot></slot>

            <div class="contact-info">
                <div class="contact-info__copyright">
                    &copy; {{ year }} <router-link :to="{ name: 'homepage' }">Give to Lincoln Day</router-link>
                </div>

                <div class="contact-info__contact">
                    <router-link :to="{ name: 'contact-us' }"><i class="fa fa-envelope" aria-hidden="true"></i><span>Contact Us</span></router-link>
                </div>

                <div class="contact-info__terms">
                    <router-link :to="{ name: 'tos' }">Terms of Service</router-link>
                </div>

                <div class="contact-info__login">
                    <a :href="adminPagesUrl"><i class="fa fa-sign-in" aria-hidden="true"></i><span>Admin Log In</span></a>
                </div>
            </div>
        </footer>

        <div class="overlay">
            <nav class="overlay__nav">
                <router-link :to="{ name: 'homepage' }">Home</router-link>
                <router-link :to="{ name: 'about' }">About</router-link>
                <router-link :to="{ name: 'toolkits' }">Toolkits</router-link>
                <router-link :to="{ name: 'faq' }">FAQ</router-link>

                <div class="overlay__user-actions">
                    <a :href="adminPagesUrl" class="btn btn--reverse btn--round btn--icon"><i class="fa fa-sign-in" aria-hidden="true"></i><span>Log In</span></a>
                </div>
            </nav>

            <a v-on:click="closeMenu" href="#" id="overlay__close" role="button"><i class="fa fa-times-circle" aria-hidden="true"></i></a>
        </div>

        <div class="donation-overlay">
            <div class="donation-overlay__wrapper">
                <div class="donation-modal donation-modal--options">

                    <header class="donation-modal__header">
                        <h1 class="donation-modal__title">Pick a Donation Amount</h1>
                    </header>

                    <div class="donation-modal__content">
                        <div class="donation-options">
                            <div class="donation-option">
                                <a href="cart.php">
                                    <h2 class="donation-option__title">$100</h2>
                                    <div class="donation-option__description">
                                        Intrinsicly enable ubiquitous opportunities for 24/365 data. Interactively predominate just in time communities via tactical e-tailers.
                                    </div>
                                </a>
                            </div>

                            <div class="donation-option">
                                <a href="cart.php">
                                    <h2 class="donation-option__title">$50</h2>
                                    <div class="donation-option__description">Dynamically restore an expanded array of e-markets before leveraged technologies.</div>
                                </a>
                            </div>

                            <div class="donation-option">
                                <a href="cart.php">
                                    <h2 class="donation-option__title">$25</h2>
                                    <div class="donation-option__description">Completely orchestrate impactful metrics after prospective infomediaries.</div>
                                </a>
                            </div>

                            <div class="donation-option">
                                <a href="cart.php">
                                    <h2 class="donation-option__title">$10</h2>
                                    <div class="donation-option__description">Enthusiastically network frictionless solutions and high-payoff total linkage.</div>
                                </a>
                            </div>

                        </div>

                        <div class="donation-options-custom">
                            <h2>Or Enter a Custom Amount</h2>
                            <form action="cart.php" method="post">
                                <div class="input">
                                    <input type="text" name="customDonationAmount" id="customDonationAmount" placeholder="Enter Amount">
                                </div>
                                <div class="action">
                                    <button class="btn"><i class="fa fa-arrow-right" aria-hidden="true"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <a v-on:click="closeDonations" href="#" id="donation-close" role="button"><i class="fa fa-times-circle" aria-hidden="true"></i></a>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
	module.exports = {
        computed: {
			adminPagesUrl: function () {
				return ADMIN_PAGES_URL + '/login';
            },
            year: function () {
				return new Date().getFullYear();
            }
        },
		methods: {
			closeMenu: function (event) {
				event.preventDefault();
				const vue = this;

				vue.removeBodyClasses('has-overlay', 'has-overlay--mobile-nav');
			},
			closeDonations: function (event) {
				event.preventDefault();
				const vue = this;

				vue.removeBodyClasses('has-donation-overlay');
            }
		},
    };
</script>