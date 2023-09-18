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
const NonprofitSlidesRepository = require('../../src/repositories/nonprofitSlides')
const Repository = require('../../src/repositories/repository')
const TestHelper = require('../helpers/test')

const loadModels = require('../../src/models')
const sinon = require('sinon')
const Sequelize = require('sequelize')
let Slide

const promiseMe = require('mocha-promise-me')
const SecretsManager = require('../../src/aws/secretsManager')
const Ssm = require('../../src/aws/ssm')

describe('NonprofitSlidesRepository', function () {
  beforeEach(async () => {
    sinon.stub(SecretsManager.prototype, 'getSecretValue').resolves({ SecretString: '{}' })
    sinon.stub(Ssm.prototype, 'getParameter').resolves({Parameter: {Value: ''}})
    Slide = (await loadModels()).NonprofitSlide
  })
  afterEach(function () {
    const stubbedFunctions = [
      SecretsManager.prototype.getSecretValue,
      Ssm.prototype.getParameter,
      Sequelize.Model.destroy,
      Sequelize.Model.findAll,
      Sequelize.Model.upsert
    ]
    stubbedFunctions.forEach(toRestore => toRestore.restore && toRestore.restore())
  })

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
    it('should return a NonprofitSlide model', async function () {
      const nonprofit = await TestHelper.generate.model('nonprofit')
      const data = await TestHelper.generate.model('nonprofitSlide', { nonprofitUuid: nonprofit.uuid })
      sinon.stub(Sequelize.Model, 'findAll').resolves(data)
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouResolve(repository.get(nonprofit.uuid, data.uuid), function (model) {
        assert.ok(model instanceof Slide)
        assert.equal(model.uuid, data.uuid)
      })
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouReject(
        repository.get('1234', '1234'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#getAll()', function () {
    it('should return all NonprofitSlide models', async function () {
      const count = 3
      const nonprofit = await TestHelper.generate.model('nonprofit')
      const data = await TestHelper.generate.modelCollection('nonprofitSlide', count, { nonprofitUuid: nonprofit.uuid })
      sinon.stub(Sequelize.Model, 'findAll').resolves(data)
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
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouReject(
        repository.getAll('1234'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#delete()', function () {
    it('should delete the NonprofitSlide model', function () {
      sinon.stub(Sequelize.Model, 'destroy').resolves()
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouResolve(repository.delete('1234', '9ba33b63-41f9-4efc-8869-2b50a35b53df'))
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'destroy').rejects(new Error('stubbedError'))
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouReject(
        repository.delete('1234', '9ba33b63-41f9-4efc-8869-2b50a35b53df'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#save()', function () {
    it('should update the NonprofitSlide model', async function () {
      const nonprofit = await TestHelper.generate.model('nonprofit')
      const model = await TestHelper.generate.model('nonprofitSlide', { nonprofitUuid: nonprofit.uuid })
      sinon.stub(Sequelize.Model, 'findAll').resolves(model)
      sinon.stub(Sequelize.Model, 'upsert').resolves(model)
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouResolve(repository.save(model.nonprofitUuid, model), function (slide) {
        assert.ok(slide instanceof Slide)
        assert.equal(slide.uuid, model.uuid)
      })
    })

    it('should call reject on an error', async function () {
      const model = await TestHelper.generate.model('nonprofitSlide')
      sinon.stub(Sequelize.Model, 'findAll').resolves(model)
      sinon.stub(Sequelize.Model, 'upsert').rejects(new Error('stubbedError'))
      const repository = new NonprofitSlidesRepository()
      return promiseMe.thatYouReject(
        repository.save(model.nonprofitUuid, model),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })
})
