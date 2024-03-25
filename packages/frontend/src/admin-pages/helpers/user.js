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

import { useAdminStore } from "../store";

const AmazonCognitoIdentity = require('amazon-cognito-identity-js')

/**
 * Login CognitoUser
 *
 * @param {String} username
 * @param {String} password
 * @param {{}} callbacks
 */
const login = function (username, password, callbacks) {
  const store = useAdminStore()
  const data = {
    UserPoolId: store.setting('USER_POOL_ID'),
    ClientId: store.setting('USER_POOL_CLIENT_ID')
  }
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(data)
  const userData = {
    Username: username,
    Pool: userPool
  }
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
  const authenticationData = {
    Username: username,
    Password: password
  }
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData)
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      if (callbacks.hasOwnProperty('onSuccess') && typeof callbacks.onSuccess === 'function') {
        callbacks.onSuccess(result)
      }
    },
    onFailure: function (err) {
      if (callbacks.hasOwnProperty('onFailure') && typeof callbacks.onFailure === 'function') {
        callbacks.onFailure(err)
      }
    },
    mfaRequired: function (codeDeliveryDetails) {
      if (callbacks.hasOwnProperty('mfaRequired') && typeof callbacks.mfaRequired === 'function') {
        callbacks.mfaRequired(codeDeliveryDetails, cognitoUser)
      }
    },
    newPasswordRequired: function (userAttributes, requiredAttributes) {
      if (callbacks.hasOwnProperty('newPasswordRequired') && typeof callbacks.newPasswordRequired === 'function') {
        callbacks.newPasswordRequired(userAttributes, requiredAttributes, cognitoUser)
      }
    }
  })
}

/**
 * Change user password
 *
 * @param {String} oldPassword
 * @param {String} newPassword
 * @param {function} callback
 */
const changePassword = function (oldPassword, newPassword, callback) {
  const cognitoUser = this.getCognitoUser()
  if (cognitoUser) {
    cognitoUser.getSession(function (err, response) {
      if (err) {
        callback(err)
      } else {
        cognitoUser.changePassword(oldPassword, newPassword, callback)
      }
    })
  } else {
    callback(new Error('User not authenticated'))
  }
}

/**
 * Forgot Password workflow
 *
 * @param {String} username
 * @param {{}} callbacks
 */
const forgotPassword = function (username, callbacks) {
  const store = useAdminStore()
  const data = {
    UserPoolId: store.setting('USER_POOL_ID'),
    ClientId: store.setting('USER_POOL_CLIENT_ID')
  }
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(data)
  const userData = {
    Username: username,
    Pool: userPool
  }
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
  cognitoUser.forgotPassword({
    onSuccess: function (result) {
      if (callbacks.hasOwnProperty('onSuccess') && typeof callbacks.onSuccess === 'function') {
        callbacks.onSuccess(result, cognitoUser)
      }
    },
    onFailure: function (err) {
      if (callbacks.hasOwnProperty('onFailure') && typeof callbacks.onFailure === 'function') {
        callbacks.onFailure(err)
      }
    }
  })
}

/**
 * Forgot password reset workflow
 *
 * @param {String} username
 * @param {String} code
 * @param {String} password
 * @param {{}} callbacks
 */
const resetPassword = function (username, code, password, callbacks) {
  const store = useAdminStore()
  const data = {
    UserPoolId: store.setting('USER_POOL_ID'),
    ClientId: store.setting('USER_POOL_CLIENT_ID')
  }
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(data)
  const userData = {
    Username: username,
    Pool: userPool
  }
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
  cognitoUser.confirmPassword(code, password, {
    onSuccess: function (result) {
      if (callbacks.hasOwnProperty('onSuccess') && typeof callbacks.onSuccess === 'function') {
        callbacks.onSuccess(result, cognitoUser)
      }
    },
    onFailure: function (err) {
      if (callbacks.hasOwnProperty('onFailure') && typeof callbacks.onFailure === 'function') {
        callbacks.onFailure(err)
      }
    }
  })
}

/**
 * Is CognitoUser authenticated?
 *
 * @return {boolean}
 */
const isAuthenticated = function () {
  let authenticated = false
  const cognitoUser = this.getCognitoUser()
  if (cognitoUser) {
    cognitoUser.getSession(function (err, session) {
      if (err) {
        console.log(err)
      }
      if (session && session.isValid()) {
        authenticated = true
      }
    })
  }
  return authenticated
}

/**
 * Refresh CognitoUser session
 *
 * @param {function} callback
 */
const refreshSession = function (callback) {
  const cognitoUser = this.getCognitoUser()
  if (cognitoUser) {
    cognitoUser.getSession(function (err, session) {
      if (err) {
        console.log(err)
      }
      if (session) {
        cognitoUser.refreshSession(session.getRefreshToken(), callback)
      }
    })
  } else {
    callback(new Error('Could not retrieve user'))
  }
}

/**
 * Log out CognitoUser
 */
const logout = function () {
  const cognitoUser = this.getCognitoUser()
  if (cognitoUser) {
    cognitoUser.signOut()
  }
}

/**
 * Get the CognitoUser
 *
 * @return {CognitoUser|null}
 */
const getCognitoUser = function () {
  const store = useAdminStore()
  const userPoolData = {
    UserPoolId: store.setting('USER_POOL_ID'),
    ClientId: store.setting('USER_POOL_CLIENT_ID')
  }
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData)
  return userPool.getCurrentUser()
}

/**
 * Format Cognito error message
 *
 * @param {Error} err
 * @returns {String}
 */
const formatCognitoErrorMessage = function (err) {
  // Make Cognito error message consistent with the Cognito errors that are returned in other areas.
  if (err.name === 'InvalidParameterException' && err.message.includes('Member must have length')) {
    return 'Password does not conform to policy: Password not long enough'
  }
  return err.message
}

export {
  login,
  logout,
  isAuthenticated,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshSession,
  getCognitoUser,
  formatCognitoErrorMessage
}
