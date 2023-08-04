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

const DonationsRepository = require('./../../repositories/donations')
const HttpException = require('./../../exceptions/http')
const Request = require('./../../aws/request')
const SettingHelper = require('./../../helpers/setting')
const SettingsRepository = require('./../../repositories/settings')
const UserGroupMiddleware = require('./../../middleware/userGroup')

exports.handle = function (event, context, callback) {
  const repository = new DonationsRepository()
  const settingsRepository = new SettingsRepository()
  const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']))
  const findAllAndCountParams = {}

  let total = 0
  let items = []
  const size = request.queryParam('size', 10)
  const sort = request.queryParam('sort', null)
  const start = request.queryParam('start', 0)

  request.validate().then(function () {
    return settingsRepository.get(SettingHelper.SETTING_TEST_PAYMENTS_DISPLAY).catch(function () {
      return Promise.resolve({})
    })
  }).then(function (response) {
    findAllAndCountParams.limit = parseInt(size)
    findAllAndCountParams.order = [['createdAt', 'DESC']]
    findAllAndCountParams.offset = parseInt(start)
    findAllAndCountParams.where = [getHashCondition(response)]
    return repository.queryDonations(findAllAndCountParams)
  }).then(function (response) {
    total = response.count
    items = response.rows
    callback(null, {
      items: items,
      size: size,
      sort: sort,
      start: start,
      total: total
    })
  }).catch(function (err) {
    console.log(err);
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}

/**
 * Get hash condition
 *
 * @param response
 * @return {*}
 */
const getHashCondition = function (response) {
  if (parseInt(response.value) === 0) {
    return { paymentTransactionIsTestMode: 0 }
  }
  return {}
}
