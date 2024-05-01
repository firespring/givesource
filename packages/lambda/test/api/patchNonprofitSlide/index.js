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
// const NonprofitsRepository = require('./../../../src/repositories/nonprofits')
// const NonprofitSlidesRepository = require('./../../../src/repositories/nonprofitSlides')
// const PatchNonprofitSlide = require('./../../../src/api/patchNonprofitSlide/index')
// const sinon = require('sinon')
// const TestHelper = require('./../../helpers/test')
//
// describe('PatchNonprofitSlide', function () {
//   it('should return an updated nonprofit slide', async function () {
//     const nonprofit = await TestHelper.generate.model('nonprofit')
//     const original = await TestHelper.generate.model('nonprofitSlide', { nonprofitUuid: nonprofit.uuid })
//     const updated = await TestHelper.generate.model('nonprofitSlide', { uuid: original.uuid, nonprofitUuid: nonprofit.uuid })
//     sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
//     sinon.stub(NonprofitSlidesRepository.prototype, 'get').resolves(original)
//     const upsertStub = sinon.stub(NonprofitSlidesRepository.prototype, 'upsert').resolves(updated)
//
//     const body = { someUpdatedParam: 'updated' }
//     const result = await TestHelper.callApi(PatchNonprofitSlide, {}, null, { body })
//     assert(result === updated)
//     assert(upsertStub.withArgs(original, body).callCount === 1)
//   })
//
//   it('should return error on exception thrown - get', async function () {
//     const errorStub = new Error('error')
//     const nonprofit = await TestHelper.generate.model('nonprofit')
//     const original = await TestHelper.generate.model('nonprofitSlide', { nonprofitUuid: nonprofit.uuid })
//     sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
//     sinon.stub(NonprofitSlidesRepository.prototype, 'get').rejects(errorStub)
//     sinon.stub(NonprofitSlidesRepository.prototype, 'upsert').resolves(original)
//
//     const response = TestHelper.callApi(PatchNonprofitSlide)
//     await promiseMe.thatYouReject(response, (error) => {
//       assert(error === errorStub)
//     })
//   })
//
//   it('should return error on exception thrown - save', async function () {
//     const errorStub = new Error('error')
//     const nonprofit = await TestHelper.generate.model('nonprofit')
//     const original = await TestHelper.generate.model('nonprofitSlide', { nonprofitUuid: nonprofit.uuid })
//     sinon.stub(NonprofitsRepository.prototype, 'get').resolves(nonprofit)
//     sinon.stub(NonprofitSlidesRepository.prototype, 'get').resolves(original)
//     sinon.stub(NonprofitSlidesRepository.prototype, 'upsert').rejects(errorStub)
//
//     const response = TestHelper.callApi(PatchNonprofitSlide)
//     await promiseMe.thatYouReject(response, (error) => {
//       assert(error === errorStub)
//     })
//   })
// })
