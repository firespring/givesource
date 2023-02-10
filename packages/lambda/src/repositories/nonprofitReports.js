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
 * NonprofitReportsRepository constructor
 *
 * @constructor
 */
function NonprofitReportsRepository (options) {
  options = options || {}
  if (!options.table) {
    options.table = RepositoryHelper.ReportsTable
  }
  Repository.call(this, options)
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
NonprofitReportsRepository.prototype = new Repository()

/**
 * Get a Report
 *
 * @param {String} nonprofitId
 * @param {String} id
 * @return {Promise}
 */
NonprofitReportsRepository.prototype.get = function (nonprofitId, id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Report.findOne({
        where: {
          id: id,
          nonprofitId: nonprofitId
        },
        include: [
          { model: allModels.Nonprofit },
          { model: allModels.File }
        ]
      })
    }).then(function (report) {
      if (report instanceof allModels.Report) {
        resolve(report)
      }
      reject(new ResourceNotFoundException('The specified report does not exist.'))
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Get all Reports for a Nonprofit
 *
 * @param {String} nonprofitId
 * @return {Promise}
 */
NonprofitReportsRepository.prototype.getAll = function (nonprofitId) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Report.findAll({
        where: {
          nonprofitId: nonprofitId
        },
        include: [
          { model: allModels.Nonprofit },
          { model: allModels.File }
        ]
      })
    }).then(function (reports) {
      resolve(reports)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Delete a Report
 *
 * @param {String} nonprofitId
 * @param {String} id
 * @return {Promise}
 */
NonprofitReportsRepository.prototype.delete = function (nonprofitId, id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Report.destroy({
        where:
					{
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

module.exports = NonprofitReportsRepository
