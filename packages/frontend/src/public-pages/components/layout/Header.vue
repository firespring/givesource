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
            <a href="/" title="Return to the homepage"><img :alt="logoTitle" src="/assets/temp/logo-event.png"></a>
        </div>

        <nav class="page-header__nav-menu items-center">
            <router-link :to="{ name: 'about' }" v-if="displayAbout">About</router-link>
            <router-link :to="{ name: 'toolkits' }" v-if="displayToolkits">Toolkits</router-link>
            <router-link :to="{ name: 'faq' }" v-if="displayFAQ">FAQ</router-link>
        </nav>

        <form v-on:submit="submit" class="page-header__search flex justify-center items-center">
            <input v-model="formData.search" type="search" name="searchNonprofits" id="searchNonprofits" placeholder="Find a Nonprofit" ref="search">
            <div v-if="formErrors.search" class="notes notes--below notes--error">
                {{ formErrors.search }}
            </div>
        </form>

        <div class="page-header__cart items-center">
            <router-link :to="{ name: 'cart' }" title="View your current donations">
                <span class="fa-layers fa-fw" ref="shoppingBag">
                    <i class="fas fa-shopping-bag"></i>
                    <span class="fa-layers-text fa-inverse" data-fa-transform="shrink-10 down-3">{{ cartItemsCount }}</span>
                </span>
            </router-link>
        </div>

        <a v-on:click="openMenu" href="#" id="mobile-nav-trigger" class="page-header__nav-toggle items-center"><i class="fas fa-bars" aria-hidden="true"></i><span>Menu</span></a>
    </header>
</template>

<script>
	import * as Settings from './../../helpers/settings';

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
			logoTitle: function () {
				return Settings.eventTitle() + ' Logo';
			}
        },
		created: function () {
			const vue = this;

			vue.updateCartItemsCount();
			vue.bus.$on('updateCartItemsCounter', function () {
				vue.updateCartItemsCount();
			});

			vue.bus.$on('navigate', function () {
				vue.formData.search = '';
            });
		},
		beforeDestroy: function () {
			const vue = this;

			vue.bus.$off('updateCartItemsCounter');
			vue.bus.$off('navigate');
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

				vue.$router.push(vue.generatePageLink({search: vue.formData.search}));
			},
			updateCartItemsCount: function () {
				const vue = this;

				vue.cartItemsCount = vue.$store.state.cartItems.length;
				$(vue.$refs.shoppingBag).find('span[data-fa-processed]').text(vue.cartItemsCount);
			},
			openMenu: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('menu-overlay');
			},
			generatePageLink: function (query) {
				const vue = this;
				query = query || {};
				query = _.extend({}, vue.$route.query, query);
				Object.keys(query).forEach(function (key) {
					if (query[key] === null || query[key] === 0 || query[key] === '' || query[key] === '0') {
						delete query[key];
					}
				});
				return {
					name: 'search-results',
					query: query
				};
			}
		}
	};
</script>