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

import * as _ from 'lodash';
import * as User from './user';
import axios from 'axios';
import store from './../store';

/**
 * Request constructor
 *
 * @constructor
 */
function Request() {
}

/**
 * Send a DELETE request
 *
 * @param {String} uri
 * @param {{}} [data]
 * @param {{}} [headers]
 */
Request.prototype.delete = function (uri, data, headers) {
	const request = this;
	const apiUrl = store.getters.setting('API_URL');
	return request.buildHeaders(headers).then(function (response) {
		const config = data ? {data: data, headers: response} : {headers: response};
		return axios.delete(apiUrl + uri, config);
	});
};

/**
 * Send a GET request
 *
 * @param {String} uri
 * @param {{}} [query]
 * @param {{}} [headers]
 */
Request.prototype.get = function (uri, query, headers) {
	const request = this;
	const apiUrl = store.getters.setting('API_URL');
	return request.buildHeaders(headers).then(function (response) {
		return axios.get(apiUrl + uri + request.buildQuery(query), {headers: response});
	});
};

/**
 * Send a PATCH request
 *
 * @param {String} uri
 * @param {{}} body
 * @param {{}} [headers]
 */
Request.prototype.patch = function (uri, body, headers) {
	const request = this;
	const apiUrl = store.getters.setting('API_URL');
	return request.buildHeaders(headers).then(function (response) {
		body = body || {};
		return axios.patch(apiUrl + uri, body, {headers: response});
	});
};

/**
 * Send a POST request
 *
 * @param {String} uri
 * @param {{}} [body]
 * @param {{}} [headers]
 */
Request.prototype.post = function (uri, body, headers) {
	const request = this;
	const apiUrl = store.getters.setting('API_URL');
	return request.buildHeaders(headers).then(function (response) {
		body = body || {};
		return axios.post(apiUrl + uri, body, {headers: response});
	});
};

/**
 * Build a query string
 *
 * @param {{}} query
 * @return {string}
 */
Request.prototype.buildQuery = function (query) {
	const params = [];
	if (query) {
		Object.keys(query).forEach(function (key) {
			if (query.hasOwnProperty(key)) {
				const value = encodeURIComponent(query[key]);
				params.push(key + '=' + value);
			}
		});
		return params.length ? '?' + params.join('&') : '';
	}
	return '';
};

/**
 * Build headers
 *
 * @param {{}} [headers]
 * @return {Promise}
 */
Request.prototype.buildHeaders = function (headers) {
	return new Promise(function (resolve, reject) {
		const cognitoUser = User.getCognitoUser();
		if (cognitoUser) {
			cognitoUser.getSession(function (err, session) {
				if (err) {
					return reject(new Error('failed to get session: ', err.message));
				}
				const token = session.getIdToken().getJwtToken();
				resolve(_.extend({}, {Authorization: token, 'Content-Type': 'application/json'}, headers));
			});
		} else {
			resolve(_.extend({}, {Authorization: '', 'Content-Type': 'application/json'}, headers));
		}
	});
};

export default Request;