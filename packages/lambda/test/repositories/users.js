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
const UsersRepository = require('../../src/repositories/users')
const Repository = require('../../src/repositories/repository')
const TestHelper = require('../helpers/test')

const loadModels = require('../../src/models')
const sinon = require('sinon')
const Sequelize = require('sequelize')
let User

const promiseMe = require('mocha-promise-me')

describe('UsersRepository', function () {
  beforeEach(async () => {
    User = (await loadModels()).User
  })

  describe('#construct()', function () {
    it('should be an instance of Repository', function () {
      const repository = new UsersRepository()
      assert.ok(repository instanceof Repository)
    })

    it('should be an instance of UsersRepository', function () {
      const repository = new UsersRepository()
      assert.ok(repository instanceof UsersRepository)
    })

    it('should set the database table', function () {
      const repository = new UsersRepository()
      assert.ok(repository.table !== null)
    })
  })

  describe('#get()', function () {
    it('should return a User model', async function () {
      const data = await TestHelper.generate.model('user')
      sinon.stub(Sequelize.Model, 'findAll').resolves(data)

      const repository = new UsersRepository()
      return promiseMe.thatYouResolve(repository.get(data.uuid), function (model) {
        assert.ok(model instanceof User)
        assert.equal(model.uuid, data.uuid)
      })
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))

      const repository = new UsersRepository()
      return promiseMe.thatYouReject(
        repository.get('9ba33b63-41f9-4efc-8869-2b50a35b53df'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#getAll()', function () {
    it('should return all User models', async function () {
      const count = 3
      const data = await TestHelper.generate.modelCollection('user', count)
      sinon.stub(Sequelize.Model, 'findAll').resolves(data)

      const repository = new UsersRepository()
      return promiseMe.thatYouResolve(repository.getAll(), function (models) {
        for (let i = 0; i < count; i++) {
          const model = models[i]
          assert.ok(model instanceof User)
          assert.equal(model.uuid, data[i].uuid)
        }
      })
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))

      const repository = new UsersRepository()
      return promiseMe.thatYouReject(
        repository.getAll(),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#delete()', function () {
    it('should delete the User model', function () {
      sinon.stub(Sequelize.Model, 'destroy').resolves()

      const repository = new UsersRepository()
      return promiseMe.thatYouResolve(repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'))
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'destroy').rejects(new Error('stubbedError'))

      const repository = new UsersRepository()
      return promiseMe.thatYouReject(
        repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#save()', function () {
    it('should update the User model', async function () {
      const model = await TestHelper.generate.model('user')
      sinon.stub(Sequelize.Model, 'findAll').resolves(model)
      sinon.stub(Sequelize.Model, 'upsert').resolves(model)

      const repository = new UsersRepository()
      return promiseMe.thatYouResolve(repository.save(model), function (user) {
        assert.ok(user instanceof User)
        assert.equal(user.uuid, model.uuid)
      })
    })

    it('should call reject on an error', async function () {
      const model = await TestHelper.generate.model('user')
      sinon.stub(Sequelize.Model, 'findAll').resolves(model)
      sinon.stub(Sequelize.Model, 'upsert').rejects(new Error('stubbedError'))

      const repository = new UsersRepository()
      return promiseMe.thatYouReject(
        repository.save(model),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })
})
