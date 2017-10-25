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

import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import {VMoney} from "v-money";
import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";

const ModalsMixin = require('./mixins/modals');
const UtilsMixin = require('./mixins/utils');

window._ = require('lodash');
window.axios = axios;
axios.defaults.headers.common['Content-Type'] = 'application/json';
window.$ = window.jQuery = require('jquery');

// Initialize the event bus
const bus = new Vue();
Vue.mixin({
	data: function () {
		return {
			bus: bus
		}
	}
});

// Register Mixins
Vue.mixin(ModalsMixin.mixin);
Vue.mixin(UtilsMixin.mixin);

// Register Directives
Vue.directive('money', VMoney);

// Register VueRouter
Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
	hashbang: false,
	linkActiveClass: 'here',
	mode: 'history',
	base: __dirname,
	scrollBehavior: function (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return {x: 0, y: 0};
		}
	},
	routes: [
		{
			path: '/',
			name: 'homepage',
			component: require('./components/homepage/Homepage.vue')
		},
		{
			path: '/about',
			name: 'about',
			component: require('./components/about/About.vue')
		},
		{
			path: '/toolkits',
			name: 'toolkits',
			component: require('./components/toolkits/Toolkits.vue')
		},
		{
			path: '/faq',
			name: 'faq',
			component: require('./components/faq/Faq.vue')
		},
		{
			path: '/cart',
			name: 'cart',
			component: require('./components/cart/Cart.vue')
		},
		{
			path: '/cart/thank-you',
			name: 'cart-response',
			component: require('./components/cart/response/CartResponse.vue')
		},
		{
			path: '/contact',
			name: 'contact',
			component: require('./components/contact/Contact.vue')
		},
		{
			path: '/contact/thank-you',
			name: 'contact-response',
			component: require('./components/contact/response/ContactResponse.vue')
		},
		{
			path: '/terms',
			name: 'terms',
			component: require('./components/terms/TermsOfService.vue')
		},
		{
			path: '/leaderboard',
			name: 'leaderboard',
			component: require('./components/leaderboard/Leaderboard.vue')
		},
		{
			path: '/search',
			name: 'search-results',
			component: require('./components/search/SearchResults.vue')
		},
		{
			path: '/register',
			name: 'register',
			component: require('./components/register/Register.vue')
		},
		{
			path: '/register/thank-you',
			name: 'register-response',
			component: require('./components/register/response/RegisterResponse.vue')
		},

		// Nonprofit
		{
			path: '/nonprofits/demo',
			name: 'nonprofit-landing-page-demo',
			props: true,
			component: require('./components/nonprofits/Nonprofit.vue'),
			meta: {
				nonprofit: {
					legalName: 'Demo Nonprofit',
					longDescription: `<p>Dramatically productivate fully researched applications through value-added products. Monotonectally incubate market positioning testing procedures after adaptive results. Professionally revolutionize parallel experiences rather than excellent markets.</p>
						<p>Intrinsicly benchmark mission-critical technologies through business customer service. Enthusiastically formulate e-business core competencies without installed base "outside the box" thinking. Uniquely architect state of the art human capital via out-of-the-box models.</p>
						<p>Credibly monetize virtual internal or "organic" sources whereas corporate total linkage. Holisticly enhance client-centric information with ethical communities. Phosfluorescently predominate plug-and-play e-services for flexible channels.</p>
						<p>Intrinsicly monetize equity invested e-services whereas cutting-edge products. Distinctively target user-centric human capital vis-a-vis high standards in imperatives. Competently myocardinate next-generation opportunities and seamless resources.</p>
						<p>Seamlessly maximize multidisciplinary methods of empowerment for holistic interfaces. Energistically repurpose stand-alone outsourcing rather than principle-centered growth strategies. Uniquely actualize multimedia based ideas through open-source systems.</p>
						<p>Globally re-engineer innovative total linkage and holistic methodologies. Competently reintermediate quality deliverables through plug-and-play schemas. Enthusiastically foster standardized results rather than fully tested vortals.</p>
						<p>Holisticly morph market positioning scenarios rather than emerging action items. Intrinsicly reinvent bricks-and-clicks data with exceptional models. Progressively build maintainable interfaces before revolutionary testing procedures.</p>
						<p>Distinctively engineer intuitive innovation via virtual potentialities.</p>`,
					shortDescription: 'Help us to serve artists and the public from our new home. Every dollar will be matched by the Hufflepuff Foundation, doubling your support!',
					donationsCount: 254,
					donationsSum: 12345,
				},
				slides: [
					{
						type: 'IMAGE',
						url: `../assets/temp/slide1.jpg`,
					},
					{
						type: 'VIMEO',
						embedUrl: 'https://player.vimeo.com/video/167469368',
					},
					{
						type: 'YOUTUBE',
						embedUrl: 'https://www.youtube.com/embed/ragvMBsspms'
					}
				],
				tiers: [
					{
						amount: 10000,
						description: 'Intrinsicly enable ubiquitous opportunities for 24/365 data. Interactively predominate just in time communities via tactical e-tailers.'
					},
					{
						amount: 5000,
						description: 'Dynamically restore an expanded array of e-markets before leveraged technologies.'
					},
					{
						amount: 2500,
						description: 'Completely orchestrate impactful metrics after prospective infomediaries.'
					},
					{
						amount: 1000,
						description: 'Enthusiastically network frictionless solutions and high-payoff total linkage.'
					}
				]
			}
		},
		{
			path: '/nonprofits/:nonprofitUuid',
			name: 'nonprofit-landing-page',
			props: true,
			component: require('./components/nonprofits/Nonprofit.vue'),
			meta: {
				nonprofit: {},
				slides: [],
				tiers: []
			},
			beforeEnter: function (to, from, next) {
				axios.get(API_URL + 'nonprofits/' + to.params.nonprofitUuid).then(function (response) {
					to.meta.nonprofit = response.data;
				}).then(function () {
					return axios.get(API_URL + 'nonprofits/' + to.params.nonprofitUuid + '/slides');
				}).then(function (response) {
					response.data.sort(function (a, b) {
						return a.sortOrder - b.sortOrder;
					});
					to.meta.slides = response.data;
				}).then(function () {
					return axios.get(API_URL + 'nonprofits/' + to.params.nonprofitUuid + '/tiers');
				}).then(function (response) {
					response.data.sort(function (a, b) {
						return b.amount - a.amount;
					});
					to.meta.tiers = response.data;
				}).then(function () {
					next();
				}).catch(function () {
					next({
						name: '404'
					});
				});
			}
		},

		// Error Pages
		{
			path: '*',
			name: '404',
			component: require('./components/errors/404.vue')
		}
	]
});

