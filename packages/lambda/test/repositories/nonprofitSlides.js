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
const AWS = require('aws-sdk-mock')
const Slide = require('../../src/dynamo-models/nonprofitSlide')
const NonprofitSlidesRepository = require('../../src/repositories/nonprofitSlides')
const Repository = require('../../src/repositories/repository')
const TestHelper = require('../helpers/test')

const promiseMe = require('mocha-promise-me')

describe('NonprofitSlidesRepository', function () {
  describe('#construct()', function () {
    it('should be an instance of Repository', function () {
      const repository = new NonprofitSlidesRepository()
      assert.ok(repository instanceof Repository)
    })

    it('should be an instance of NonprofitSlidesRepository', function () {
      const repository = new NonprofitSlidesRepository()
      assert.ok(repository instanceof NonprofitSlidesRepository)
    })

    it('should set the database table', function () {
      const repository = new NonprofitSlidesRepository()
      assert.ok(repository.table !== null)
    })
  })

  describe('#get()', function () {
    afterEach(function () {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return a NonprofitSlide model', function () {
      const nonprofit = TestHelper.generate.model('nonprofit')
      const data = TestHelper.generate.data('nonprofitSlide', { nonprofitUuid: nonprofit.uuid })
      AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
        callback(null, { Item: nonprofit.all() })
      })
      AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
        callback(null, { Items: [data] })
      })
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouResolve(repository.get(nonprofit.uuid, data.uuid), function (model) {
        assert.ok(model instanceof Slide)
        assert.equal(model.uuid, data.uuid)
      })
    })

    it('should call reject on an error', function () {
      const nonprofit = TestHelper.generate.model('nonprofit')
      AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
        callback(null, { Item: nonprofit.all() })
      })
      AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
        callback('Error')
      })
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouReject(repository.get('1234', '1234'))
    })
  })

  describe('#getAll()', function () {
    afterEach(function () {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return all NonprofitSlide models', function () {
      const count = 3
      const nonprofit = TestHelper.generate.model('nonprofit')
      const data = TestHelper.generate.dataCollection('nonprofitSlide', count, { nonprofitUuid: nonprofit.uuid })
      AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
        callback(null, { Item: nonprofit.all() })
      })
      AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
        callback(null, {
          Count: count,
          Items: data
        })
      })
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouResolve(repository.getAll(nonprofit.uuid), function (models) {
        for (let i = 0; i < count; i++) {
          const model = models[i]
          assert.ok(model instanceof Slide)
          assert.equal(model.uuid, data[i].uuid)
        }
      })
    })

    it('should call reject on an error', function () {
      const nonprofit = TestHelper.generate.model('nonprofit')
      AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
        callback(null, { Item: nonprofit.all() })
      })
      AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
        callback('Error')
      })
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouReject(repository.getAll('1234'))
    })
  })

  describe('#delete()', function () {
    afterEach(function () {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should delete the NonprofitSlide model', function () {
      const nonprofit = TestHelper.generate.model('nonprofit')
      AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
        callback(null, { Item: nonprofit.all() })
      })
      AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
        callback(null, {})
      })
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouResolve(repository.delete('1234', '9ba33b63-41f9-4efc-8869-2b50a35b53df'))
    })

    it('should call reject on an error', function () {
      const nonprofit = TestHelper.generate.model('nonprofit')
      AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
        callback(null, { Item: nonprofit.all() })
      })
      AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
        callback('Error')
      })
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouReject(repository.delete('1234', '9ba33b63-41f9-4efc-8869-2b50a35b53df'))
    })
  })

  describe('#save()', function () {
    afterEach(function () {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should update the NonprofitSlide model', function () {
      const nonprofit = TestHelper.generate.model('nonprofit')
      const model = TestHelper.generate.model('nonprofitSlide', { nonprofitUuid: nonprofit.uuid })
      AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
        callback(null, { Item: nonprofit.all() })
      })
      AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
        callback(null, { Attributes: model.all() })
      })
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouResolve(repository.save(model.nonprofitUuid, model), function (slide) {
        assert.ok(slide instanceof Slide)
        assert.equal(slide.uuid, model.uuid)
      })
    })

    it('should call reject for an invalid NonprofitSlide model', function () {
      const nonprofit = TestHelper.generate.model('nonprofit')
      const model = TestHelper.generate.model('nonprofitSlide', { nonprofitUuid: nonprofit.uuid })
      AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
        callback(null, { Item: nonprofit.all() })
      })
      AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
        callback(null, { Attributes: model.all() })
      })
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouReject(repository.save(model.nonprofitUuid, new Slide()))
    })

    it('should call reject on an error', function () {
      const nonprofit = TestHelper.generate.model('nonprofit')
      AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
        callback(null, { Item: nonprofit.all() })
      })
      AWS.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
        callback('Error')
      })
      const model = TestHelper.generate.model('nonprofitSlide')
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouReject(repository.save(model.nonprofitUuid, model))
    })
  })
})
