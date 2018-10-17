/*
 * Copyright 2018 Firespring, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as Settings from './../helpers/settings';
import Component404 from './../components/errors/404.vue';
import ComponentAbout from './../components/about/About.vue';
import ComponentCart from './../components/cart/Cart.vue';
import ComponentCartResponse from './../components/cart/response/CartResponse.vue';
import ComponentContact from './../components/contact/Contact.vue';
import ComponentContactResponse from './../components/contact/response/ContactResponse.vue';
import ComponentFAQ from './../components/faq/FAQ.vue';
import ComponentHomepage from './../components/homepage/Homepage.vue';
import ComponentLeaderboard from './../components/leaderboard/Leaderboard.vue';
import ComponentNonprofit from './../components/nonprofits/Nonprofit.vue';
import ComponentRegister from './../components/register/Register.vue';
import ComponentRegisterResponse from './../components/register/response/RegisterResponse.vue';
import ComponentSearchResults from './../components/search/SearchResults.vue';
import ComponentTermsOfService from './../components/terms/TermsOfService.vue';
import ComponentToolkits from './../components/toolkits/Toolkits.vue';
import store from './../store';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
	hashbang: false,
	linkActiveClass: 'here',
	mode: 'history',
	base: __dirname,
	scrollBehavior: function (to, from, savedPosition) {
		if (to.hash) {
			return {selector: to.hash};
		} else if (savedPosition) {
			return savedPosition;
		} else {
			return {x: 0, y: 0};
		}
	},
	routes: [
		{
			path: '/',
			name: 'homepage',
			component: ComponentHomepage
		},
		{
			path: '/index',
			redirect: '/'
		},
		{
			path: '/index.html',
			redirect: '/'
		},
		{
			path: '/about',
			name: 'about',
			component: ComponentAbout,
			beforeEnter: function (to, from, next) {
				if (!store.getters.booleanSetting('PAGE_ABOUT_ENABLED')) {
					next({name: '404'});
				} else {
					next();
				}
			}
		},
		{
			path: '/toolkits',
			name: 'toolkits',
			component: ComponentToolkits,
			beforeEnter: function (to, from, next) {
				if (!store.getters.booleanSetting('PAGE_TOOLKIT_ENABLED')) {
					next({name: '404'});
				} else {
					next();
				}
			}
		},
		{
			path: '/faq',
			name: 'faq',
			component: ComponentFAQ,
			beforeEnter: function (to, from, next) {
				if (!store.getters.booleanSetting('PAGE_FAQ_ENABLED')) {
					next({name: '404'});
				} else {
					next();
				}
			}
		},
		{
			path: '/cart',
			name: 'cart',
			component: ComponentCart,
		},
		{
			path: '/cart/thank-you',
			name: 'cart-response',
			component: ComponentCartResponse,
		},
		{
			path: '/contact',
			name: 'contact',
			component: ComponentContact,
		},
		{
			path: '/contact/thank-you',
			name: 'contact-response',
			component: ComponentContactResponse,
		},
		{
			path: '/terms',
			name: 'terms',
			component: ComponentTermsOfService,
			beforeEnter: function (to, from, next) {
				if (!store.getters.booleanSetting('PAGE_TERMS_ENABLED')) {
					next({name: '404'});
				} else {
					next();
				}
			}
		},
		{
			path: '/leaderboard',
			name: 'leaderboard',
			component: ComponentLeaderboard,
			beforeEnter: function (to, from, next) {
				if (!Settings.isDuringEvent() && !Settings.isAfterEvent()) {
					next({name: '404'});
				} else {
					next();
				}
			}
		},
		{
			path: '/search',
			name: 'search-results',
			component: ComponentSearchResults,
		},
		{
			path: '/register',
			name: 'register',
			component: ComponentRegister,
		},
		{
			path: '/register/thank-you',
			name: 'register-response',
			component: ComponentRegisterResponse,
		},
		{
			path: '/nonprofits/:slug',
			name: 'nonprofit-landing-page',
			props: true,
			meta: {
				nonprofit: null,
			},
			component: ComponentNonprofit,
			beforeEnter: function (to, from, next) {
				axios.get(API_URL + 'nonprofits/pages/' + to.params.slug).then(function (response) {
					if (Object.keys(response.data).length) {
						to.meta.nonprofit = response.data;
						next();
					} else {
						next({name: '404'});
					}
				}).catch(function () {
					next({name: '404'});
				});
			}
		},

		// Error Pages
		{
			path: '*',
			name: '404',
			component: Component404,
		}
	]
});

export default router;