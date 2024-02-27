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
const DonorsRepository = require('../../src/repositories/donors')
const Repository = require('../../src/repositories/repository')
const TestHelper = require('../helpers/test')

const loadModels = require('../../src/models')
const sinon = require('sinon')
const Sequelize = require('sequelize')
let Donor

const promiseMe = require('mocha-promise-me')

describe('DonorsRepository', function () {
  beforeEach(async () => {
    Donor = (await loadModels()).Donor
  })
  describe('#construct()', function () {
    it('should be an instance of Repository', function () {
      const repository = new DonorsRepository()
      assert.ok(repository instanceof Repository)
    })

    it('should be an instance of DonorsRepository', function () {
      const repository = new DonorsRepository()
      assert.ok(repository instanceof DonorsRepository)
    })

    it('should set the database table', function () {
      const repository = new DonorsRepository()
      assert.ok(repository.table !== null)
    })
  })

  describe('#get()', function () {
    it('should return a Donor model', async function () {
      const data = await TestHelper.generate.model('donor')
      sinon.stub(Sequelize.Model, 'findAll').resolves(data)
      const repository = new DonorsRepository()
      return promiseMe.thatYouResolve(repository.get(data.email), function (model) {
        assert.ok(model instanceof Donor)
        assert.equal(model.email, data.email)
      })
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))
      const repository = new DonorsRepository()
      return promiseMe.thatYouReject(
        repository.get('woody@firespring.com'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#getAll()', function () {
    it('should return all Donor models', async function () {
      const count = 3
      const data = await TestHelper.generate.modelCollection('donor', count)
      sinon.stub(Sequelize.Model, 'findAll').resolves(data)
      const repository = new DonorsRepository()
      return promiseMe.thatYouResolve(repository.getAll(), function (models) {
        for (let i = 0; i < count; i++) {
          const model = models[i]
          assert.ok(model instanceof Donor)
          assert.equal(model.uuid, data[i].uuid)
        }
      })
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))
      const repository = new DonorsRepository()
      return promiseMe.thatYouReject(
        repository.getAll(),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#delete()', function () {
    it('should delete the Donor model', function () {
      sinon.stub(Sequelize.Model, 'destroy').resolves()
      const repository = new DonorsRepository()
      return promiseMe.thatYouResolve(repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'))
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'destroy').rejects(new Error('stubbedError'))
      const repository = new DonorsRepository()
      return promiseMe.thatYouReject(
        repository.delete('9ba33b63-41f9-4efc-8869-2b50a35b53df'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#save()', function () {
    it('should update the Donor model', async function () {
      const model = await TestHelper.generate.model('donor')
      sinon.stub(Sequelize.Model, 'findAll').resolves(model)
      sinon.stub(Sequelize.Model, 'upsert').resolves([model])
      const repository = new DonorsRepository()
      return promiseMe.thatYouResolve(repository.save(model), function (donor) {
        assert.ok(donor instanceof Donor)
        assert.equal(donor.email, model.email)
      })
    })

    it('should call reject for an invalid Donor model', function () {
      const model = TestHelper.generate.model('donor')
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))
      const repository = new DonorsRepository()
      return promiseMe.thatYouReject(
        repository.save(model),
        (error) => assert.equal('stubbedError', error.message)
      )
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))
      const model = TestHelper.generate.model('donor', { id: 123 })
      const repository = new DonorsRepository()
      return promiseMe.thatYouReject(
        repository.save(model),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#queryEmail()', function () {
    it('should return a Donor model', async function () {
      const donor = await TestHelper.generate.model('donor')
      sinon.stub(Sequelize.Model, 'findAll').resolves(donor)
      const repository = new DonorsRepository()
      return promiseMe.thatYouResolve(repository.queryEmail(donor.email), function (model) {
        assert(model instanceof Donor)
        assert.equal(model.email, donor.email)
      })
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))
      const repository = new DonorsRepository()
      return promiseMe.thatYouReject(
        repository.queryEmail('test@example.com'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })
})
