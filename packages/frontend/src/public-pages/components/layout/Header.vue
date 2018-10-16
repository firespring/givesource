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
    <header class="page-header flex text-c">

        <div class="page-header__logo flex justify-center items-center">
            <a href="/" title="Return to the homepage"><img :alt="logoTitle" :src="logoUrl"></a>
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

        <div v-if="canDonate" class="page-header__cart items-center">
            <router-link :to="{ name: 'cart' }" title="View your current donations">
                <span class="fa-layers fa-fw" ref="shoppingCart">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="fa-layers-text fa-inverse" data-fa-transform="right-4 up-6">{{ cartItemsCount }}</span>
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
			canDonate: function () {
				return Settings.isDuringDonations();
			},
			displayAbout: function () {
				return this.$store.getters.booleanSetting('PAGE_ABOUT_ENABLED');
			},
			displayFAQ: function () {
				return this.$store.getters.booleanSetting('PAGE_FAQ_ENABLED');
			},
			displayToolkits: function () {
				return this.$store.getters.booleanSetting('PAGE_TOOLKIT_ENABLED');
			},
			logoTitle: function () {
				return Settings.eventTitle() + ' Logo';
			},
			logoUrl: function () {
				const vue = this;
				const eventLogo = vue.$store.getters.setting('EVENT_LOGO');
				return eventLogo ? eventLogo : '/assets/temp/logo-event.png';
			},
		},
		created: function () {
			const vue = this;

			vue.cartItemsCount = vue.$store.state.cartItems.length;
			vue.bus.$on('updateCartItems', function () {
				vue.cartItemsCount = vue.$store.state.cartItems.length;
				$(vue.$refs.shoppingCart).find('span.fa-layers-text').text(vue.cartItemsCount);
			});

			vue.bus.$on('navigate', function () {
				vue.formData.search = '';
			});
		},
		beforeDestroy: function () {
			const vue = this;

			vue.bus.$off('updateCartItems');
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