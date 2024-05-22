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

import * as _ from 'lodash'
import { getCognitoUser } from './user.js'
import axios from 'axios'
import store from './../store'

/**
 * Request constructor
 *
 * @constructor
 */
function Request () {
}

/**
 * Send a DELETE request
 *
 * @param {String} uri
 * @param {{}} [data]
 * @param {{}} [headers]
 */
Request.prototype.delete = function (uri, data, headers) {
  const request = this
  const apiUrl = store.getters.setting('API_URL')
  return request.buildHeaders(headers).then(function (response) {
    const config = data ? { data: data, headers: response } : { headers: response }
    store.commit('generateCacheKey')
    return axios.delete(apiUrl + uri, config)
  })
}

/**
 * Send a GET request
 *
 * @param {String} uri
 * @param {{}} [query]
 * @param {{}} [headers]
 */
Request.prototype.get = function (uri, query, headers) {
  const request = this
  const apiUrl = store.getters.setting('API_URL')
  return request.buildHeaders(headers).then(function (response) {
    return axios.get(apiUrl + uri + request.buildQuery(query), { headers: response })
  })
}

/**
 * Send a PATCH request
 *
 * @param {String} uri
 * @param {{}} body
 * @param {{}} [headers]
 */
Request.prototype.patch = function (uri, body, headers) {
  const request = this
  const apiUrl = store.getters.setting('API_URL')
  return request.buildHeaders(headers).then(function (response) {
    body = body || {}
    store.commit('generateCacheKey')
    return axios.patch(apiUrl + uri, body, { headers: response })
  })
}

/**
 * Send a POST request
 *
 * @param {String} uri
 * @param {{}} [body]
 * @param {{}} [headers]
 */
Request.prototype.post = function (uri, body, headers) {
  const request = this
  const apiUrl = store.getters.setting('API_URL')
  return request.buildHeaders(headers).then(function (response) {
    body = body || {}
    store.commit('generateCacheKey')
    return axios.post(apiUrl + uri, body, { headers: response })
  })
}

/**
 * Build a query string
 *
 * @param {{}} query
 * @return {string}
 */
Request.prototype.buildQuery = function (query) {
  const params = []
  query = query || {}

  if (!query.hasOwnProperty('c')) {
    query.c = store.getters.cacheKey
  }

  if (query) {
    Object.keys(query).forEach(function (key) {
      const value = encodeURIComponent(query[key])
      params.push(key + '=' + value)
    })
    return params.length ? '?' + params.join('&') : ''
  }
  return ''
}

/**
 * Build headers
 *
 * @param {{}} [headers]
 * @return {Promise}
 */
Request.prototype.buildHeaders = function (headers) {
  return new Promise(function (resolve, reject) {
    const cognitoUser = getCognitoUser()
    if (cognitoUser) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          return reject(new Error('failed to get session: ', err.message))
        }
        const token = session.getIdToken().getJwtToken()
        resolve(_.extend({}, { Authorization: token, 'Content-Type': 'application/json' }, headers))
      })
    } else {
      resolve(_.extend({}, { Authorization: '', 'Content-Type': 'application/json' }, headers))
    }
  })
}

export default Request
