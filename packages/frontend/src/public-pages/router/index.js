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
			component: require('./../components/homepage/Homepage.vue')
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
			component: require('./../components/about/About.vue'),
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
			component: require('./../components/toolkits/Toolkits.vue'),
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
			component: require('./../components/faq/FAQ.vue'),
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
			component: require('./../components/cart/Cart.vue')
		},
		{
			path: '/cart/thank-you',
			name: 'cart-response',
			component: require('./../components/cart/response/CartResponse.vue')
		},
		{
			path: '/contact',
			name: 'contact',
			component: require('./../components/contact/Contact.vue')
		},
		{
			path: '/contact/thank-you',
			name: 'contact-response',
			component: require('./../components/contact/response/ContactResponse.vue')
		},
		{
			path: '/terms',
			name: 'terms',
			component: require('./../components/terms/TermsOfService.vue'),
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
			component: require('./../components/leaderboard/Leaderboard.vue'),
			beforeEnter: function (to, from, next) {
				if (!Settings.isDuringEventOrAfter()) {
					next({name: '404'});
				} else {
					next();
				}
			}
		},
		{
			path: '/search',
			name: 'search-results',
			component: require('./../components/search/SearchResults.vue')
		},
		{
			path: '/register',
			name: 'register',
			component: require('./../components/register/Register.vue')
		},
		{
			path: '/register/thank-you',
			name: 'register-response',
			component: require('./../components/register/response/RegisterResponse.vue')
		},
		{
			path: '/nonprofits/:slug',
			name: 'nonprofit-landing-page',
			props: true,
			meta: {
				nonprofit: null,
			},
			component: require('./../components/nonprofits/Nonprofit.vue'),
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
			component: require('./../components/errors/404.vue')
		}
	]
});

export default router;