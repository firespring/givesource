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

import store from './../store';

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

/**
 * Login CognitoUser
 *
 * @param {String} username
 * @param {String} password
 * @param {{}} callbacks
 */
const login = function (username, password, callbacks) {
	const data = {
		UserPoolId: store.getters.setting('USER_POOL_ID'),
		ClientId: store.getters.setting('USER_POOL_CLIENT_ID')
	};
	const userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
	const userData = {
		Username: username,
		Pool: userPool
	};
	const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	const authenticationData = {
		Username: username,
		Password: password,
	};
	const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: function (result) {
			if (callbacks.hasOwnProperty('onSuccess') && typeof callbacks.onSuccess === 'function') {
				callbacks.onSuccess(result);
			}
		},
		onFailure: function (err) {
			if (callbacks.hasOwnProperty('onFailure') && typeof callbacks.onFailure === 'function') {
				callbacks.onFailure(err);
			}
		},
		mfaRequired: function (codeDeliveryDetails) {
			if (callbacks.hasOwnProperty('mfaRequired') && typeof callbacks.mfaRequired === 'function') {
				callbacks.mfaRequired(codeDeliveryDetails, cognitoUser);
			}
		},
		newPasswordRequired: function (userAttributes, requiredAttributes) {
			if (callbacks.hasOwnProperty('newPasswordRequired') && typeof callbacks.newPasswordRequired === 'function') {
				callbacks.newPasswordRequired(userAttributes, requiredAttributes, cognitoUser);
			}
		}
	});
};

/**
 * Change user password
 *
 * @param {String} oldPassword
 * @param {String} newPassword
 * @param {function} callback
 */
const changePassword = function (oldPassword, newPassword, callback) {
	const cognitoUser = this.getCognitoUser();
	if (cognitoUser) {
		cognitoUser.getSession(function (err, response) {
			if (err) {
				callback(err);
			} else {
				cognitoUser.changePassword(oldPassword, newPassword, callback);
			}
		});
	} else {
		callback(new Error('User not authenticated'));
	}
};

/**
 * Forgot Password workflow
 *
 * @param {String} username
 * @param {{}} callbacks
 */
const forgotPassword = function (username, callbacks) {
	const data = {
		UserPoolId: store.getters.setting('USER_POOL_ID'),
		ClientId: store.getters.setting('USER_POOL_CLIENT_ID')
	};
	const userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
	const userData = {
		Username: username,
		Pool: userPool
	};
	const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.forgotPassword({
		onSuccess: function (result) {
			if (callbacks.hasOwnProperty('onSuccess') && typeof callbacks.onSuccess === 'function') {
				callbacks.onSuccess(result, cognitoUser);
			}
		},
		onFailure: function (err) {
			if (callbacks.hasOwnProperty('onFailure') && typeof callbacks.onFailure === 'function') {
				callbacks.onFailure(err);
			}
		}
	});
};

/**
 * Is CognitoUser authenticated?
 *
 * @return {boolean}
 */
const isAuthenticated = function () {
	let authenticated = false;
	const cognitoUser = this.getCognitoUser();
	if (cognitoUser) {
		cognitoUser.getSession(function (err, session) {
			if (session && session.isValid()) {
				authenticated = true;
			}
		});
	}
	return authenticated;
};

/**
 * Refresh CognitoUser session
 *
 * @param {function} callback
 */
const refreshSession = function (callback) {
	const cognitoUser = this.getCognitoUser();
	if (cognitoUser) {
		cognitoUser.getSession(function (err, session) {
			if (session) {
				cognitoUser.refreshSession(session.getRefreshToken(), callback);
			}
		});
	} else {
		callback(true);
	}
};

/**
 * Log out CognitoUser
 */
const logout = function () {
	const cognitoUser = this.getCognitoUser();
	if (cognitoUser) {
		cognitoUser.signOut();
	}
};

/**
 * Get the CognitoUser
 *
 * @return {CognitoUser|null}
 */
const getCognitoUser = function () {
	const userPoolData = {
		UserPoolId: store.getters.setting('USER_POOL_ID'),
		ClientId: store.getters.setting('USER_POOL_CLIENT_ID')
	};
	const userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData);
	return userPool.getCurrentUser();
};

export {
	login,
	logout,
	isAuthenticated,
	changePassword,
	forgotPassword,
	refreshSession,
	getCognitoUser
}