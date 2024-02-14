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
const Repository = require('./../../src/repositories/repository')
const SettingsRepository = require('./../../src/repositories/settings')
const TestHelper = require('./../helpers/test')

const loadModels = require('../../src/models')
const sinon = require('sinon')
const Sequelize = require('sequelize')
let Setting

describe('SettingsRepository', function () {
  beforeEach(async () => {
    Setting = (await loadModels()).Setting
  })

  describe('#construct()', function () {
    it('should be an instance of Repository', function () {
      const repository = new SettingsRepository()
      assert.ok(repository instanceof Repository)
    })

    it('should be an instance of SettingsRepository', function () {
      const repository = new SettingsRepository()
      assert.ok(repository instanceof SettingsRepository)
    })

    it('should set the database table', function () {
      const repository = new SettingsRepository()
      assert.ok(repository.table !== null)
    })
  })

  describe('#get()', function () {
    it('should return a Setting model', async function () {
      const data = await TestHelper.generate.model('setting')
      sinon.stub(Sequelize.Model, 'findAll').resolves(data)

      const repository = new SettingsRepository()
      return promiseMe.thatYouResolve(repository.get(data.key), function (model) {
        assert.ok(model instanceof Setting)
        assert.equal(model.uuid, data.uuid)
        assert.equal(model.key, data.key)
      })
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))
      const repository = new SettingsRepository()
      return promiseMe.thatYouReject(
        repository.get('TEST_SETTING'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#getAll()', function () {
    it('should return all Settings models', async function () {
      const count = 3
      const data = await TestHelper.generate.modelCollection('setting', count)
      sinon.stub(Sequelize.Model, 'findAll').resolves(data)

      const repository = new SettingsRepository()
      return promiseMe.thatYouResolve(repository.getAll(), function (models) {
        for (let i = 0; i < count; i++) {
          const model = models[i]
          assert.ok(model instanceof Setting)
          assert.equal(model.uuid, data[i].uuid)
          assert.equal(model.key, data[i].key)
        }
      })
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))
      const repository = new SettingsRepository()
      return promiseMe.thatYouReject(
        repository.getAll(),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#delete()', function () {
    it('should delete the Settings model', function () {
      sinon.stub(Sequelize.Model, 'destroy').resolves()
      const repository = new SettingsRepository()
      return promiseMe.thatYouResolve(repository.delete('TEST_SETTING'))
    })

    it('should call reject on an error', async function () {
      const model = await TestHelper.generate.model('setting')
      sinon.stub(Sequelize.Model, 'findAll').resolves(model)
      sinon.stub(Sequelize.Model, 'destroy').rejects(new Error('stubbedError'))
      const repository = new SettingsRepository()
      return promiseMe.thatYouReject(
        repository.delete('TEST_SETTING'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#save()', function () {
    it('should update the Setting model', async function () {
      const model = await TestHelper.generate.model('setting')
      sinon.stub(Sequelize.Model, 'findAll').resolves(model)
      sinon.stub(Sequelize.Model, 'upsert').resolves(model)
      const repository = new SettingsRepository()
      return promiseMe.thatYouResolve(repository.save(model), function (message) {
        assert.ok(message instanceof Setting)
        assert.equal(message.uuid, model.uuid)
        assert.equal(message.key, model.key)
      })
    })

    it('should call reject on an error', async function () {
      const model = await TestHelper.generate.model('setting')
      sinon.stub(Sequelize.Model, 'findAll').resolves(model)
      sinon.stub(Sequelize.Model, 'upsert').rejects(new Error('stubbedError'))
      const repository = new SettingsRepository()
      return promiseMe.thatYouReject(
        repository.save(model),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })
})
