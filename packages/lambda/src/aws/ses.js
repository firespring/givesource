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

const AWS = require('aws-sdk');
const Message = require('./../models/message');

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

module.exports = SES;