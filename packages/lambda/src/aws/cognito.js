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
const randomstring = require('randomstring');

/**
 * Cognito constructor
 *
 * @constructor
 */
function Cognito() {
	this.awsCognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18', region: process.env.AWS_REGION});
}

/**
 * Create an AWS Cognito user pool
 *
 * @param {String} poolName
 * @param {String} snsCallerArn
 * @param {String} cognitoCustomMessageArn
 * @return {Promise}
 */
Cognito.prototype.createUserPool = function (poolName, snsCallerArn, cognitoCustomMessageArn) {
	const cognito = this;
	return new Promise(function (resolve, reject) {
		const params = cognito.buildUserPoolParameters(snsCallerArn, cognitoCustomMessageArn);
		params.PoolName = poolName;
		params.Schema = [
			{
				Name: 'email',
				StringAttributeConstraints: {
					MinLength: '0',
					MaxLength: '2048'
				},
				DeveloperOnlyAttribute: false,
				Required: true,
				AttributeDataType: 'String',
				Mutable: true
			}
		];
		params.AliasAttributes = ['email'];
		cognito.awsCognito.createUserPool(params, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve(result);
		});
	});
};

/**
 * Update an AWS Cognito user pool
 *
 * @param {String} userPoolId
 * @param {String} snsCallerArn
 * @param {String} cognitoCustomMessageArn
 * @return {Promise}
 */
Cognito.prototype.updateUserPool = function (userPoolId, snsCallerArn, cognitoCustomMessageArn) {
	const cognito = this;
	return new Promise(function (resolve, reject) {
		const params = cognito.buildUserPoolParameters(snsCallerArn, cognitoCustomMessageArn);
		params.UserPoolId = userPoolId;
		cognito.awsCognito.updateUserPool(params, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve(result);
		})
	})
};

/**
 * Delete an AWS Cognito user pool
 *
 * @param {String} userPoolId
 * @return {Promise}
 */
Cognito.prototype.deleteUserPool = function (userPoolId) {
	const cognito = this;
	return new Promise(function (resolve, reject) {
		cognito.awsCognito.deleteUserPool({UserPoolId: userPoolId}, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve(result);
		});
	});
};

/**
 * Describe an AWS Cognito user pool
 *
 * @param {String} userPoolId
 * @return {Promise}
 */
Cognito.prototype.describeUserPool = function (userPoolId) {
	const cognito = this;
	return new Promise(function (resolve, reject) {
		cognito.awsCognito.describeUserPool({UserPoolId: userPoolId}, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve(result.UserPool);
		});
	});
};

/**
 * Build the parameters for an AWS Cognito user pool
 *
 * @param {String} snsCallerArn
 * @param {String} cognitoCustomMessageArn
 * @return {{}}
 */
Cognito.prototype.buildUserPoolParameters = function (snsCallerArn, cognitoCustomMessageArn) {
	return {
		AdminCreateUserConfig: {
			AllowAdminCreateUserOnly: true,
			UnusedAccountValidityDays: 7,
		},
		AutoVerifiedAttributes: ['email'],
		LambdaConfig: {
			CustomMessage: cognitoCustomMessageArn
		},
		MfaConfiguration: 'OPTIONAL',
		Policies: {
			PasswordPolicy: {
				MinimumLength: 8,
				RequireLowercase: true,
				RequireNumbers: true,
				RequireSymbols: false,
				RequireUppercase: true
			}
		},
		SmsConfiguration: {
			SnsCallerArn: snsCallerArn,
			ExternalId: snsCallerArn
		}
	};
};

/**
 * Create an AWS Cognito user pool client
 *
 * @param {String} userPoolId
 * @param {String} clientName
 * @return {Promise}
 */
Cognito.prototype.createUserPoolClient = function (userPoolId, clientName) {
	const cognito = this;
	return new Promise(function (resolve, reject) {
		const params = {
			UserPoolId: userPoolId,
			ClientName: clientName
		};
		cognito.awsCognito.createUserPoolClient(params, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve(result);
		});
	});
};

/**
 * Create an group in the specific user pool.
 *
 * @param {String} userPoolId
 * @param {String} groupName
 * @param {String} roleArn
 * @return {Promise}
 */
Cognito.prototype.createCognitoGroup = function (userPoolId, groupName, roleArn) {
	const cognito = this;
	return new Promise(function (resolve, reject) {
		const params = {
			GroupName: groupName,
			UserPoolId: userPoolId,
			RoleArn: roleArn
		};
		cognito.awsCognito.createGroup(params, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve(result);
		});
	});
};

/**
 * Create an AWS Cognito user
 *
 * @param {String} userPoolId
 * @param {String} userName
 * @param {String} email
 * @return {Promise}
 */
Cognito.prototype.createUser = function (userPoolId, userName, email) {
	const cognito = this;
	return new Promise(function (resolve, reject) {
		cognito.generateToken().then(function (token) {
			const params = {
				UserPoolId: userPoolId,
				Username: userName,
				DesiredDeliveryMediums: ['EMAIL'],
				UserAttributes: [
					{
						Name: 'email',
						Value: email
					},
					{
						Name: 'email_verified',
						Value: 'true'
					}
				],
				TemporaryPassword: token
			};
			cognito.awsCognito.adminCreateUser(params, function (err, result) {
				if (err) {
					return reject(err);
				}
				resolve(result);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Delete an AWS Cognito user
 *
 * @param {String} userPoolId
 * @param {String} userName
 * @return {Promise}
 */
Cognito.prototype.deleteUser = function (userPoolId, userName) {
	const cognito = this;
	return new Promise(function (resolve, reject) {
		const params = {
			UserPoolId: userPoolId,
			Username: userName
		};
		cognito.awsCognito.adminDeleteUser(params, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve(result);
		});
	});
};

/**
 * Get a list of AWS Cognito User Groups for an AWS Cognito User
 *
 * @param {String} userPoolId
 * @param {String} userName
 * @return {Promise}
 */
Cognito.prototype.listGroupsForUser = function (userPoolId, userName) {
	const cognito = this;
	return new Promise(function (resolve, reject) {
		const params = {
			UserPoolId: userPoolId,
			Username: userName
		};
		cognito.awsCognito.adminListGroupsForUser(params, function (err, groups) {
			if (err) {
				return reject(err);
			}
			resolve(groups);
		});
	});
};

/**
 * Assign an AWS Cognito user to a AWS Cognito group
 *
 * @param {String} userPoolId
 * @param {String} userName
 * @param {String} groupName
 * @return {Promise}
 */
Cognito.prototype.assignUserToGroup = function (userPoolId, userName, groupName) {
	const cognito = this;
	return new Promise(function (resolve, reject) {
		const params = {
			UserPoolId: userPoolId,
			Username: userName,
			GroupName: groupName
		};
		cognito.awsCognito.adminAddUserToGroup(params, function (err, result) {
			if (err) {
				return reject(err);
			}
			resolve(result);
		});
	});
};

/**
 * Generate alphanumeric token
 *
 * @param {int} [retries]
 * @return {Promise}
 */
Cognito.prototype.generateToken = function (retries) {
	const cognito = this;
	return new Promise(function (resolve, reject) {
		retries = retries || 3;
		const token = randomstring.generate({
			length: 32,
			charset: 'alphanumeric'
		});

		if (/[a-z]/.test(token) && /[A-Z]/.test(token) && /[0-9]/.test(token)) {
			resolve(token);
		} else if (retries > 0) {
			retries = retries - 1;
			resolve(cognito.generateToken(retries));
		} else {
			reject(new Error('Failed to generate token'));
		}
	});
};

module.exports = Cognito;