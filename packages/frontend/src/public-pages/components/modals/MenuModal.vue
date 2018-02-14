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
    <div class="overlay" :style="{ 'z-index': zIndex }">

        <nav class="overlay__nav">
            <router-link :to="{ name: 'homepage' }">Home</router-link>
            <router-link :to="{ name: 'about' }" v-if="displayAbout">About</router-link>
            <router-link :to="{ name: 'toolkits' }" v-if="displayToolkits">Toolkits</router-link>
            <router-link :to="{ name: 'faq' }" v-if="displayFAQ">FAQ</router-link>
            <router-link :to="{ name: 'contact' }">Contact Us</router-link>
            <router-link :to="{ name: 'cart' }" v-if="displayCart">Your Donations</router-link>
        </nav>

        <a v-on:click="close" href="#" id="overlay__close" role="button"><i class="fas fa-times-circle" aria-hidden="true"></i></a>
    </div>
</template>

<script>
	module.exports = {
		computed: {
			displayAbout: function () {
				return this.$store.getters.setting('PAGE_ABOUT_ENABLED') ? this.$store.getters.setting('PAGE_ABOUT_ENABLED') : false;
			},
			displayFAQ: function () {
				return this.$store.getters.setting('PAGE_FAQ_ENABLED') ? this.$store.getters.setting('PAGE_FAQ_ENABLED') : false;
			},
			displayToolkits: function () {
				return this.$store.getters.setting('PAGE_TOOLKIT_ENABLED') ? this.$store.getters.setting('PAGE_TOOLKIT_ENABLED') : false;
			},
			displayCart: function () {
				return this.$store.getters.cartItems.length > 0;
			}
		},
		props: {
			data: {},
			zIndex: {
				type: [Number, String],
				default: 1000
			}
		},
		created: function () {
			this.addBodyClasses(['has-overlay', 'has-overlay--mobile-nav']);
		},
		methods: {
			close: function (event) {
				event.preventDefault();
				const vue = this;

				vue.removeModal('menu-overlay');
				vue.removeBodyClasses(['has-overlay', 'has-overlay--mobile-nav']);
			}
		}
	};
</script>