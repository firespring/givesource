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

const UserAuthorizer = require('./../../auth/user')
const logger = require("../../helpers/log");

exports.handle = function (event, context, callback) {
  if (context && context.functionName) {
    logger.log(`${context.functionName} event: %j`, event)
  }

  const arn = event.methodArn
  const region = process.env.REGION
  const token = event.authorizationToken
  const userPoolId = process.env.USER_POOL_ID

  const authorizer = new UserAuthorizer(arn, region, token, userPoolId)
  authorizer.authorize().then(function (policy) {
    callback(null, policy)
  }).catch(function () {
    callback(new Error('Unauthorized'))
  })
}
