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
import GravatarComponent from "vue-gravatar";
import {VMoney} from "v-money";
import Vue from "vue";
import VueCkeditor from "vueckeditor";
import VueRouter from "vue-router";

const FormDirective = require('./directives/forms');
const MessagesDirective = require('./directives/messages');
const ModalMixin = require('./mixins/modals');
const NavigationComponent = require('./components/header/Navigation.vue');
const User = require('./helpers/user');
const UserMixin = require('./mixins/user');
const UtilsMixin = require('./mixins/utils');
const ValidateMixin = require('./mixins/validate');

window._ = require('lodash');
window.axios = axios;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Initialize the event bus
const bus = new Vue();
Vue.mixin({
	data: function () {
		return {
			bus: bus
		}
	}
});

// Register mixins
Vue.mixin(ModalMixin.mixin);
Vue.mixin(UserMixin.mixin);
Vue.mixin(UtilsMixin.mixin);
Vue.mixin(ValidateMixin.mixin);

// Register directives
Vue.directive('floating-label', FormDirective.floatingLabel);
Vue.directive('auto-focus', FormDirective.autoFocus);
Vue.directive('alert-close', MessagesDirective.alertClose);
Vue.directive('money', VMoney);

// Register global components
Vue.component('navigation', NavigationComponent);
Vue.component('v-gravatar', GravatarComponent);
Vue.component('vue-ckeditor', VueCkeditor);

// Register VueRouter
Vue.use(VueRouter);

