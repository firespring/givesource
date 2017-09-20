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
import Vue from "vue";
import VueRouter from "vue-router";

const UtilsMixin = require('./mixins/utils');

window.axios = axios;
axios.defaults.headers.common['Content-Type'] = 'application/json';
window.$ = window.jQuery = require('jquery');

// Register Mixins
Vue.mixin(UtilsMixin.mixin);

// Register VueRouter
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
			path: '/contact-us',
			name: 'contact-us',
			component: require('./components/contactUs/ContactUs.vue')
		},
		{
			path: '/tos',
			name: 'tos',
			component: require('./components/tos/TermsOfService.vue')
		},
		{
			path: '/leaderboard',
			name: 'leaderboard',
			component: require('./components/leaderboard/Leaderboard.vue')
		},

		// Nonprofit
		{
			path: '/nonprofits/demo',
			name: 'nonprofit-landing-page-demo',
			props: true,
			component: require('./components/nonprofits/Nonprofit.vue'),
			meta: {
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
				nonprofit: {
					legalName: 'Nonprofit Name Goes Here',
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
					donationsSum: 543250,
				}
			}
		},
		{
			path: '/nonprofits/:nonprofitUuid',
			name: 'nonprofit-landing-page',
			props: true,
			component: require('./components/nonprofits/Nonprofit.vue'),
			meta: {
				slides: [],
				nonprofit: {}
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

router.beforeEach(function (to, from, next) {
	axios.get('/settings.json').then(function (response) {
		const settings = response.data;
		window.ADMIN_PAGES_URL = settings.AdminPagesCloudFrontUrl;
		window.API_URL = settings.InvocationUrl;
		window.CLIENT_ID = settings.ClientId;
		window.PUBLIC_PAGES_S3 = settings.PublicPagesS3;
		window.USER_POOL_ID = settings.UserPoolId;
	}).then(function () {
		next();
	});
});

const appComponent = require('./components/App.vue');
appComponent.router = router;

const app = new Vue(appComponent).$mount('#app');