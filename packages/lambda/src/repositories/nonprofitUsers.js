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

const UsersRepository = require('./users')
const Repository = require('./repository')
const RepositoryHelper = require('./../helpers/repository')
const ResourceNotFoundException = require('./../exceptions/resourceNotFound')
const loadModels = require('../models/index')

/**
 * NonprofitUsersRepository constructor
 *
 * @constructor
 */
function NonprofitUsersRepository (options) {
  options = options || {}
  if (!options.table) {
    options.table = RepositoryHelper.UsersTable
  }
  Repository.call(this, options)
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
NonprofitUsersRepository.prototype = new Repository()

/**
 * Get a User
 *
 * @param {String} nonprofitId
 * @param {String} id
 * @return {Promise}
 */
NonprofitUsersRepository.prototype.get = function (nonprofitId, id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.User.findOne({
        where: {
          id: id,
          nonprofitId: nonprofitId
        }
      })
    }).then(function (user) {
      if (user instanceof allModels.User) {
        resolve(user)
      }
      reject(new ResourceNotFoundException('The specified user does not exist.'))
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Get all Users for a Nonprofit
 *
 * @param {String} nonprofitId
 * @return {Promise}
 */
NonprofitUsersRepository.prototype.getAll = function (nonprofitId) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.User.findAll({
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
 * Delete a User
 *
 * @param {String} nonprofitId
 * @param {String} id
 * @return {Promise}
 */
NonprofitUsersRepository.prototype.delete = function (nonprofitId, id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.User.destroy({ where: { id: id, nonprofitId: nonprofitId } })
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
 * Create or update a User
 *
 * @param {String} nonprofitId
 * @param {User} model
 */
NonprofitUsersRepository.prototype.save = function (nonprofitId, model) {
  let allModels
  const repository = this
  const usersRepository = new UsersRepository()
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
      return repository.get(nonprofitId, model.id)
    }).then(function () {
      return usersRepository.upsert(model, {})
    }).then(function (user) {
      resolve(user)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

module.exports = NonprofitUsersRepository
