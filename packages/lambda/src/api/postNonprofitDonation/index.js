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

exports.handle = function handle (event, context, callback) {
  const donationsRepository = new DonationsRepository()
  const lambda = new Lambda()
  const request = new Request(event, context).middleware(new UserGroupMiddleware(['SuperAdmin', 'Admin']))

  let donation
  request.validate().then(() => {
    return donationsRepository.populate(request._body)
  }).then((populatedDonation) => {
    donation = populatedDonation
    donation.nonprofitId = request.urlParam('nonprofit_id')
    return DonationHelper.getFeeRates(donation.isOfflineDonation)
  }).then((rates) => {
    donation.fees = DonationHelper.calculateFees(donation.isOfflineDonation, donation.isFeeCovered, donation.subtotal, rates.flatRate, rates.percent)
    donation.total = donation.isFeeCovered ? (donation.subtotal + donation.fees) : donation.subtotal
    donation.amountForNonprofit = donation.total - donation.fees
    donation.subtotalChargedToCard = donation.isOfflineDonation ? 0 : donation.total
  }).then(() => {
    return donationsRepository.upsert(donation, {})
  }).then(() => {
    return lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiGatewayFlushCache', {}, 'RequestResponse')
  }).then(() => {
    callback(null, donation)
  }).catch((err) => {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}
