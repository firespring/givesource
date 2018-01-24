/*
 * Copyright (C) 2017  Firespring
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as Settings from './../helpers/settings';
import * as Utils from './../helpers/utils';
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
			path: '/about',
			name: 'about',
			component: require('./../components/about/About.vue'),
			beforeEnter: function (to, from, next) {
				if (!store.getters.setting('PAGE_ABOUT_ENABLED')) {
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
				if (!store.getters.setting('PAGE_TOOLKIT_ENABLED')) {
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
				if (!store.getters.setting('PAGE_FAQ_ENABLED')) {
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
				if (!store.getters.setting('PAGE_TERMS_ENABLED')) {
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
				if (!Settings.isDayOfEventOrAfter()) {
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

/**
 * Update app settings
 *
 * @return {Promise}
 */
const updateSettings = function () {
	const settings = [
		'ADMIN_PAGES_CLOUDFRONT_URL',
		'CONTACT_PHONE',
		'DATE_EVENT',
		'DATE_REGISTRATIONS_END',
		'DATE_REGISTRATIONS_START',
		'EVENT_TIMEZONE',
		'EVENT_TITLE',
		'PAGE_ABOUT_ENABLED',
		'PAGE_FAQ_ENABLED',
		'PAGE_TERMS_ENABLED',
		'PAGE_TOOLKIT_ENABLED',
		'UPLOADS_CLOUDFRONT_URL'
	];

	return axios.get('/settings.json').then(function (response) {
		window.API_URL = response.data.API_URL;
		store.commit('settings', {API_URL: response.data.API_URL});
	}).then(function () {
		return axios.get(API_URL + 'settings' + Utils.generateQueryString({
			keys: settings
		})).then(function (response) {
			if (response.data.length) {
				response.data.forEach(function (setting) {
					const set = {};
					set[setting.key] = setting.value;
					store.commit('settings', set);
				});
			}
		});
	}).then(function () {
		store.commit('updated');
	});
};

/**
 * Load app settings
 *
 * @return {Promise}
 */
const loadSettings = function () {
	const date = new Date();
	date.setMinutes(date.getMinutes() - 1);

	const lastUpdated = store.getters.updated;
	if (lastUpdated === 0 || lastUpdated <= date.getTime()) {
		return updateSettings();
	} else {
		window.API_URL = store.getters.setting('API_URL');
		return Promise.resolve();
	}
};

/**
 * Route Middleware
 */
router.beforeEach(function (to, from, next) {
	loadSettings().then(function () {
		if (router.app.bus) {
			router.app.bus.$emit('navigate');
		}
	}).then(function () {
		next();
	}).catch(function (err) {
		console.log(err);
	});
});

export default router;