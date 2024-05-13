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
 * DonationsRepository constructor
 *
 * @constructor
 */
function DonationsRepository (options) {
  options = options || {}
  if (!options.table) {
    options.table = RepositoryHelper.DonationsTable
  }
  Repository.call(this, options)
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
DonationsRepository.prototype = new Repository()

/**
 * Look to abstract this
 *
 * @param {Object} data
 * @return {Promise}
 */
DonationsRepository.prototype.populate = function (data) {
  let allModels
  return loadModels().then(function (models) {
    allModels = models
    const donation = new models.Donation()
    return new donation.constructor(data, { isNewRecord: typeof data.id === 'undefined' })
  }).finally(function () {
    return allModels.sequelize.close()
  })
}

/**
 * Get a Donation
 *
 * @param {String} id
 * @return {Promise}
 */
DonationsRepository.prototype.get = function (id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Donation.findOne({
        where: {
          id: id
        },
        include: [
          { model: allModels.Nonprofit }
        ]
      })
    }).then(function (donation) {
      if (donation instanceof allModels.Donation) {
        resolve(donation)
      }
      reject(new ResourceNotFoundException('The specified donation does not exist.'))
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Get all Donations
 *
 * @return {Promise}
 */
DonationsRepository.prototype.getAll = function () {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Donation.findAll()
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
 * Query donations
 *
 * @param {{}} [params]
 */
DonationsRepository.prototype.queryDonations = function (params) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      params.include = [
        { model: allModels.Nonprofit },
        { model: allModels.Donor }
      ]
      return allModels.Donation.findAndCountAll(params)
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
 * Delete a Donation
 *
 * @param {String} id
 * @return {Promise}
 */
DonationsRepository.prototype.delete = function (id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.Donation.destroy({
        where:
          {
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
 * Create or update a Donation
 *
 * @param {Donation} model
 * @return {Promise}
 */
DonationsRepository.prototype.save = function (model) {
  let allModels
  const repository = this
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
      return repository.get(model.id)
    }).then(function () {
      return repository.upsert(model, {})
    }).then(function (donation) {
      resolve(donation)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Scan all items for reports
 *
 * @param {{}} whereParams
 *
 * @return {Promise}
 */
DonationsRepository.prototype.generateReport = function (whereParams) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      const params = {
        include: [
          { model: allModels.Nonprofit },
          { model: allModels.Donor }
        ],
        order: [['createdAt', 'DESC']],
        where: whereParams
      }
      return allModels.Donation.findAll(params)
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
 * Generate a specific report with CC info
 *
 * @param whereParams
 * @return {Promise<unknown>}
 */
DonationsRepository.prototype.generateLastFourReport = function (whereParams) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      const params = {
        include: [
          { model: allModels.PaymentTransaction },
          { model: allModels.Donor }
        ],
        order: [['createdAt', 'DESC']],
        where: whereParams
      }
      return allModels.Donation.findAll(params)
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
 * Insert or update the model
 *
 * @param {Object} model
 * @param {Object} data
 * @return {Promise<any>}
 */
DonationsRepository.prototype.upsert = function (model, data) {
  data = sanitizeData(data)
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      if (typeof model === 'undefined') {
        const donation = new allModels.Donation()
        model = new donation.constructor({}, { isNewRecord: typeof data.id === 'undefined' })
      }
      return allModels.Donation.upsert({
        id: model.id,
        amountForNonprofit: typeof data.amountForNonprofit !== 'undefined' ? data.amountForNonprofit : model.amountForNonprofit,
        count: typeof data.count !== 'undefined' ? data.count : model.count,
        fees: typeof data.fees !== 'undefined' ? data.fees : model.fees,
        isAnonymous: typeof data.isAnonymous !== 'undefined' ? data.isAnonymous : model.isAnonymous,
        isFeeCovered: typeof data.isFeeCovered !== 'undefined' ? data.isFeeCovered : model.isFeeCovered,
        isOfflineDonation: typeof data.isOfflineDonation !== 'undefined' ? data.isOfflineDonation : model.isOfflineDonation,
        nonprofitId: typeof data.nonprofitId !== 'undefined' ? data.nonprofitId : model.nonprofitId,
        paymentTransactionIsTestMode: typeof data.paymentTransactionIsTestMode !== 'undefined' ? data.paymentTransactionIsTestMode : model.paymentTransactionIsTestMode,
        paymentTransactionId: typeof data.paymentTransactionId !== 'undefined' ? data.paymentTransactionId : model.paymentTransactionId,
        subtotal: typeof data.subtotal !== 'undefined' ? data.subtotal : model.subtotal,
        subtotalChargedToCard: typeof data.subtotalChargedToCard !== 'undefined' ? data.subtotalChargedToCard : model.subtotalChargedToCard,
        total: typeof data.total !== 'undefined' ? data.total : model.total,
        type: typeof data.type !== 'undefined' ? data.type : model.type,
        donorId: typeof data.donorId !== 'undefined' ? data.donorId : model.donorId,
        name: typeof data.name !== 'undefined' ? data.name : model.name,
        note: typeof data.note !== 'undefined' ? data.note : model.note
      })
    }).then(function (donation) {
      resolve(donation[0])
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * bulk create donations
 *
 * @param {Array} values
 * @return {Promise<any>}
 */
DonationsRepository.prototype.bulkCreateDonations = function (values) {
  let allModels
  values = values.map(sanitizeData)
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
      return allModels.Donation.bulkCreate(values, { returning: true })
    }).then(function (savedDonations) {
      resolve(savedDonations)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Performs basic sanitization of the input data
 * @param data
 */
function sanitizeData (data) {
  if (Object.keys(data).length === 0) return {}
  const sanitized = Object.assign({}, data)
  sanitized.note = sanitized.note || ''
  return sanitized
}

module.exports = DonationsRepository
