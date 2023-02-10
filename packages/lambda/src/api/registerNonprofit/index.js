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
const Lambda = require('./../../aws/lambda')
const NonprofitHelper = require('./../../helpers/nonprofit')
const NonprofitsRepository = require('./../../repositories/nonprofits')
const Request = require('./../../aws/request')
const UsersRepository = require('./../../repositories/users')

exports.handle = function (event, context, callback) {
  const lambda = new Lambda()
  const nonprofitsRepository = new NonprofitsRepository()
  const usersRepository = new UsersRepository()

  const request = new Request(event, context).parameters(['nonprofit', 'user'])

  let user
  let nonprofit
  request.validate().then(function () {
    return nonprofitsRepository.populate(request.get('nonprofit'))
  }).then(function (populatedNp) {
    nonprofit = populatedNp
    nonprofit.status = NonprofitHelper.STATUS_PENDING
    return usersRepository.populate(request.get('user'))
  }).then(function (populatedUser) {
    user = populatedUser
    const data = {}
    const dataNonprofitAgreements = request.get('nonprofit').NonprofitAgreements
    if (dataNonprofitAgreements) {
      data.NonprofitAgreements = dataNonprofitAgreements
    }
    return nonprofitsRepository.upsert(nonprofit, data)
  }).then(function (nonprofit) {
    return usersRepository.upsert(user, { nonprofitId: nonprofit.id })
  }).then(function () {
    lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SendRegistrationPendingEmail', { body: { email: user.email } })
  }).then(function () {
    callback(null, {
      nonprofit: nonprofit,
      user: user
    })
  }).catch(function (err) {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}
