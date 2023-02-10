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

const logger = require('./../helpers/log')
const Middleware = require('./../middleware/middleware')
const MissingRequiredHeaderException = require('./../exceptions/missingRequiredHeader')
const MissingRequiredParameter = require('./../exceptions/missingRequiredParameter')
const MissingRequiredQueryParameterException = require('./../exceptions/missingRequiredQueryParameter')

/**
 * Request constructor
 *
 * @param {{}} event
 * @param {{}} context
 *
 * @constructor
 */
function Request (event, context) {
  this.context = context
  this._requiredParameters = []
  this._requiredQueryParameters = []
  this._requiredHeaders = []

  if (this.context && this.context.hasOwnProperty('functionName')) {
    logger.log(`${this.context.functionName} event: %j`, event)
  }

  this._middleware = []
  this._populateRequest(event)
}

/**
 * Add Request middleware
 */
Request.prototype.middleware = function (middleware) {
  if (middleware instanceof Middleware) {
    this._middleware.push(middleware)
  }
  return this
}

/**
 * Process Request middleware
 *
 * @return {Promise}
 */
Request.prototype._processMiddleware = function () {
  const request = this

  let promise = Promise.resolve()
  request._middleware.forEach(function (middleware) {
    promise = promise.then(function () {
      middleware.prepare(request.user())
      return middleware.handle()
    })
  })

  return promise
}

/**
 * Build this Request
 *
 * @param {{}} event
 * @private
 */
Request.prototype._populateRequest = function (event) {
  this.method = (event.hasOwnProperty('method')) ? event.method : null

  this._body = (event.hasOwnProperty('body')) ? event.body : {}
  this._headers = (event.hasOwnProperty('headers')) ? event.headers : {}
  this._queryParameters = (event.hasOwnProperty('query')) ? event.query : {}
  this._urlParameters = (event.hasOwnProperty('params')) ? event.params : {}
  this._user = (event.hasOwnProperty('user')) ? event.user : null

  return this
}

/**
 * Set this Request's required body parameters
 *
 * @param {[]} keys
 * @return {Request}
 */
Request.prototype.parameters = function (keys) {
  this._requiredParameters = keys
  return this
}

/**
 * Set this Request's required query parameters
 *
 * @param {[]} keys
 * @return {Request}
 */
Request.prototype.queryParameters = function (keys) {
  this._requiredQueryParameters = keys
  return this
}

/**
 * Set this Request's required headers
 *
 * @param {[]} keys
 * @return {Request}
 */
Request.prototype.headers = function (keys) {
  this._requiredHeaders = keys
  return this
}

/**
 * Validate the Request
 *
 * @return {Promise}
 */
Request.prototype.validate = function () {
  const request = this
  return new Promise(function (resolve, reject) {
    for (const i in request._requiredParameters) {
      const key = request._requiredParameters[i]
      if (!request._body.hasOwnProperty(key)) {
        return reject(new MissingRequiredParameter('Missing required parameter: ' + key))
      }
    }
    for (const i in request._requiredQueryParameters) {
      const key = request._requiredQueryParameters[i]
      if (!request._queryParameters.hasOwnProperty(key)) {
        return reject(new MissingRequiredQueryParameterException('Missing required query parameter: ' + key))
      }
    }
    for (const i in request._requiredHeaders) {
      const key = request._requiredHeaders[i]
      if (!request._headers.hasOwnProperty(key)) {
        return reject(new MissingRequiredHeaderException('Missing required header: ' + key))
      }
    }
    request._processMiddleware().then(function () {
      resolve()
    }).catch(function (err) {
      reject(err)
    })
  })
}

/**
 * Find a value from this Request
 *
 * @param {String} key
 * @param {*} [defaultValue]
 * @return {*}
 */
Request.prototype.find = function (key, defaultValue) {
  if (this.get(key) !== null) {
    return this.get(key)
  } else if (this.urlParam(key) !== null) {
    return this.urlParam(key)
  } else if (this.queryParam(key) !== null) {
    return this.queryParam(key)
  } else if (this.header(key) !== null) {
    return this.header(key)
  } else if (defaultValue !== undefined) {
    return defaultValue
  } else {
    return null
  }
}

/**
 * Get a value from this Request's body
 *
 * @param {String} key
 * @param {*} [defaultValue]
 * @return {*|null}
 */
Request.prototype.get = function (key, defaultValue) {
  if (this._body.hasOwnProperty(key)) {
    return this._body[key]
  }
  return (defaultValue !== undefined) ? defaultValue : null
}

/**
 * Get a value from this Request's url parameters
 *
 * @param {String} key
 * @param {*} [defaultValue]
 * @return {*|null}
 */
Request.prototype.urlParam = function (key, defaultValue) {
  if (this._urlParameters.hasOwnProperty(key)) {
    return this._urlParameters[key]
  }
  return (defaultValue !== undefined) ? defaultValue : null
}

/**
 * Get a value from this Request's query parameters
 *
 * @param {String} key
 * @param {*} [defaultValue]
 * @return {*|null}
 */
Request.prototype.queryParam = function (key, defaultValue) {
  if (this._queryParameters.hasOwnProperty(key)) {
    return this._queryParameters[key]
  }
  return (defaultValue !== undefined) ? defaultValue : null
}

/**
 * Get request query parameters
 *
 * @param {[]} keys
 * @return {*}
 */
Request.prototype.queryParams = function (keys) {
  const request = this
  if (Array.isArray(keys) && keys.length) {
    const results = {}
    Object.keys(request._queryParameters).forEach(function (key) {
      if (keys.indexOf(key) > -1) {
        results[key] = request._queryParameters[key]
      }
    })
    return results
  }
  return request._queryParameters
}

/**
 * Get all request query parameters except
 *
 * @param {[]} [keys]
 * @return {{}}
 */
Request.prototype.queryParamsExcept = function (keys) {
  const request = this

  const except = {}
  Object.keys(request._queryParameters).forEach(function (key) {
    if (keys.indexOf(key) < 0) {
      except[key] = request._queryParameters[key]
    }
  })
  return except
}

/**
 * Get a value from this Request's headers
 *
 * @param {String} key
 * @param {*} [defaultValue]
 * @return {*|null}
 */
Request.prototype.header = function (key, defaultValue) {
  if (this._headers.hasOwnProperty(key)) {
    return this._headers[key]
  }
  return (defaultValue !== undefined) ? defaultValue : null
}

/**
 * Get the user from the request
 *
 * @return {{}|null}
 */
Request.prototype.user = function () {
  return this._user
}

module.exports = Request
