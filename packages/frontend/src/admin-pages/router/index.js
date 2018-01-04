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

import * as User from './../helpers/user';
import * as Utils from './../helpers/utils';
import Request from './../helpers/request';
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
			props: true,
			beforeEnter: function (to, from, next) {
				if (User.isAuthenticated()) {
					if (router.app.user.groups.indexOf('SuperAdmin') > -1 || router.app.user.groups.indexOf('Admin') > -1) {
						next({name: 'donations-list'});
					} else {
						next({
							name: 'nonprofit-donations-list',
							params: {
								nonprofitUuid: router.app.user.nonprofitUuid
							}
						});
					}
				} else {
					next();
				}
			}
		},
		{
			path: '/donations',
			name: 'donations-list',
			component: require('./../components/admin/donations/DonationsList.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/donations/add',
			name: 'donations-add',
			component: require('./../components/admin/donations/DonationsAdd.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/nonprofits',
			name: 'nonprofits-list',
			component: require('./../components/admin/nonprofits/NonprofitsList.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/nonprofits/add',
			name: 'add-nonprofit',
			component: require('./../components/admin/nonprofits/NonprofitsAdd.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},

		// Admin - Pages
		{
			path: '/pages',
			name: 'pages-list',
			component: require('./../components/admin/pages/PagesList.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/pages/homepage',
			name: 'pages-homepage',
			component: require('./../components/admin/pages/Homepage.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/pages/checkout',
			name: 'pages-checkout',
			component: require('./../components/admin/pages/Checkout.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/pages/contact-us',
			name: 'pages-contact-us',
			component: require('./../components/admin/pages/ContactUs.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/pages/about-us',
			name: 'pages-about-us',
			component: require('./../components/admin/pages/AboutUs.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/pages/faq',
			name: 'pages-faq',
			component: require('./../components/admin/pages/FAQ.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/pages/toolkit',
			name: 'pages-toolkit',
			component: require('./../components/admin/pages/Toolkit.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/pages/terms',
			name: 'pages-terms',
			component: require('./../components/admin/pages/Terms.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},

		// Admin - Settings
		{
			path: '/settings',
			name: 'settings-list',
			component: require('./../components/admin/settings/SettingsList.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/settings/event',
			name: 'settings-event',
			component: require('./../components/admin/settings/event/EventSettings.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/settings/contact',
			name: 'settings-contact',
			component: require('./../components/admin/settings/contact/ContactSettings.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/settings/customize-homepage-messages',
			name: 'settings-customize-homepage-messages',
			component: require('./../components/admin/settings/homepageMessages/HomepageMessages.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/settings/customize-appearance',
			name: 'settings-customize-appearance',
			component: require('./../components/admin/settings/appearance/Appearance.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/settings/payment-gateway',
			name: 'settings-payment-gateway',
			component: require('./../components/admin/settings/paymentGateway/PaymentGatewaySettings.vue'),
			meta: {
				allowedGroups: ['SuperAdmin']
			},
		},
		{
			path: '/settings/admins',
			name: 'settings-admins-list',
			component: require('./../components/admin/settings/manageAdmins/ManageAdmins.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/settings/admins/invite',
			name: 'settings-admins-invite',
			component: require('./../components/admin/settings/manageAdmins/ManageAdminsInvite.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},

		// Sponsors
		{
			path: '/sponsor-tiers',
			name: 'sponsor-tiers-list',
			component: require('./../components/admin/sponsorTiers/SponsorsTiersList.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/sponsor-tiers/add',
			name: 'sponsor-tiers-add',
			component: require('./../components/admin/sponsorTiers/SponsorsTiersAdd.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/sponsor-tiers/:sponsorTierUuid',
			name: 'sponsor-tiers-edit',
			props: true,
			component: require('./../components/admin/sponsorTiers/SponsorsTiersEdit.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/sponsor-tiers/:sponsorTierUuid/sponsors',
			name: 'sponsors-list',
			props: true,
			component: require('./../components/admin/sponsorTiers/sponsors/SponsorsList.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/sponsor-tiers/:sponsorTierUuid/add',
			name: 'sponsors-add',
			props: true,
			component: require('./../components/admin/sponsorTiers/sponsors/SponsorAdd.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/sponsor-tiers/:sponsorTierUuid/sponsors/:sponsorUuid',
			name: 'sponsors-edit',
			props: true,
			component: require('./../components/admin/sponsorTiers/sponsors/SponsorEdit.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},

		// Nonprofit - Donations
		{
			path: '/nonprofits/:nonprofitUuid/donations',
			name: 'nonprofit-donations-list',
			props: true,
			component: require('./../components/nonprofit/donations/DonationsList.vue'),
			meta: {
				nonprofitStatus: ['ACTIVE'],
				validateNonprofitUuid: true
			}
		},

		// Nonprofit - Settings
		{
			path: '/nonprofits/:nonprofitUuid/settings',
			name: 'nonprofit-settings-list',
			props: true,
			component: require('./../components/nonprofit/settings/SettingsList.vue'),
			meta: {
				nonprofitStatus: ['ACTIVE', 'PENDING'],
				validateNonprofitUuid: true
			}
		},
		{
			path: '/nonprofits/:nonprofitUuid/settings/manage-organization',
			name: 'nonprofit-settings-manage-organization',
			props: true,
			component: require('./../components/nonprofit/settings/manageOrganization/ManageOrganization.vue'),
			meta: {
				nonprofitStatus: ['ACTIVE', 'PENDING'],
				validateNonprofitUuid: true
			}
		},
		{
			path: '/nonprofits/:nonprofitUuid/settings/thank-you-message',
			name: 'nonprofit-settings-thank-you-message',
			props: true,
			component: require('./../components/nonprofit/settings/thankYouMessage/ThankYouMessage.vue'),
			meta: {
				nonprofitStatus: ['ACTIVE', 'PENDING'],
				validateNonprofitUuid: true
			}
		},
		{
			path: '/nonprofits/:nonprofitUuid/settings/notifications',
			name: 'nonprofit-settings-notifications',
			props: true,
			component: require('./../components/nonprofit/settings/notifications/NotificationSettings.vue'),
			meta: {
				nonprofitStatus: ['ACTIVE', 'PENDING'],
				validateNonprofitUuid: true
			}
		},
		{
			path: '/nonprofits/:nonprofitUuid/settings/admins',
			name: 'nonprofit-settings-admins-list',
			props: true,
			component: require('./../components/nonprofit/settings/manageAdmins/ManageAdmins.vue'),
			meta: {
				nonprofitStatus: ['ACTIVE', 'PENDING'],
				validateNonprofitUuid: true
			}
		},
		{
			path: '/nonprofits/:nonprofitUuid/settings/admins/invite',
			name: 'nonprofit-settings-admins-invite',
			props: true,
			component: require('./../components/nonprofit/settings/manageAdmins/ManageAdminsInvite.vue'),
			meta: {
				nonprofitStatus: ['ACTIVE'],
				validateNonprofitUuid: true
			}
		},
		{
			path: '/nonprofits/:nonprofitUuid/settings/request-name-change',
			name: 'nonprofit-settings-request-name-change',
			props: true,
			component: require('./../components/nonprofit/settings/requestNameChange/RequestNameChange.vue'),
			meta: {
				nonprofitStatus: ['ACTIVE'],
				validateNonprofitUuid: true
			}
		},

		// Nonprofit - Your Page
		{
			path: '/nonprofits/:nonprofitUuid/your-page',
			name: 'nonprofit-your-page',
			props: true,
			component: require('./../components/nonprofit/yourPage/YourPage.vue'),
			meta: {validateNonprofitUuid: true}
		},
		{
			path: '/nonprofits/:nonprofitUuid/your-page/media/videos/add',
			name: 'nonprofit-your-page-media-videos-add',
			props: true,
			component: require('./../components/nonprofit/yourPage/media/VideosAdd.vue'),
			meta: {
				nonprofitStatus: ['ACTIVE'],
				validateNonprofitUuid: true
			}
		},
		{
			path: '/nonprofits/:nonprofitUuid/your-page/media/videos/:slideUuid',
			name: 'nonprofit-your-page-media-videos-edit',
			props: true,
			component: require('./../components/nonprofit/yourPage/media/VideosEdit.vue'),
			meta: {
				nonprofitStatus: ['ACTIVE'],
				validateNonprofitUuid: true
			}
		},
		{
			path: '/nonprofits/:nonprofitUuid/your-page/media/photos/:slideUuid',
			name: 'nonprofit-your-page-media-photos-edit',
			props: true,
			component: require('./../components/nonprofit/yourPage/media/PhotosEdit.vue'),
			meta: {
				nonprofitStatus: ['ACTIVE'],
				validateNonprofitUuid: true
			}
		},

		// User Account
		{
			path: '/account',
			name: 'user-account',
			component: require('./../components/account/UserAccount.vue'),
		},

		// Authentication
		{
			path: '/login',
			name: 'login',
			component: require('./../components/auth/login/Login.vue'),
			meta: {requiresAuth: false},
			beforeEnter: function (to, from, next) {
				if (User.isAuthenticated()) {
					if (to.query && to.query.redirect) {
						next(to.query.redirect);
					} else {
						next({name: 'homepage'});
					}
				}
				next();
			}
		},
		{
			path: '/logout',
			name: 'logout',
			component: require('./../components/auth/Logout.vue'),
		},
		{
			path: '/forgot-password',
			name: 'forgot-password',
			component: require('./../components/auth/forgotPassword/ForgotPassword.vue'),
			meta: {requiresAuth: false},
			beforeEnter: function (to, from, next) {
				if (User.isAuthenticated()) {
					next({name: 'homepage'});
				}
				next();
			}
		},

		// Error Pages
		{
			path: '*',
			name: '404',
			component: require('./../components/errors/404.vue'),
			meta: {requiresAuth: false},
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
		'PUBLIC_PAGES_CLOUDFRONT_URL',
		'UPLOADS_CLOUDFRONT_URL',
		'USER_POOL_CLIENT_ID',
		'USER_POOL_ID'
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
 * Load authenticated user
 *
 * @return {Promise}
 */
const loadUser = function () {
	const request = new Request();
	return request.get('user-profile').then(function (response) {
		Vue.prototype.user = response.data;
	});
};

/**
 * Authentication middleware
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 */
const authMiddleware = function (to, from, next) {
	const requiresAuth = to.meta.hasOwnProperty('requiresAuth') ? to.meta.requiresAuth : true;
	if (requiresAuth && !User.isAuthenticated()) {
		User.refreshSession(function (err) {
			if (err) {
				const params = {path: '/login'};
				if (to.fullPath !== '/logout') {
					params.query = {redirect: to.fullPath};
				}
				next(params);
			}
		});
	}
};

/**
 * Validate nonprofit status
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 * @return {Promise}
 */
const nonprofitStatusMiddleware = function (to, from, next) {
	if (to.meta.hasOwnProperty('nonprofitStatus') && to.params.hasOwnProperty('nonprofitUuid')) {
		const request = new Request();
		return request.get('nonprofits/' + to.params.nonprofitUuid).then(function (response) {
			const nonprofit = response.data;
			const allowed = (to.meta.nonprofitStatus instanceof Array) ? to.meta.nonprofitStatus : [to.meta.nonprofitStatus];
			if (_.intersection(allowed, [nonprofit.status]).length === 0) {
				next({name: '404'});
			} else {
				return Promise.resolve();
			}
		});
	} else {
		return Promise.resolve();
	}
};

/**
 * Validate nonprofit middleware
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 */
const nonprofitMiddleware = function (to, from, next) {
	if (to.meta.hasOwnProperty('validateNonprofitUuid') && to.params.hasOwnProperty('nonprofitUuid')) {
		if (_.intersection(router.app.user.groups, ['SuperAdmin', 'Admin']).length === 0 && router.app.user.nonprofitUuid !== to.params.nonprofitUuid) {
			next({name: '404'});
		}
	}
};

/**
 * Groups middleware
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 */
const groupsMiddleware = function (to, from, next) {
	if (to.meta.hasOwnProperty('allowedGroups') && _.intersection(router.app.user.groups, to.meta.allowedGroups).length === 0) {
		next({name: '404'});
	}
};

/**
 * Route Middleware
 */
router.beforeEach(function (to, from, next) {
	loadSettings().then(function () {
		authMiddleware(to, from, next);
	}).then(function () {
		if (User.isAuthenticated()) {
			return loadUser().then(function () {
				return nonprofitStatusMiddleware(to, from, next);
			}).then(function () {
				nonprofitMiddleware(to, from, next);
				groupsMiddleware(to, from, next);
			});
		}
	}).then(function () {
		next();
	}).catch(function (err) {
		console.log(err);
	});
});

export default router;