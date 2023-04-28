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

const Repository = require('./repository')
const RepositoryHelper = require('./../helpers/repository')
const ResourceNotFoundException = require('./../exceptions/resourceNotFound')
const loadModels = require('../models/index')

/**
 * SponsorTiersRepository constructor
 *
 * @constructor
 */
function SponsorTiersRepository (options) {
  options = options || {}
  if (!options.table) {
    options.table = RepositoryHelper.SponsorTiersTable
  }
  Repository.call(this, options)
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
SponsorTiersRepository.prototype = new Repository()

/**
 * Look to abstract this
 *
 * @param data
 * @return {Promise}
 */
SponsorTiersRepository.prototype.populate = function (data) {
  let allModels
  return loadModels().then(function (models) {
    allModels = models
    const sponsorTier = new models.SponsorTier()
    return new sponsorTier.constructor(data, { isNewRecord: typeof data.id === 'undefined' })
  }).finally(function () {
    return allModels.sequelize.close()
  })
}

/**
 * Get a Sponsor Tier
 *
 * @param {String} id
 * @return {Promise}
 */
SponsorTiersRepository.prototype.get = function (id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.SponsorTier.findOne({
        where: {
          id: id
        }
      })
    }).then(function (sponsorTier) {
      if (sponsorTier instanceof allModels.SponsorTier) {
        resolve(sponsorTier)
      }
      reject(new ResourceNotFoundException('The specified sponsorTier does not exist.'))
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Get all Sponsor Tiers
 *
 * @return {Promise}
 */
SponsorTiersRepository.prototype.getAll = function () {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.SponsorTier.findAll()
    }).then(function (results) {
      resolve(results)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Get a count of all SponsorTiers
 *
 * @return {Promise}
 */
SponsorTiersRepository.prototype.getCount = function () {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.SponsorTier.count()
    }).then(function (result) {
      resolve(result)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Delete a Sponsor Tier
 *
 * @param {String} id
 * @return {Promise}
 */
SponsorTiersRepository.prototype.delete = function (id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.SponsorTier.destroy({ where: { id: id } })
    }).then(function () {
      resolve()
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Create or update a Sponsor Tier
 *
 * @param {SponsorTier} model
 */
SponsorTiersRepository.prototype.save = function (model) {
  let allModels
  const repository = this
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
      if (!(model instanceof allModels.SponsorTier)) {
        reject(new Error('invalid SponsorTier model'))
      }
      return repository.upsert(model, {})
    }).then(function (sponsorTier) {
      resolve(sponsorTier)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Insert or update the model
 *
 * @param model
 * @param data
 * @return {Promise<any>}
 */
SponsorTiersRepository.prototype.upsert = function (model, data) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.SponsorTier.upsert({
        id: model.get('id'),
        name: typeof data.name !== 'undefined' ? data.name : model.get('name'),
        size: typeof data.size !== 'undefined' ? data.size : model.get('size'),
        sortOrder: typeof data.sortOrder !== 'undefined' ? data.sortOrder : model.get('sortOrder')
      })
    }).then(function (sponsorTier) {
      resolve(sponsorTier)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

module.exports = SponsorTiersRepository
