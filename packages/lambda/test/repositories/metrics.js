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
const MetricsRepository = require('./../../src/repositories/metrics')
const promiseMe = require('mocha-promise-me')
const Repository = require('./../../src/repositories/repository')

const sinon = require('sinon')
const Sequelize = require('sequelize')

describe('MetricsRepository', function () {
  describe('#construct()', function () {
    it('should be an instance of Repository', function () {
      const repository = new MetricsRepository()
      assert.ok(repository instanceof Repository)
    })

    it('should be an instance of MetricsRepository', function () {
      const repository = new MetricsRepository()
      assert.ok(repository instanceof MetricsRepository)
    })

    it('should set the database table', function () {
      const repository = new MetricsRepository()
      assert.ok(repository.table !== null)
    })
  })

  describe('#getAll()', function () {
    // it('should return all Metrics models', async function () {
    //   const count = 3
    //   const data = await TestHelper.generate.modelCollection('metric', count)
    //   sinon.stub(Sequelize.Model, 'findAll').resolves(data)
    //   const repository = new MetricsRepository()
    //   return promiseMe.thatYouResolve(repository.getAll(), function (models) {
    //     for (let i = 0; i < count; i++) {
    //       const model = models[i]
    //       assert.ok(model instanceof Metric)
    //       assert.equal(model.uuid, data[i].uuid)
    //       assert.equal(model.key, data[i].key)
    //     }
    //   })
    // })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))
      const repository = new MetricsRepository()
      return promiseMe.thatYouReject(
        repository.getAll(),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })
})
