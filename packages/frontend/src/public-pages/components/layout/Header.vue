<!--
  ~ Copyright 2019 Firespring, Inc.
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

            <router-link v-for="page in pages" :key="page.uuid" :to="{ path: page.slug }" v-if="page.enabled">{{ page.title }}</router-link>
        </nav>

        <form v-on:submit.prevent="submit" class="page-header__search flex justify-center items-center">
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

        <a v-on:click.prevent="openMenu" href="#" id="mobile-nav-trigger" class="page-header__nav-toggle items-center"><i class="fas fa-bars" aria-hidden="true"></i><span>Menu</span></a>
    </header>
</template>

<script>
	import * as Settings from './../../helpers/settings';

	export default {
		data() {
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
			canDonate() {
				return Settings.isDuringDonations() || Settings.isDuringEvent();
			},
			displayAbout() {
				return this.$store.getters.booleanSetting('PAGE_ABOUT_ENABLED');
			},
			displayFAQ() {
				return this.$store.getters.booleanSetting('PAGE_FAQ_ENABLED');
			},
			displayToolkits() {
				return this.$store.getters.booleanSetting('PAGE_TOOLKIT_ENABLED');
			},
			logoTitle() {
				return Settings.eventTitle() + ' Logo';
			},
			logoUrl() {
				const eventLogo = this.$store.getters.setting('EVENT_LOGO');
				return eventLogo ? eventLogo : '/assets/img/logo-event.png';
			},
			pages() {
				return this.$store.getters.pages;
			},
		},
		created() {
			const vm = this;

			vm.cartItemsCount = vm.$store.state.cartItems.length;
			vm.bus.$on('updateCartItems', () => {
				vue.cartItemsCount = vm.$store.state.cartItems.length;
				$(vm.$refs.shoppingCart).find('span.fa-layers-text').text(vm.cartItemsCount);
			});

			vm.bus.$on('navigate', () => {
				vm.formData.search = '';
			});
		},
		beforeDestroy() {
			const vm = this;

			vm.bus.$off('updateCartItems');
			vm.bus.$off('navigate');
		},
		watch: {
			formData: {
				handler() {
					const vm = this;
					if (Object.keys(vm.formErrors).length) {
						vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
					}
				},
				deep: true
			}
		},
		methods: {
			getConstraints() {
				return {
					search: {
						presence: false,
						length: {
							minimum: 3
						},
					},
				};
			},
			submit() {
				const vm = this;

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (!Object.keys(vm.formErrors).length) {
					vm.searchNonprofits();
				}
			},
			searchNonprofits() {
				const vm = this;

				vm.$router.push(vm.generatePageLink({search: vm.formData.search, start: null}));
			},
			openMenu() {
				this.addModal('menu-overlay');
			},
			generatePageLink(query) {
				const vm = this;

				query = query || {};
				query = _.extend({}, vm.$route.query, query);
				Object.keys(query).forEach(key => {
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