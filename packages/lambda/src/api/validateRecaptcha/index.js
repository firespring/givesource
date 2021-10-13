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

const axios = require('axios')
const SSM = require('./../../aws/ssm')

export async function handle (event, context, callback) {
  const ssm = new SSM()
  const reCapUrl = 'https://www.google.com/recaptcha/api/siteverify'

  // verify the result by POSTing to google backend with secret and
  // frontend recaptcha token as payload
  try {
    const reCaptchaSecret = await ssm.getParameter('us-east-1', '/recaptcha/secure/recaptcha-key', true)
    let verifyResult = await axios({
      method: 'post',
      url: reCapUrl,
      params: {
        secret: reCaptchaSecret.Parameter.Value,
        response: event.body.recaptchaToken
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*'
      }
    })
    callback(null, { statusCode: verifyResult.status, message: 'Success.' })
  } catch (e) {
    callback({
      statusCode: 500,
      errorMessage: 'Oops, something went wrong on our side.'
    })
  }
}