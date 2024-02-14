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
const SponsorsRepository = require('../../src/repositories/sponsors')
const TestHelper = require('../helpers/test')

const promiseMe = require('mocha-promise-me')

const loadModels = require('../../src/models')
const sinon = require('sinon')
const Sequelize = require('sequelize')
const SponsorTiersRepository = require('../../src/repositories/sponsorTiers')
let Sponsor

describe('SponsorsRepository', function () {
  beforeEach(async () => {
    Sponsor = (await loadModels()).Sponsor
  })
  describe('#construct()', function () {
    it('should be an instance of Repository', function () {
      const repository = new SponsorsRepository()
      assert.ok(repository instanceof Repository)
    })

    it('should be an instance of SponsorsRepository', function () {
      const repository = new SponsorsRepository()
      assert.ok(repository instanceof SponsorsRepository)
    })

    it('should set the database table', function () {
      const repository = new SponsorsRepository()
      assert.ok(repository.table !== null)
    })
  })

  describe('#get()', function () {
    it('should return a Sponsor model', async function () {
      const sponsorTier = await TestHelper.generate.model('sponsorTier')
      const data = await TestHelper.generate.model('sponsor', { sponsorTierUuid: sponsorTier.uuid })
      sinon.stub(Sequelize.Model, 'findAll').resolves(data)

      const repository = new SponsorsRepository()
      return promiseMe.thatYouResolve(repository.get(sponsorTier.uuid, data.uuid), function (model) {
        assert.ok(model instanceof Sponsor)
        assert.equal(model.uuid, data.uuid)
      })
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))

      const repository = new SponsorsRepository()
      return promiseMe.thatYouReject(
        repository.get('1234', '1234'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#getAll()', function () {
    it('should return all Sponsor models', async function () {
      const count = 3
      const sponsorTier = await TestHelper.generate.model('sponsorTier')
      const data = await TestHelper.generate.modelCollection('sponsor', count, { sponsorTierUuid: sponsorTier.uuid })
      sinon.stub(Sequelize.Model, 'findAll').resolves(data)

      const repository = new SponsorsRepository()
      return promiseMe.thatYouResolve(repository.getAll(sponsorTier.uuid), function (models) {
        for (let i = 0; i < count; i++) {
          const model = models[i]
          assert.ok(model instanceof Sponsor)
          assert.equal(model.uuid, data[i].uuid)
        }
      })
    })

    it('should call reject on an error', function () {
      sinon.stub(Sequelize.Model, 'findAll').rejects(new Error('stubbedError'))

      const repository = new SponsorsRepository()
      return promiseMe.thatYouReject(
        repository.getAll('1234'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#delete()', function () {
    it('should delete the Sponsor model', async function () {
      const sponsorTier = await TestHelper.generate.model('sponsorTier')
      sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier)
      sinon.stub(Sequelize.Model, 'destroy').resolves()

      const repository = new SponsorsRepository()
      return promiseMe.thatYouResolve(repository.delete('1234', '9ba33b63-41f9-4efc-8869-2b50a35b53df'))
    })

    it('should call reject on an error', async function () {
      sinon.stub(Sequelize.Model, 'destroy').rejects(new Error('stubbedError'))

      const repository = new SponsorsRepository()
      return promiseMe.thatYouReject(
        repository.delete('1234', '9ba33b63-41f9-4efc-8869-2b50a35b53df'),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })

  describe('#save()', function () {
    it('should update the Sponsor model', async function () {
      const sponsorTier = await TestHelper.generate.model('sponsorTier')
      sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier)

      const model = await TestHelper.generate.model('sponsor', { sponsorTierUuid: sponsorTier.uuid })
      sinon.stub(Sequelize.Model, 'findAll').resolves(model)
      sinon.stub(Sequelize.Model, 'upsert').resolves(model)

      const repository = new SponsorsRepository()
      return promiseMe.thatYouResolve(repository.save(model.sponsorTierUuid, model), function (sponsor) {
        assert.ok(sponsor instanceof Sponsor)
        assert.equal(sponsor.uuid, model.uuid)
      })
    })

    it('should call reject on an error', async function () {
      const sponsorTier = await TestHelper.generate.model('sponsorTier')
      sinon.stub(SponsorTiersRepository.prototype, 'get').resolves(sponsorTier)

      const model = await TestHelper.generate.model('sponsor')
      sinon.stub(Sequelize.Model, 'findAll').resolves(model)
      sinon.stub(Sequelize.Model, 'upsert').rejects(new Error('stubbedError'))

      const repository = new SponsorsRepository()
      return promiseMe.thatYouReject(
        repository.save(model.sponsorTierUuid, model),
        (error) => assert.equal('stubbedError', error.message)
      )
    })
  })
})
