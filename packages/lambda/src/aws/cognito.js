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

const AWS = require('aws-sdk')
const randomstring = require('randomstring')

/**
 * Cognito constructor
 *
 * @constructor
 */
function Cognito () {
}

/**
 * Create an AWS Cognito user pool
 *
 * @param {String} region
 * @param {String} poolName
 * @param {String} snsCallerArn
 * @param {String} cognitoCustomMessageArn
 * @return {Promise}
 */
Cognito.prototype.createUserPool = function (region, poolName, snsCallerArn, cognitoCustomMessageArn) {
  const cognito = this
  const awsCognito = new AWS.CognitoIdentityServiceProvider({ region: region })
  return new Promise(function (resolve, reject) {
    const params = cognito.buildUserPoolParameters(snsCallerArn, cognitoCustomMessageArn)
    params.PoolName = poolName
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
    ]
    params.AliasAttributes = ['email']
    awsCognito.createUserPool(params, function (err, result) {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

/**
 * Update an AWS Cognito user pool
 *
 * @param {String} region
 * @param {String} userPoolId
 * @param {String} snsCallerArn
 * @param {String} cognitoCustomMessageArn
 * @param {String} [fromEmailAddressArn]
 * @param {String} [replyToAddress]
 * @return {Promise}
 */
Cognito.prototype.updateUserPool = function (region, userPoolId, snsCallerArn, cognitoCustomMessageArn, fromEmailAddressArn, replyToAddress) {
  const cognito = this
  const awsCognito = new AWS.CognitoIdentityServiceProvider({ region: region })
  return new Promise(function (resolve, reject) {
    const params = cognito.buildUserPoolParameters(snsCallerArn, cognitoCustomMessageArn, fromEmailAddressArn, replyToAddress)
    params.UserPoolId = userPoolId
    awsCognito.updateUserPool(params, function (err, result) {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

/**
 * Delete an AWS Cognito user pool
 *
 * @param {String} region
 * @param {String} userPoolId
 * @return {Promise}
 */
Cognito.prototype.deleteUserPool = function (region, userPoolId) {
  const awsCognito = new AWS.CognitoIdentityServiceProvider({ region: region })
  return new Promise(function (resolve, reject) {
    awsCognito.deleteUserPool({ UserPoolId: userPoolId }, function (err, result) {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

/**
 * Describe an AWS Cognito user pool
 *
 * @param {String} region
 * @param {String} userPoolId
 * @return {Promise}
 */
Cognito.prototype.describeUserPool = function (region, userPoolId) {
  const awsCognito = new AWS.CognitoIdentityServiceProvider({ region: region })
  return new Promise(function (resolve, reject) {
    awsCognito.describeUserPool({ UserPoolId: userPoolId }, function (err, result) {
      if (err) {
        return reject(err)
      }
      resolve(result.UserPool)
    })
  })
}

/**
 * Build the parameters for an AWS Cognito user pool
 *
 * @param {String} snsCallerArn
 * @param {String} cognitoCustomMessageArn
 * @param {String} [fromEmailAddressArn]
 * @param {String} [replyToAddress]
 * @return {{}}
 */
Cognito.prototype.buildUserPoolParameters = function (snsCallerArn, cognitoCustomMessageArn, fromEmailAddressArn, replyToAddress) {
  const params = {
    AdminCreateUserConfig: {
      AllowAdminCreateUserOnly: true,
      UnusedAccountValidityDays: 7
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
  }

  if (fromEmailAddressArn || replyToAddress) {
    params.EmailConfiguration = {}

    if (fromEmailAddressArn) {
      params.EmailConfiguration.SourceArn = fromEmailAddressArn
    }

    if (replyToAddress) {
      params.EmailConfiguration.ReplyToEmailAddress = replyToAddress
    }
  }

  return params
}

/**
 * Create an AWS Cognito user pool client
 *
 * @param {String} region
 * @param {String} userPoolId
 * @param {String} clientName
 * @return {Promise}
 */
Cognito.prototype.createUserPoolClient = function (region, userPoolId, clientName) {
  const awsCognito = new AWS.CognitoIdentityServiceProvider({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      UserPoolId: userPoolId,
      ClientName: clientName
    }
    awsCognito.createUserPoolClient(params, function (err, result) {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

/**
 * Create an group in the specific user pool.
 *
 * @param {String} region
 * @param {String} userPoolId
 * @param {String} groupName
 * @param {String} roleArn
 * @return {Promise}
 */
Cognito.prototype.createCognitoGroup = function (region, userPoolId, groupName, roleArn) {
  const awsCognito = new AWS.CognitoIdentityServiceProvider({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      GroupName: groupName,
      UserPoolId: userPoolId,
      RoleArn: roleArn
    }
    awsCognito.createGroup(params, function (err, result) {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

/**
 * Create an AWS Cognito user
 *
 * @param {String} region
 * @param {String} userPoolId
 * @param {String} userName
 * @param {String} email
 * @param {Boolean} [resendEmail]
 *
 * @return {Promise}
 */
Cognito.prototype.createUser = function (region, userPoolId, userName, email, resendEmail) {
  const cognito = this
  const awsCognito = new AWS.CognitoIdentityServiceProvider({ region: region })
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
      }

      if (resendEmail) {
        params.MessageAction = 'RESEND'
      }

      awsCognito.adminCreateUser(params, function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    }).catch(function (err) {
      reject(err)
    })
  })
}

/**
 * Delete an AWS Cognito user
 *
 * @param {String} region
 * @param {String} userPoolId
 * @param {String} userName
 * @return {Promise}
 */
Cognito.prototype.deleteUser = function (region, userPoolId, userName) {
  const awsCognito = new AWS.CognitoIdentityServiceProvider({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      UserPoolId: userPoolId,
      Username: userName
    }
    awsCognito.adminDeleteUser(params, function (err, result) {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

/**
 * Get a list of AWS Cognito User Groups for an AWS Cognito User
 *
 * @param {String} region
 * @param {String} userPoolId
 * @param {String} userName
 * @return {Promise}
 */
Cognito.prototype.listGroupsForUser = function (region, userPoolId, userName) {
  const awsCognito = new AWS.CognitoIdentityServiceProvider({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      UserPoolId: userPoolId,
      Username: userName
    }
    awsCognito.adminListGroupsForUser(params, function (err, groups) {
      if (err) {
        return reject(err)
      }
      resolve(groups)
    })
  })
}

/**
 * Assign an AWS Cognito user to a AWS Cognito group
 *
 * @param {String} region
 * @param {String} userPoolId
 * @param {String} userName
 * @param {String} groupName
 * @return {Promise}
 */
Cognito.prototype.assignUserToGroup = function (region, userPoolId, userName, groupName) {
  const awsCognito = new AWS.CognitoIdentityServiceProvider({ region: region })
  return new Promise(function (resolve, reject) {
    const params = {
      UserPoolId: userPoolId,
      Username: userName,
      GroupName: groupName
    }
    awsCognito.adminAddUserToGroup(params, function (err, result) {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

/**
 * Generate alphanumeric token
 *
 * @param {int} [retries]
 * @return {Promise}
 */
Cognito.prototype.generateToken = function (retries) {
  const cognito = this
  return new Promise(function (resolve, reject) {
    retries = retries || 3
    const token = randomstring.generate({
      length: 32,
      charset: 'alphanumeric'
    })

    if (/[a-z]/.test(token) && /[A-Z]/.test(token) && /[0-9]/.test(token)) {
      resolve(token)
    } else if (retries > 0) {
      retries = retries - 1
      resolve(cognito.generateToken(retries))
    } else {
      reject(new Error('Failed to generate token'))
    }
  })
}

module.exports = Cognito
