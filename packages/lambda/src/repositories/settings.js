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
const Sequelize = require('sequelize')

/**
 * SettingsRepository constructor
 *
 * @constructor
 */
function SettingsRepository (options) {
  options = options || {}
  if (!options.table) {
    options.table = RepositoryHelper.SettingsTable
  }
  Repository.call(this, options)
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
SettingsRepository.prototype = new Repository()

/**
 * Look to abstract this
 *
 * @param {Object} data
 * @return {Promise}
 */
SettingsRepository.prototype.populate = function (data) {
  let allModels
  return loadModels().then(function (models) {
    allModels = models
    const setting = new models.Setting()
    return new setting.constructor(data, { isNewRecord: typeof data.id === 'undefined' })
  }).finally(function () {
    return allModels.sequelize.close()
  })
}

/**
 * Get a Setting
 *
 * @param {String} key
 * @param {Boolean} returnNull
 * @return {Promise}
 */
SettingsRepository.prototype.get = function (key, returnNull = false) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Setting.findOne({
        where: {
          key: key
        }
      }).then(function (setting) {
        if (setting instanceof allModels.Setting || returnNull) {
          resolve(setting)
        }
        reject(new ResourceNotFoundException('The specified setting does not exist.'))
      })
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Get all Settings
 *
 * @return {Promise}
 */
SettingsRepository.prototype.getAll = function () {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Setting.findAll()
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
 * Get Settings by keys
 *
 * @param {[]} keys
 * @return {Promise}
 */
SettingsRepository.prototype.batchGet = function (keys) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Setting.findAll({
        where: {
          key: {
            [Sequelize.Op.or]: keys
          }
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
 * Delete a Setting
 *
 * @param {String} key
 * @return {Promise}
 */
SettingsRepository.prototype.delete = function (key) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Setting.destroy({ where: { key: key } })
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
 * Batch delete Settings
 *
 * @param {[]} models
 * @return {Promise}
 */
SettingsRepository.prototype.batchDeleteByKey = function (models) {
  let allModels
  const keys = models.map(function (model) {
    return model.key
  })
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      if (keys.length > 0) {
        return allModels.Setting.destroy({
          where: {
            key: {
              [Sequelize.Op.or]: keys
            }
          }
        })
      }
      resolve()
    }).then(function (stuff) {
      resolve(stuff)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Bulk create used in initial start up
 *
 * @param {[]} data
 * @return {Promise<any>}
 */
SettingsRepository.prototype.bulkCreate = function (data) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
      return models.Setting.bulkCreate(data)
    }).then(function (setting) {
      resolve(setting)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Create or update a Setting
 *
 * @param {Setting} model
 */
SettingsRepository.prototype.save = function (model) {
  let allModels
  const repository = this
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
      if (!(model !== null)) {
        reject(new Error('invalid Setting model'))
      }
      return repository.upsert(model, {})
    }).then(function (setting) {
      resolve(setting)
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
SettingsRepository.prototype.upsert = function (model, data) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Setting.upsert({
        id: model.get('id'),
        key: typeof data.key !== 'undefined' ? data.key : model.get('key'),
        value: typeof data.value !== 'undefined' ? data.value : model.get('value')
      })
    }).then(function (setting) {
      resolve(setting)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

module.exports = SettingsRepository
