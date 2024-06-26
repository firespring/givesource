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
// const sinon = require('sinon')
// const PatchNonprofitDonation = require('../../../src/api/patchNonprofitDonation/index')
// const NonprofitsRepository = require('../../../src/repositories/nonprofits')
// const NonprofitDonationsRepository = require('../../../src/repositories/nonprofitDonations')
// const TestHelper = require('../../helpers/test')
//
// describe('PatchNonprofitDonation', function () {
//   // todo...
//   // it('should return an updated nonprofit donation', async function () {
//   //   const nonprofit = await TestHelper.generate.model('nonprofit')
//   //   const original = await TestHelper.generate.model('donation', { nonprofitUuid: nonprofit.uuid })
//   //   const updated = await TestHelper.generate.model('donation', { uuid: original.uuid, nonprofitUuid: nonprofit.uuid })
//   //   sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
//   //   sinon.stub(NonprofitDonationsRepository.prototype, 'get').resolves(original)
//   //   const upsertStub = sinon.stub(NonprofitDonationsRepository.prototype, 'upsert').resolves(updated)
//   //
//   //   const body = { someUpdatedParam: 'updated' }
//   //   const result = await TestHelper.callApi(PatchNonprofitDonation, {}, null, { body })
//   //   assert(result === updated)
//   //   assert(upsertStub.withArgs(original, body).callCount === 1)
//   // })
//   //
//   // it('should return error on exception thrown - get', async function () {
//   //   const nonprofit = await TestHelper.generate.model('nonprofit')
//   //   const original = await TestHelper.generate.model('donation', { nonprofitUuid: nonprofit.uuid })
//   //   const params = {
//   //     params: {
//   //       nonprofitUuid: nonprofit.uuid,
//   //       donationUuid: original.uuid
//   //     }
//   //   }
//   //   sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
//   //   sinon.stub(NonprofitDonationsRepository.prototype, 'get').rejects(errorStub)
//   //   sinon.stub(NonprofitDonationsRepository.prototype, 'save').resolves(original)
//   //   return PatchNonprofitDonation.handle(params, null, function (error, result) {
//   //     assert(error instanceof Error)
//   //   })
//   // })
//   //
//   // it('should return error on exception thrown - save', async function () {
//   //   const nonprofit = await TestHelper.generate.model('nonprofit')
//   //   const original = await TestHelper.generate.model('donation', { nonprofitUuid: nonprofit.uuid })
//   //   const params = {
//   //     params: {
//   //       nonprofitUuid: nonprofit.uuid,
//   //       donationUuid: original.uuid
//   //     }
//   //   }
//   //   sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
//   //   sinon.stub(NonprofitDonationsRepository.prototype, 'get').resolves(original)
//   //   sinon.stub(NonprofitDonationsRepository.prototype, 'save').rejects(errorStub)
//   //   return PatchNonprofitDonation.handle(params, null, function (error, result) {
//   //     assert(error instanceof Error)
//   //   })
//   // })
// })