// Register global variables
Vue.prototype.user = {};
Vue.prototype.user.groups = [];

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
					if (app.user.groups.indexOf('SuperAdmin') > -1 || app.user.groups.indexOf('Admin') > -1) {
						next({name: 'donations-list'});
					} else {
						next({
							name: 'nonprofit-donations-list',
							params: {
								nonprofitUuid: app.user.nonprofitUuid
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
			component: require('./components/admin/donations/DonationsList.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/nonprofits',
			name: 'nonprofits-list',
			component: require('./components/admin/nonprofits/NonprofitsList.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/nonprofits/add',
			name: 'add-nonprofit',
			component: require('./components/admin/nonprofits/NonprofitsAdd.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/pages',
			name: 'pages-list',
			component: require('./components/admin/pages/PagesList.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},

		// Admin - Settings
		{
			path: '/settings',
			name: 'settings-list',
			component: require('./components/admin/settings/SettingsList.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/settings/general-settings',
			name: 'settings-general',
			component: require('./components/admin/settings/generalSettings/GeneralSettings.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/settings/customize-homepage-messages',
			name: 'settings-customize-homepage-messages',
			component: require('./components/admin/settings/homepageMessages/HomepageMessages.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/settings/customize-appearance',
			name: 'settings-customize-appearance',
			component: require('./components/admin/settings/appearance/Appearance.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/settings/admins',
			name: 'settings-admins-list',
			component: require('./components/admin/settings/manageAdmins/ManageAdmins.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},
		{
			path: '/settings/admins/invite',
			name: 'settings-admins-invite',
			component: require('./components/admin/settings/manageAdmins/ManageAdminsInvite.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			},
		},

		// Sponsors
		{
			path: '/sponsors',
			name: 'sponsors-tiers-list',
			component: require('./components/admin/sponsors/tiers/SponsorsTiersList.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/sponsors/add',
			name: 'sponsors-add',
			component: require('./components/admin/sponsors/SponsorAdd.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/sponsors/edit',
			name: 'sponsors-edit',
			component: require('./components/admin/sponsors/SponsorEdit.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/sponsors/tiers',
			name: 'sponsors-list',
			component: require('./components/admin/sponsors/SponsorsList.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/sponsors/tiers/add',
			name: 'sponsors-tiers-add',
			component: require('./components/admin/sponsors/tiers/SponsorsTiersAdd.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},
		{
			path: '/sponsors/tiers/edit',
			name: 'sponsors-tiers-edit',
			component: require('./components/admin/sponsors/tiers/SponsorsTiersEdit.vue'),
			meta: {
				allowedGroups: ['SuperAdmin', 'Admin']
			}
		},

		// Nonprofit - Donations
		{
			path: '/nonprofits/:nonprofitUuid/donations',
			name: 'nonprofit-donations-list',
			props: true,
			component: require('./components/nonprofit/donations/DonationsList.vue'),
			meta: {validateNonprofitUuid: true}
		},

		// Nonprofit - Settings
		{
			path: '/nonprofits/:nonprofitUuid/settings',
			name: 'nonprofit-settings-list',
			props: true,
			component: require('./components/nonprofit/settings/SettingsList.vue'),
			meta: {validateNonprofitUuid: true}
		},
		{
			path: '/nonprofits/:nonprofitUuid/settings/manage-organization',
			name: 'nonprofit-settings-manage-organization',
			props: true,
			component: require('./components/nonprofit/settings/manageOrganization/ManageOrganization.vue'),
			meta: {validateNonprofitUuid: true}
		},
		{
			path: '/nonprofits/:nonprofitUuid/settings/thank-you-message',
			name: 'nonprofit-settings-thank-you-message',
			props: true,
			component: require('./components/nonprofit/settings/thankYouMessage/ThankYouMessage.vue'),
			meta: {validateNonprofitUuid: true}
		},
		{
			path: '/nonprofits/:nonprofitUuid/settings/notifications',
			name: 'nonprofit-settings-notifications',
			props: true,
			component: require('./components/nonprofit/settings/notifications/NotificationSettings.vue'),
			meta: {validateNonprofitUuid: true}
		},
		{
			path: '/nonprofits/:nonprofitUuid/settings/admins',
			name: 'nonprofit-settings-admins-list',
			props: true,
			component: require('./components/nonprofit/settings/manageAdmins/ManageAdmins.vue'),
			meta: {validateNonprofitUuid: true}
		},
		{
			path: '/nonprofits/:nonprofitUuid/settings/admins/invite',
			name: 'nonprofit-settings-admins-invite',
			props: true,
			component: require('./components/nonprofit/settings/manageAdmins/ManageAdminsInvite.vue'),
			meta: {validateNonprofitUuid: true}
		},
		{
			path: '/nonprofits/:nonprofitUuid/settings/request-name-change',
			name: 'nonprofit-settings-request-name-change',
			props: true,
			component: require('./components/nonprofit/settings/requestNameChange/RequestNameChange.vue'),
			meta: {validateNonprofitUuid: true}
		},

		// Nonprofit - Your Page
		{
			path: '/nonprofits/:nonprofitUuid/your-page',
			name: 'nonprofit-your-page',
			props: true,
			component: require('./components/nonprofit/yourPage/YourPage.vue'),
			meta: {validateNonprofitUuid: true}
		},
		{
			path: '/nonprofits/:nonprofitUuid/your-page/media/videos/add',
			name: 'nonprofit-your-page-media-videos-add',
			props: true,
			component: require('./components/nonprofit/yourPage/media/VideosAdd.vue'),
			meta: {validateNonprofitUuid: true}
		},
		{
			path: '/nonprofits/:nonprofitUuid/your-page/media/videos/:slideUuid',
			name: 'nonprofit-your-page-media-videos-edit',
			props: true,
			component: require('./components/nonprofit/yourPage/media/VideosEdit.vue'),
			meta: {validateNonprofitUuid: true}
		},
		{
			path: '/nonprofits/:nonprofitUuid/your-page/media/photos/:slideUuid',
			name: 'nonprofit-your-page-media-photos-edit',
			props: true,
			component: require('./components/nonprofit/yourPage/media/PhotosEdit.vue'),
			meta: {validateNonprofitUuid: true}
		},

		// User Account
		{
			path: '/account',
			name: 'user-account',
			component: require('./components/account/UserAccount.vue'),
		},

		// Authentication
		{
			path: '/login',
			name: 'login',
			component: require('./components/auth/login/Login.vue'),
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
			component: require('./components/auth/Logout.vue'),
		},
		{
			path: '/forgot-password',
			name: 'forgot-password',
			component: require('./components/auth/forgotPassword/ForgotPassword.vue'),
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
			component: require('./components/errors/404.vue'),
			meta: {requiresAuth: false},
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
		window.API_URL = _.find(settings, {key: 'API_URL'}).value;
		window.PUBLIC_PAGES_CLOUDFRONT_URL = _.find(settings, {key: 'PUBLIC_PAGES_CLOUDFRONT_URL'}).value;
		window.UPLOADS_CLOUDFRONT_URL = _.find(settings, {key: 'UPLOADS_CLOUDFRONT_URL'}).value;
		window.UPLOADS_S3_BUCKET_NAME = _.find(settings, {key: 'UPLOADS_S3_BUCKET_NAME'}).value;
		window.USER_POOL_CLIENT_ID = _.find(settings, {key: 'USER_POOL_CLIENT_ID'}).value;
		window.USER_POOL_ID = _.find(settings, {key: 'USER_POOL_ID'}).value;
	});
};

/**
 * Load authenticated user
 *
 * @return {Promise}
 */
const loadUser = function () {
	const userUuid = User.getCognitoUser().username;
	return axios.get(`${API_URL}users/${userUuid}?user_pool_id=${USER_POOL_ID}`).then(function (response) {
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
 * Validate nonprofit middleware
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 */
const nonprofitMiddleware = function (to, from, next) {
	if (to.meta.hasOwnProperty('validateNonprofitUuid') && to.params.hasOwnProperty('nonprofitUuid')) {
		if (_.intersection(app.user.groups, ['SuperAdmin', 'Admin']).length === 0 && app.user.nonprofitUuid !== to.params.nonprofitUuid) {
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
	if (to.meta.hasOwnProperty('allowedGroups') && _.intersection(app.user.groups, to.meta.allowedGroups).length === 0) {
		next({name: '404'});
	}
};

// Route Middleware
router.beforeEach(function (to, from, next) {
	loadSettings().then(function () {
		authMiddleware(to, from, next);
	}).then(function () {
		if (User.isAuthenticated()) {
			return loadUser().then(function () {
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

const appComponent = require('./components/App.vue');
appComponent.router = router;

const app = new Vue(appComponent).$mount('#app');