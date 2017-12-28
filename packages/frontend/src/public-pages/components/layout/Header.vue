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
    <header class="page-header flex text-c">

        <div class="page-header__logo flex justify-center items-center">
            <router-link :to="{ name: 'homepage' }" title="Return to the Give To Our City homepage"><img alt="Give To Our City Logo" src="/assets/temp/logo-event.png">
            </router-link>
        </div>

        <nav class="page-header__nav-menu items-center">
            <router-link :to="{ name: 'about' }">About</router-link>
            <router-link :to="{ name: 'toolkits' }">Toolkits</router-link>
            <router-link :to="{ name: 'faq' }">FAQ</router-link>
        </nav>

        <form v-on:submit="submit" class="page-header__search flex justify-center items-center">
            <input v-model="formData.search" type="search" name="searchNonprofits" id="searchNonprofits" placeholder="Find a Nonprofit" ref="search">
            <div v-if="formErrors.search" class="notes notes--below notes--error">
                {{ formErrors.search }}
            </div>
        </form>

        <div class="page-header__cart items-center">
            <router-link :to="{ name: 'cart' }"><i class="fa fa-shopping-cart" aria-hidden="true"></i><span>Your Donations ({{ cartItemsCount }})</span></router-link>
        </div>

        <a v-on:click="openMenu" href="#" id="mobile-nav-trigger" class="page-header__nav-toggle items-center"><i class="fa fa-bars" aria-hidden="true"></i><span>Menu</span></a>
    </header>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				cartItemsCount: 0,

				// Form Data
				formData: {
					search: ''
				},

				// Errors
				formErrors: {},
			};
		},
		created: function () {
			const vue = this;

			vue.updateCartItemsCount();
			vue.bus.$on('updateCartItemsCounter', function () {
				vue.updateCartItemsCount();
			});
		},
		beforeDestroy: function () {
			const vue = this;

			vue.bus.$off('updateCartItemsCounter');
		},
        watch: {
	        formData: {
		        handler: function () {
			        const vue = this;
			        if (Object.keys(vue.formErrors).length) {
				        vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
			        }
		        },
		        deep: true
	        }
        },
		methods: {
			getConstraints: function () {
				return {
					search: {
						presence: false,
						length: {
							minimum: 3
						},
					},
                };
            },
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (!Object.keys(vue.formErrors).length) {
					vue.searchNonprofits();
				}
            },
			searchNonprofits: function () {
				const vue = this;

				vue.$router.push({name: 'search-results', query: {search: vue.formData.search}});
			},
			updateCartItemsCount: function () {
				const vue = this;

				vue.cartItemsCount = vue.$store.state.cartItems.length;
			},
			openMenu: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('menu-overlay');
			},
		}
	};
</script>