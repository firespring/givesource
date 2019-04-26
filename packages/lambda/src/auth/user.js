/*
 * Copyright 2019 Firespring, Inc.
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

const Authorizer = require('./authorizer');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

/**
 * UserAuthorizer constructor
 *
 * @param {String} arn
 * @param {String} region
 * @param {String} token
 * @param {String} userPoolId
 * @constructor
 */
function UserAuthorizer(arn, region, token, userPoolId) {
	Authorizer.call(this, arn);
	this.issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
	this.pems = null;
	this.token = token;
}

/**
 * Extend the base Authorizer
 *
 * @type {Authorizer}
 */
UserAuthorizer.prototype = new Authorizer();

/**
 * Get PEMs
 *
 * @return {Promise}
 */
UserAuthorizer.prototype.getPems = function () {
	const authorizer = this;
	return new Promise(function (resolve, reject) {
		if (!authorizer.pems) {
			axios.get(authorizer.issuer + '/.well-known/jwks.json').then(function (response) {
				if (response.data.hasOwnProperty('keys')) {
					authorizer.pems = {};
					response.data.keys.forEach(function (key) {
						const jwk = {kty: key.kty, n: key.n, e: key.e};
						authorizer.pems[key.kid] = jwkToPem(jwk);
					});
					resolve();
				} else {
					reject();
				}
			}).catch(function (err) {
				reject(err);
			});
		} else {
			resolve();
		}
	});
};

/**
 * Validate token
 *
 * @return {Promise}
 */
UserAuthorizer.prototype.validateToken = function () {
	const authorizer = this;
	return new Promise(function (resolve, reject) {
		const decodedJwt = jwt.decode(authorizer.token, {complete: true});

		// Fail if token is not jwt
		if (!decodedJwt) {
			return reject(new Error('Not a valid JWT token'));
		}

		// Fail if token is not from expected User Pool
		if (decodedJwt.payload.iss !== authorizer.issuer) {
			return reject(new Error('Invalid issuer'));
		}

		// Reject the jwt if it's not an ID token
		if (decodedJwt.payload.token_use !== 'id') {
			return reject(new Error('Not an id token'));
		}

		// Get the kid from the token and retrieve corresponding PEM
		const kid = decodedJwt.header.kid;
		const pem = authorizer.pems[kid];
		if (!pem) {
			return reject(new Error('Invalid id token'));
		}

		// verify the signature of the JWT token to ensure it's really coming from expected User Pool
		jwt.verify(authorizer.token, pem, {issuer: authorizer.issuer}, function (err, decoded) {
			if (err) {
				return reject(err);
			}
			authorizer.payload = decoded;
			authorizer.principalId = decoded.sub;
			resolve();
		});
	});
};

/**
 * Authorize request
 *
 * @return {Promise}
 */
UserAuthorizer.prototype.authorize = function () {
	const authorizer = this;
	return new Promise(function (resolve, reject) {
		authorizer.getPems().then(function () {
			return authorizer.validateToken();
		}).then(function () {
			return authorizer.issueAuthPolicy(true);
		}).then(function (policy) {
			const user = {
				groups: authorizer.payload['cognito:groups'],
				uuid: authorizer.payload['cognito:username'],
			};
			policy.context = {user: JSON.stringify(user, null, 2)};
			resolve(policy);
		}).catch(function () {
			reject(authorizer.issueAuthPolicy(false));
		});
	});
};

module.exports = UserAuthorizer;