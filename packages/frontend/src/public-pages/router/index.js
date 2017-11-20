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
			component: require('./../components/homepage/Homepage.vue')
		},
		{
			path: '/about',
			name: 'about',
			component: require('./../components/about/About.vue')
		},
		{
			path: '/toolkits',
			name: 'toolkits',
			component: require('./../components/toolkits/Toolkits.vue')
		},
		{
			path: '/faq',
			name: 'faq',
			component: require('./../components/faq/Faq.vue')
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
			component: require('./../components/terms/TermsOfService.vue')
		},
		{
			path: '/leaderboard',
			name: 'leaderboard',
			component: require('./../components/leaderboard/Leaderboard.vue')
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

		// Nonprofit
		{
			path: '/nonprofits/demo',
			name: 'nonprofit-landing-page-demo',
			props: true,
			component: require('./../components/nonprofits/Nonprofit.vue'),
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
					donationsSubtotal: 12345,
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
			path: '/nonprofits/:slug',
			name: 'nonprofit-landing-page',
			props: true,
			component: require('./../components/nonprofits/Nonprofit.vue'),
			meta: {
				nonprofit: {},
				slides: [],
				tiers: []
			},
			beforeEnter: function (to, from, next) {
				axios.get(API_URL + 'nonprofits/pages/' + to.params.slug).then(function (response) {
					to.meta.nonprofit = response.data;
				}).then(function () {
					return axios.get(API_URL + 'nonprofits/' + to.meta.nonprofit.uuid + '/slides');
				}).then(function (response) {
					response.data.sort(function (a, b) {
						return a.sortOrder - b.sortOrder;
					});
					to.meta.slides = response.data;
				}).then(function () {
					return axios.get(API_URL + 'nonprofits/' + to.meta.nonprofit.uuid + '/tiers');
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
		'DATE_DONATIONS_END',
		'DATE_DONATIONS_START',
		'DATE_EVENT',
		'DATE_REGISTRATIONS_END',
		'DATE_REGISTRATIONS_START',
		'EVENT_TIMEZONE',
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
	date.setHours(date.getHours() - 1);

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
		next();
	}).catch(function (err) {
		console.log(err);
	});
});

export default router;