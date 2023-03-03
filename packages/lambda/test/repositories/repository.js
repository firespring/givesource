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
const Repository = require('../../src/repositories/repository')
const TestHelper = require('../helpers/test')
const sinon = require('sinon')
const Sequelize = require('sequelize')

const promiseMe = require('mocha-promise-me')
const SecretsManager = require('../../src/aws/secretsManager')

describe('Repository', function () {
  beforeEach(async () => {
    sinon.stub(SecretsManager.prototype, 'getSecretValue').resolves({ SecretString: '{}' })
  })
  afterEach(function () {
    const stubbedFunctions = [
      SecretsManager.prototype.getSecretValue,
      Sequelize.Model.destroy,
      Sequelize.Model.findAll,
      Sequelize.Model.upsert
    ]
    stubbedFunctions.forEach(toRestore => toRestore.restore && toRestore.restore())
  })

  // #getByKey appears to be dead code (never converted from dynamoDb)
  // describe('#getByKey()', function () {
  //   it('should return the item', function () {
  //     const data = TestHelper.generate.data('model')
  //     AWS.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
  //       callback(null, { Item: data })
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouResolve(repository.getByKey('uuid', data.uuid), function (response) {
  //       assert.equal(response.Item.uuid, data.uuid)
  //       assert.equal(response.Item.createdOn, data.createdOn)
  //     })
  //   })
  //
  //   it('should call reject on an error', function () {
  //     AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
  //       callback('Error')
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouReject(
  //         repository.getByKey('uuid', '9ba33b63-41f9-4efc-8869-2b50a35b53df'),
  //         (error) => assert.equal('stubbedError', error.message)
  //     )
  //   })
  // })

  // #deleteByKey appears to be dead code (never converted from dynamoDb)
  // describe('#deleteByKey()', function () {
  //   afterEach(function () {
  //     AWS.restore('DynamoDB.DocumentClient')
  //   })
  //
  //   it('should delete the item', function () {
  //     AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
  //       callback()
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouResolve(repository.deleteByKey('uuid', '9ba33b63-41f9-4efc-8869-2b50a35b53df'))
  //   })
  //
  //   it('should call reject on an error', function () {
  //     AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
  //       callback('Error')
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouReject(
  //         repository.deleteByKey('uuid'),
  //         (error) => assert.equal('stubbedError', error.message)
  //     )
  //   })
  // })

  describe('#batchDelete()', () => {
    it('should delete models', async function () {
      const count = 3
      const models = await TestHelper.generate.modelCollection('nonprofit', count)
      const mocks = models.map(model => sinon.mock(model).expects('destroy').once().resolves(model))

      const repository = new Repository()
      repository.table = 'test-Table'
      await promiseMe.thatYouResolve(repository.batchDelete(models), function (response) {
        assert.equal(response, models[models.length - 1])
      })

      mocks.forEach(mock => mock.verify())
    })

    it('should call reject on an error', async function () {
      const count = 3
      const models = await TestHelper.generate.modelCollection('nonprofit', count)
      sinon.stub(Sequelize.Model.prototype, 'destroy').rejects(new Error('stubbedError'))
      const repository = new Repository()
      repository.table = 'test-Table'
      return promiseMe.thatYouReject(
        repository.batchDelete(models),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  // #scan appears to be dead code (never converted from dynamoDb)
  // describe('#scan()', function () {
  //   afterEach(function () {
  //     AWS.restore('DynamoDB.DocumentClient')
  //   })
  //
  //   it('should return all items', function () {
  //     const count = 3
  //     const data = TestHelper.generate.dataCollection('model', count)
  //     AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
  //       callback(null, {
  //         Count: count,
  //         Items: data
  //       })
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouResolve(repository.scan(), function (response) {
  //       for (let i = 0; i < count; i++) {
  //         assert.equal(response.Items[i].uuid, data[i].uuid)
  //       }
  //       assert.equal(response.Count, count)
  //     })
  //   })
  //
  //   it('should call reject on an error', function () {
  //     const model = TestHelper.generate.model('model')
  //     AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
  //       callback('Error')
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouReject(
  //         repository.scan(model),
  //         (error) => assert.equal('stubbedError', error.message)
  //     )
  //   })
  // })

  // #batchScan wraps #scan which appears to be dead code (never converted from dynamoDb)
  // describe('#batchScan()', function () {
  //   afterEach(function () {
  //     AWS.restore('DynamoDB.DocumentClient')
  //   })
  //
  //   it('should return all models', function () {
  //     const count = 50
  //     const data = TestHelper.generate.dataCollection('model', count)
  //     AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
  //       callback(null, {
  //         Count: count,
  //         Items: data
  //       })
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouResolve(repository.batchScan(), function (response) {
  //       for (let i = 0; i < count; i++) {
  //         assert.equal(response.Items[i].uuid, data[i].uuid)
  //       }
  //       assert.equal(response.Count, count)
  //     })
  //   })
  //
  //   it('should call reject on an error', function () {
  //     const models = TestHelper.generate.modelCollection('model', 66)
  //     AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
  //       callback('Error')
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouReject(
  //         repository.batchScan(models),
  //         (error) => assert.equal('stubbedError', error.message)
  //     )
  //   })
  // })

  describe('#batchUpdate()', function () {
    it('should update models', async function () {
      const models = [{ update: () => {} }, { update: () => {} }]
      const mocks = models.map(model => sinon.mock(model).expects('update').once().resolves(model))

      const repository = new Repository()
      repository.table = 'test-Table'
      await promiseMe.thatYouResolve(repository.batchUpdate(models), function (response) {
        assert.equal(response, models[models.length - 1])
      })
      mocks.forEach(mock => mock.verify())
    })

    it('should call reject on an error', async function () {
      const model = { update: () => { throw new Error('stubbedError') } }
      const repository = new Repository()
      repository.table = 'test-Table'
      return promiseMe.thatYouReject(
        repository.batchUpdate([model]),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  // #batchWrite appears to be dead code (never converted from dynamoDb)
  // describe('#batchWrite()', function () {
  //   const requestItems = [{
  //     'test-Table': [
  //       {
  //         PutRequest: {
  //           Item: TestHelper.generate.model('model')
  //         }
  //       },
  //       {
  //         DeleteRequest: {
  //           Item: TestHelper.generate.model('model')
  //         }
  //       }
  //     ]
  //   }]
  //   const unprocessedItems = {
  //     UnprocessedItems: {
  //       'test-Table': [
  //         {
  //           PutRequest: {
  //             Item: TestHelper.generate.model('model')
  //           }
  //         },
  //         {
  //           DeleteRequest: {
  //             Item: TestHelper.generate.model('model')
  //           }
  //         }
  //       ]
  //     }
  //   }
  //
  //   afterEach(function () {
  //     AWS.restore('DynamoDB.DocumentClient')
  //   })
  //
  //   it('should write models', function () {
  //     const count = 50
  //     const models = TestHelper.generate.modelCollection('model', count)
  //     AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
  //       callback(null, {
  //         Count: count,
  //         Items: models
  //       })
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouResolve(repository.batchWrite(models), function (response) {
  //       assert.ok(typeof response === 'undefined')
  //     })
  //   })
  //
  //   it('should resolve with unprocessed items', function () {
  //     AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
  //       callback(null, unprocessedItems)
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouResolve(repository.batchWrite(requestItems), function (data) {
  //       assert.equal(data.UnprocessedItems.length, 2)
  //     })
  //   })
  //
  //   it('should call reject on an error', function () {
  //     AWS.mock('DynamoDB.DocumentClient', 'batchWrite', function (params, callback) {
  //       callback('Error', null)
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouReject(
  //         repository.batchWrite(requestItems),
  //         (error) => assert.equal('stubbedError', error.message)
  //     )
  //   })
  // })

  // #query appears to be dead code (never converted from dynamoDb)
  // describe('#query()', function () {
  //   const data = TestHelper.generate.data('model')
  //   const builder = new QueryBuilder('query')
  //   builder.index('createdOnIndex')
  //
  //   afterEach(function () {
  //     AWS.restore('DynamoDB.DocumentClient')
  //   })
  //
  //   it('should query data into an array', function () {
  //     AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
  //       callback(null, data)
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouResolve(repository.query(builder), function (result) {
  //       assert.equal(data, result)
  //     })
  //   })
  //
  //   it('should throw error', function () {
  //     AWS.mock('DynamoDB.DocumentClient', 'query', function (params, callback) {
  //       callback('Error')
  //     })
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouReject(
  //         repository.query(builder),
  //         (error) => assert.equal('stubbedError', error.message)
  //     )
  //   })
  // })

  // #put appears to be dead code (never converted from dynamoDb)
  // describe('#put()', function () {
  //   const data = TestHelper.generate.data('model')
  //
  //   afterEach(function () {
  //     AWS.restore('DynamoDB.DocumentClient')
  //   })
  //
  //   it('should update(put) data in a model', function () {
  //     // const model = {}
  //     // sinon.stub(Sequelize.Model, 'findAll').resolves(model)
  //     // sinon.stub(Sequelize.Model, 'upsert').resolves([model])
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouResolve(repository.put(data.uuid, data), function (result) {
  //       assert.equal(data, result)
  //     })
  //   })
  //
  //   it('should throw error', function () {
  //     sinon.stub(Sequelize.Model, 'upsert').rejects(new Error('stubbedError'))
  //     const repository = new Repository()
  //     repository.table = 'test-Table'
  //     return promiseMe.thatYouReject(
  //         repository.put(data.uuid, data),
  //         (error) => assert.equal('stubbedError', error.message)
  //     )
  //   })
  // })

  describe('#buildUpdateExpression()', function () {
    const data = {
      uuid: 'd08eb977-bda9-4fa1-a2ec-e9802e8668df',
      createdOn: 11499288551800,
      email: 'alex.rocks@firespring.com'
    }

    it('should return an array of objects', function () {
      const repository = new Repository()
      repository.table = 'test-Table'
      const func = repository.buildUpdateExpression(data)
      const updateExpression = func[0]
      const attributeNames = func[1]
      const attributeValues = func[2]
      assert.equal(updateExpression, 'SET #uuid = :uuid, #createdOn = :createdOn, #email = :email ')
      assert.deepEqual(attributeNames, { '#uuid': 'uuid', '#createdOn': 'createdOn', '#email': 'email' })
      assert.deepEqual(attributeValues, {
        ':uuid': 'd08eb977-bda9-4fa1-a2ec-e9802e8668df',
        ':createdOn': 11499288551800,
        ':email': 'alex.rocks@firespring.com'
      })
    })
  })
})
