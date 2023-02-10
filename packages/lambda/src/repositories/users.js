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
 * UsersRepository constructor
 *
 * @constructor
 */
function UsersRepository (options) {
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
UsersRepository.prototype = new Repository()

/**
 * Look to abstract this
 *
 * @param data
 * @return {Promise}
 */
UsersRepository.prototype.populate = function (data) {
  let allModels
  return loadModels().then(function (models) {
    allModels = models
    return new models.User(data)
  }).finally(function () {
    return allModels.sequelize.close()
  })
}

/**
 * Get a User
 *
 * @param {String} id
 * @return {Promise}
 */
UsersRepository.prototype.get = function (id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.User.findOne({
        where: {
          id: id
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
 * Get a User by cognitoUsername
 *
 * @param {String} cognitoUsername
 * @return {Promise}
 */
UsersRepository.prototype.getByCognitoUsername = function (cognitoUsername) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.User.findOne({
        where: {
          cognitoUsername: cognitoUsername
        }
      }).then(function (user) {
        if (user instanceof allModels.User) {
          resolve(user)
        }
        reject(new ResourceNotFoundException('The specified user does not exist.'))
      })
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Get all Users
 *
 * @return {Promise}
 */
UsersRepository.prototype.getAll = function () {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.User.findAll()
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
 * Get all admin Users
 *
 * @return {Promise}
 */
UsersRepository.prototype.getAdminUsers = function () {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.User.findAll({
        where: {
          nonprofitId: 0
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
 * @param {String} id
 * @return {Promise}
 */
UsersRepository.prototype.delete = function (id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.User.destroy({ where: { id: id } })
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
 * Update a User
 *
 * @param {User} model
 */
UsersRepository.prototype.save = function (model) {
  let allModels
  const repository = this
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
      return repository.get(model.id)
    }).then(function () {
      return repository.upsert(model, {})
    }).then(function (user) {
      resolve(user)
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
UsersRepository.prototype.upsert = function (model, data) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.User.upsert({
        id: model.id,
        email: typeof data.email !== 'undefined' ? data.email : model.email,
        firstName: typeof data.firstName !== 'undefined' ? data.firstName : model.firstName,
        lastName: typeof data.lastName !== 'undefined' ? data.lastName : model.lastName,
        isVerified: typeof data.isVerified !== 'undefined' ? data.isVerified : model.isVerified,
        nonprofitId: typeof data.nonprofitId !== 'undefined' ? data.nonprofitId : model.nonprofitId,
        cognitoUsername: typeof data.cognitoUsername !== 'undefined' ? data.cognitoUsername : model.cognitoUsername,
        cognitoUuid: typeof data.cognitoUuid !== 'undefined' ? data.cognitoUuid : model.cognitoUuid
      })
    }).then(function (user) {
      resolve(user)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

module.exports = UsersRepository
