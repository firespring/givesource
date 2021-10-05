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

const DonationHelper = require('./../../helpers/donation')
const HttpException = require('./../../exceptions/http')
const Lambda = require('./../../aws/lambda')
const DonationsRepository = require('./../../repositories/donations')
const Request = require('./../../aws/request')
const UserGroupMiddleware = require('./../../middleware/userGroup')

export function handle (event, context, callback) {
  const donationsRepository = new DonationsRepository()
  const lambda = new Lambda()
  const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']))

  let donations = []
  let donorId
  request.validate().then(() => {
    donorId = request.get('donorId', 0)
    let promise = Promise.resolve()
    request.get('donations', []).forEach((donation) => {
      promise = promise.then(function () {
        return donationsRepository.populate(donation)
      }).then(donation => {
        donations.push(donation)
      })
    })
    return promise
  }).then(() => {
    let donationValues = []
    donations.forEach(function (donation) {
      donationValues.push(DonationHelper.formatForBulkCreate(donation, {
        donorId: donorId,
        amountForNonprofit: donation.total
      }))
    })
    return donationsRepository.bulkCreateDonations(donationValues)
  }).then(() => {
    return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache', {}, 'RequestResponse')
  }).then(() => {
    callback(null, donations)
  }).catch((err) => {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}