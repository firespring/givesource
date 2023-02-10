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

const NonprofitRepository = require('./nonprofits')
const QueryBuilder = require('./../aws/queryBuilder')
const Repository = require('./repository')
const RepositoryHelper = require('./../helpers/repository')
const ResourceNotFoundException = require('./../exceptions/resourceNotFound')
const loadModels = require('../models/index')
const Sequelize = require('sequelize')

/**
 * NonprofitSlidesRepository constructor
 *
 * @constructor
 */
function NonprofitSlidesRepository (options) {
  options = options || {}
  if (!options.table) {
    options.table = RepositoryHelper.NonprofitSlidesTable
  }
  Repository.call(this, options)
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
NonprofitSlidesRepository.prototype = new Repository()

/**
 * Look to abstract this
 *
 * @param {Object} data
 * @return {Promise}
 */
NonprofitSlidesRepository.prototype.populate = function (data) {
  let allModels
  return loadModels().then(function (models) {
    allModels = models
    const nonprofitSlide = new models.NonprofitSlide()
    return new nonprofitSlide.constructor(data, { isNewRecord: typeof data.id === 'undefined' })
  }).finally(function () {
    return allModels.sequelize.close()
  })
}

/**
 * Get a NonprofitSlide
 *
 * @param {String} nonprofitId
 * @param {String} id
 * @return {Promise}
 */
NonprofitSlidesRepository.prototype.get = function (nonprofitId, id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.NonprofitSlide.findOne({
        where: {
          id: id,
          nonprofitId: nonprofitId
        }
      })
    }).then(function (nonprofitSlide) {
      if (nonprofitSlide instanceof allModels.NonprofitSlide) {
        resolve(nonprofitSlide)
      }
      reject(new ResourceNotFoundException('The specified nonprofitSlide does not exist.'))
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Get all Slides for a Nonprofit
 *
 * @param {String} nonprofitId
 * @return {Promise}
 */
NonprofitSlidesRepository.prototype.getAll = function (nonprofitId) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.NonprofitSlide.findAll({
        where: {
          nonprofitId: nonprofitId
        }
      })
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
 * Get a count of all Slides for a Nonprofit
 *
 * @param {String} nonprofitId
 * @return {Promise}
 */
NonprofitSlidesRepository.prototype.getCount = function (nonprofitId) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.NonprofitSlide.count({
        where: {
          nonprofitId: nonprofitId
        }
      })
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
 * Delete a NonprofitSlide
 *
 * @param {String} nonprofitId
 * @param {String} id
 * @return {Promise}
 */
NonprofitSlidesRepository.prototype.delete = function (nonprofitId, id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.NonprofitSlide.destroy(
        {
          where: {
            id: id,
            nonprofitId: nonprofitId
          }
        })
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
 * Create or update a NonprofitSlide
 *
 * @param {String} nonprofitId
 * @param {NonprofitSlide} model
 */
NonprofitSlidesRepository.prototype.save = function (nonprofitId, model) {
  let allModels
  const repository = this
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
      if (!(model instanceof allModels.NonprofitSlide)) {
        reject(new Error('invalid NonprofitSlide model'))
      }
      return repository.upsert(model, {})
    }).then(function (nonprofitSlide) {
      resolve(nonprofitSlide)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Batch create or update Slides
 *
 * @param {string} nonprofitId
 * @param {[]} models
 * @return {Promise}
 */
NonprofitSlidesRepository.prototype.batchSave = function (nonprofitId, models) {
  const repository = this
  const nonprofitRepository = new NonprofitRepository()
  return new Promise(function (resolve, reject) {
    nonprofitRepository.get(nonprofitId).then(function () {
      return repository.batchUpdate(models)
    }).then(function () {
      resolve()
    }).catch(function (err) {
      reject(err)
    })
  })
}

/**
 * Bulk create Nonprofits (seeder)
 *
 * @param nonprofitSlides
 * @return {Promise<any>}
 */
NonprofitSlidesRepository.prototype.batchUpdate = function (nonprofitSlides) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
      return allModels.NonprofitSlide.bulkCreate(nonprofitSlides)
    }).then(function (savedNonprofitSlides) {
      resolve(savedNonprofitSlides)
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
 * @param {Object} model
 * @param {Object} data
 * @return {Promise<any>}
 */
NonprofitSlidesRepository.prototype.upsert = function (model, data) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.NonprofitSlide.upsert({
        id: model.id,
        sortOrder: typeof data.sortOrder !== 'undefined' ? data.sortOrder : model.sortOrder,
        caption: typeof data.caption !== 'undefined' ? data.caption : model.caption,
        embedUrl: typeof data.embedUrl !== 'undefined' ? data.embedUrl : model.embedUrl,
        externalId: typeof data.externalId !== 'undefined' ? data.externalId : model.externalId,
        thumbnail: typeof data.thumbnail !== 'undefined' ? data.thumbnail : model.thumbnail,
        type: typeof data.type !== 'undefined' ? data.type : model.type,
        url: typeof data.url !== 'undefined' ? data.url : model.url,
        fileId: typeof data.fileId !== 'undefined' ? data.fileId : model.fileId,
        nonprofitId: typeof data.nonprofitId !== 'undefined' ? data.nonprofitId : model.nonprofitId
      })
    }).then(function (nonprofitSlide) {
      resolve(nonprofitSlide)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

module.exports = NonprofitSlidesRepository
