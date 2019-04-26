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

const AWS = require('aws-sdk');

/**
 * SES constructor
 *
 * @constructor
 */
function SES() {
}

/**
 * Send email message via AWS SES
 *
 * @param {String} subject
 * @param {String} [bodyHtml]
 * @param {String} [bodyText]
 * @param {String} fromAddress
 * @param {Array} toAddresses
 * @param {Array} replyToAddresses
 * @return {Promise}
 */
SES.prototype.sendEmail = function (subject, bodyHtml, bodyText, fromAddress, toAddresses, replyToAddresses) {
	const awsSES = new AWS.SES();
	return new Promise(function (resolve, reject) {
		if (!bodyHtml && !bodyText) {
			reject(new Error('email must contain a body'));
		}

		const params = {
			Destination: {
				ToAddresses: toAddresses,
			},
			Message: {
				Body: {},
				Subject: {
					Data: subject,
				}
			},
			Source: fromAddress,
			ReplyToAddresses: replyToAddresses,
		};

		if (bodyHtml) {
			params.Message.Body.Html = {
				Charset: 'UTF-8',
				Data: bodyHtml
			}
		}

		if (bodyText) {
			params.Message.Body.Text = {
				Charset: 'UTF-8',
				Data: bodyText
			};
		}

		awsSES.sendEmail(params, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Verify an AWS SES sender email address
 *
 * @param {String} email
 * @return {Promise}
 */
SES.prototype.verifyEmailIdentity = function (email) {
	const awsSES = new AWS.SES();
	return new Promise(function (resolve, reject) {
		const params = {
			EmailAddress: email,
		};
		awsSES.verifyEmailIdentity(params, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * List AWS SES email address identities
 *
 * @return {Promise}
 */
SES.prototype.listIdentities = function () {
	const awsSES = new AWS.SES();
	return new Promise(function (resolve, reject) {
		const params = {
			IdentityType: 'EmailAddress'
		};
		awsSES.listIdentities(params, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Get AWS SES identity verification statuses
 *
 * @param {[]} identities
 * @return {Promise}
 */
SES.prototype.getIdentityVerificationAttributes = function (identities) {
	const awsSES = new AWS.SES();
	return new Promise(function (resolve, reject) {
		const params = {
			Identities: identities
		};
		awsSES.getIdentityVerificationAttributes(params, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Delete an AWS SES email address
 *
 * @param {String} identity
 * @return {Promise}
 */
SES.prototype.deleteIdentity = function (identity) {
	const awsSES = new AWS.SES();
	return new Promise(function (resolve, reject) {
		const params = {
			Identity: identity
		};
		awsSES.deleteIdentity(params, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Update an identity policy
 *
 * @param {String} identity
 * @param {String} policy
 * @param {String} policyName
 * @return {Promise}
 */
SES.prototype.updatePolicy = function (identity, policy, policyName) {
	const awsSES = new AWS.SES();
	return new Promise(function (resolve, reject) {
		const params = {
			Identity: identity,
			Policy: policy,
			PolicyName: policyName,
		};
		awsSES.putIdentityPolicy(params, function (err, data) {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
};

module.exports = SES;