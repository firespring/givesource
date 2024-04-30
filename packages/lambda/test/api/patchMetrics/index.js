
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

const assert = require('assert')
const promiseMe = require('mocha-promise-me')
const MetricsRepository = require('./../../../src/repositories/metrics')
const PatchMetrics = require('./../../../src/api/patchMetrics/index')
const sinon = require('sinon')
const TestHelper = require('./../../helpers/test')

describe('PatchMetrics', function () {
  it('should return update metrics', async function () {
    const models = TestHelper.generate.modelCollection('metric', 3)
    sinon.stub(MetricsRepository.prototype, 'batchUpdate').resolves()
    const params = {
      body: {
        metrics: models
      }
    }
    return PatchMetrics.handle(params, null, function (error) {
      assert(error === undefined)
    })
  })

  it('should return error on exception thrown', async function () {
    const models = TestHelper.generate.modelCollection('metric', 3)
    const params = {
      body: {
        metrics: models
      }
    }
    sinon.stub(MetricsRepository.prototype, 'batchUpdate').rejects('Error')
    return PatchMetrics.handle(params, null, function (error) {
      assert(error instanceof Error)
    })
  })
})
