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
 * MessagesRepository constructor
 *
 * @constructor
 */
function MessagesRepository (options) {
  options = options || {}
  if (!options.table) {
    options.table = RepositoryHelper.MessagesTable
  }
  Repository.call(this, options)
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
MessagesRepository.prototype = new Repository()

/**
 * Look to abstract this
 *
 * @param {Object} data
 * @return {Promise}
 */
MessagesRepository.prototype.populate = function (data) {
  let allModels
  return loadModels().then(function (models) {
    allModels = models
    const message = new models.Message()
    return new message.constructor(data, { isNewRecord: typeof data.id === 'undefined' })
  }).finally(function () {
    return allModels.sequelize.close()
  })
}

/**
 * Get a Message
 *
 * @param {String} id
 * @return {Promise}
 */
MessagesRepository.prototype.get = function (id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Message.findOne({
        where: {
          id: id
        }
      })
    }).then(function (message) {
      if (message instanceof allModels.Message) {
        resolve(message)
      }
      reject(new ResourceNotFoundException('The specified message does not exist.'))
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Get all Messages
 *
 * @return {Promise}
 */
MessagesRepository.prototype.getAll = function () {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Message.findAll()
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
 * Delete a Message
 *
 * @param {String} id
 * @return {Promise}
 */
MessagesRepository.prototype.delete = function (id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Message.destroy({
        where: {
          id: id
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
 * Create or update a Message
 *
 * @param {Message} model
 */
MessagesRepository.prototype.save = function (model) {
  let allModels
  const repository = this
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
      return repository.get(model.id)
    }).then(function () {
      return repository.upsert(model, {})
    }).then(function (message) {
      resolve(message)
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
MessagesRepository.prototype.upsert = function (model, data) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      if (typeof model === 'undefined') {
        const message = new allModels.Message()
        model = new message.constructor({}, { isNewRecord: typeof data.id === 'undefined' })
      }
      return allModels.Message.upsert({
        id: model.id,
        email: typeof data.email !== 'undefined' ? data.email : model.email,
        name: typeof data.name !== 'undefined' ? data.name : model.name,
        phone: typeof data.phone !== 'undefined' ? data.phone : model.phone,
        type: typeof data.type !== 'undefined' ? data.type : model.type,
        message: typeof data.message !== 'undefined' ? data.message : model.message
      })
    }).then(function (message) {
      resolve(message[0])
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

module.exports = MessagesRepository
