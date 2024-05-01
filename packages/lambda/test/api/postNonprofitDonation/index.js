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

// const assert = require('assert')
// const promiseMe = require('mocha-promise-me')
// const HttpException = require('./../../../src/exceptions/http')
// const PostNonprofitDonation = require('../../../src/api/postNonprofitDonation/index')
// // const NonprofitDonationsRepository = require('../../../src/repositories/nonprofitDonations')
// const sinon = require('sinon')
// const TestHelper = require('../../helpers/test')
// const DonationsRepository = require('../../../src/repositories/donations')
// const SettingsRepository = require('../../../src/repositories/settings')
//
// describe('PostNonprofitDonation', function () {
//   it('should return a donation', async function () {
//     const model = {}
//     const body = { someUpdatedParam: 'updated' }
//     sinon.stub(DonationsRepository.prototype, 'populate').resolves(model)
//     sinon.stub(DonationsRepository.prototype, 'upsert').resolves(model)
//     sinon.stub(SettingsRepository.prototype, 'batchGet')
//
//     const result = await TestHelper.callApi(PostNonprofitDonation, {}, null, { body })
//     assert(result === model)
//     assert(upsertStub.withArgs(model, body).callCount === 1)
//     // const nonprofit = TestHelper.generate.model('nonprofit')
//     // const model = TestHelper.generate.model('donation', { nonprofitUuid: nonprofit.uuid })
//     // sinon.stub(NonprofitDonationsRepository.prototype, 'save').resolves(model)
//     // const { uuid, createdAt, ...body } = model
//     // const params = {
//     //   body,
//     //   params: {
//     //     nonprofit_uuid: nonprofit.uuid
//     //   }
//     // }
//     // return PostNonprofitDonation.handle(params, null, function (error, result) {
//     //   assert(error === null)
//     //   TestHelper.assertModelEquals(result, model, ['uuid', 'createdAt'])
//     // })
//   })
//
//   // it('should return error on exception thrown', function () {
//   //   sinon.stub(NonprofitDonationsRepository.prototype, 'save').rejects('Error')
//   //   return PostNonprofitDonation.handle({}, null, function (error) {
//   //     assert(error instanceof HttpException)
//   //   })
//   // })
// })