/**
 * Load app settings
 *
 * @return {Promise}
 */
const loadSettings = function () {
	return axios.get('/settings.json').then(function (response) {
		return axios.get(response.data.API_URL + 'settings');
	}).then(function (response) {
		const settings = response.data;
		window.ADMIN_PAGES_CLOUDFRONT_URL = _.find(settings, {key: 'PUBLIC_PAGES_CLOUDFRONT_URL'}).value;
		window.API_URL = _.find(settings, {key: 'API_URL'}).value;
		window.PUBLIC_PAGES_S3_BUCKET_NAME = _.find(settings, {key: 'PUBLIC_PAGES_S3_BUCKET_NAME'}).value;
		window.USER_POOL_CLIENT_ID = _.find(settings, {key: 'USER_POOL_CLIENT_ID'}).value;
		window.USER_POOL_ID = _.find(settings, {key: 'USER_POOL_ID'}).value;
	});
};

router.beforeEach(function (to, from, next) {
	loadSettings().then(function () {
		next();
	}).catch(function (err) {
		console.log(err);
	});
});

// Initialize Vuex store
const store = new Vuex.Store({
	state: {
		cartItems: []
	},
	mutations: {
		addCartItem: function (state, payload) {
			if (payload.amount && payload.nonprofit !== null) {
				let amount = payload.amount;
				if (typeof amount === 'string' && amount.indexOf('.') > -1) {
					amount = Math.round(Number.parseFloat(payload.amount) * 100);
				}

				state.cartItems.push({
					amount: amount,
					nonprofit: payload.nonprofit,
					timestamp: Date.now(),
				});
			}
		},
		removeCartItem: function (state, timestamp) {
			_.remove(state.cartItems, {timestamp: timestamp});
		},
		updateCartItem: function (state, payload) {
			if (payload.amount && payload.timestamp) {

				let amount = payload.amount;
				if (typeof amount === 'string' && amount.indexOf('.') > -1) {
					amount = Math.round(Number.parseFloat(payload.amount) * 100);
				}

				const cartItem = _.find(state.cartItems, {timestamp: payload.timestamp});
				cartItem.amount = amount;
			}
		},
		clearCartItems: function (state) {
			state.cartItems = [];
		}
	},
	plugins: [
		createPersistedState()
	]
});

const appComponent = require('./components/App.vue');
appComponent.router = router;
appComponent.store = store;

const app = new Vue(appComponent).$mount('#app');