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

const Cognito = require('./../../aws/cognito')
const HttpException = require('./../../exceptions/http')
const Request = require('./../../aws/request')
const SES = require('./../../aws/ses')
const UserGroupMiddleware = require('./../../middleware/userGroup')

exports.handle = function (event, context, callback) {
  const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin'])).parameters(['email'])
  const cognito = new Cognito()
  const ses = new SES()

  const cognitoCustomMessageArn = process.env.COGNITO_CUSTOM_MESSAGE_FUNCTION_ARN
  const snsCallerRoleArn = process.env.COGNITO_SNS_CALLER_ROLE_ARN
  const fromEmailAddressArn = `arn:aws:ses:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:identity/${request.get('email')}`
  const policy = {
    Version: '2008-10-17',
    Statement: [
      {
        Sid: 'stmnt' + new Date().getTime(),
        Effect: 'Allow',
        Principal: {
          Service: 'cognito-idp.amazonaws.com'
        },
        Action: [
          'ses:SendEmail',
          'ses:SendRawEmail'
        ],
        Resource: fromEmailAddressArn
      }
    ]
  }

  request.validate().then(function () {
    return ses.updatePolicy(fromEmailAddressArn, JSON.stringify(policy), process.env.AWS_STACK_NAME + '-SendEmailPolicy')
  }).then(function () {
    return cognito.updateUserPool(process.env.AWS_REGION, process.env.USER_POOL_ID, snsCallerRoleArn, cognitoCustomMessageArn, fromEmailAddressArn)
  }).then(function () {
    callback()
  }).catch(function (err) {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}
