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

const HttpException = require('./../../exceptions/http')
const Request = require('./../../aws/request')
const SettingsRepository = require('./../../repositories/settings')
const SSM = require('../../aws/ssm')

exports.handle = function (event, context, callback) {
  const repository = new SettingsRepository()
  const request = new Request(event, context)
  const keys = request.queryParam('keys', '').split(',')
  const ssm = new SSM()

  request.validate().then(function () {
    if (keys.length) {
      return repository.batchGet(keys)
    } else {
      return repository.getAll()
    }
  }).then(async function (settings) {
    const keysToFetch = [];
    if (keys.includes('PAYMENT_SPRING_PUBLIC_API_KEY')) keysToFetch.push('/Firespring/paymentKey/public_key');
    if (keys.includes('PAYMENT_SPRING_TEST_PUBLIC_API_KEY')) keysToFetch.push('/Firespring/paymentKey/test_public_key');
    if (keysToFetch.length > 0) {
      try {
        const data = await ssm.getParameters(process.env.AWS_REGION, keysToFetch)
        const populatePromises = data.Parameters.map(async (param) => {
          const setting = await repository.populate({key: param.Name, value: param.Value})
          console.log(setting) // DM: Debug
          settings.push(setting)
        })
        await Promise.all(populatePromises)
        console.log('finishing off') // DM: Debug
        callback(null, settings)
      } catch (err) {
        (err instanceof HttpException) ? callback(err.context(context)) : callback(err);
      }
    } else {
      callback(null, settings)
    }
  }).catch(function (err) {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}
