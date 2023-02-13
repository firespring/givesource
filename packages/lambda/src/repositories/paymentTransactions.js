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
 * PaymentTransactionsRepository constructor
 *
 * @constructor
 */
function PaymentTransactionsRepository (options) {
  options = options || {}
  if (!options.table) {
    options.table = RepositoryHelper.PaymentTransactionsTable
  }
  Repository.call(this, options)
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
PaymentTransactionsRepository.prototype = new Repository()

/**
 * Look to abstract this
 *
 * @param {Object} data
 * @return {Promise}
 */
PaymentTransactionsRepository.prototype.populate = function (data) {
  let allModels
  return loadModels().then(function (models) {
    allModels = models
    const paymentTransaction = new models.PaymentTransaction()
    return new paymentTransaction.constructor(data, { isNewRecord: typeof data.id === 'undefined' })
  }).finally(function () {
    return allModels.sequelize.close()
  })
}

/**
 * Get a PaymentTransaction
 *
 * @param {String} id
 * @return {Promise}
 */
PaymentTransactionsRepository.prototype.get = function (id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.PaymentTransaction.findOne({
        where: {
          id: id
        },
        include: [
          {
            model: allModels.Donation,
            include: [
              { model: allModels.Nonprofit }
            ]
          }
        ]

      })
    }).then(function (paymentTransaction) {
      if (paymentTransaction instanceof allModels.PaymentTransaction) {
        resolve(paymentTransaction)
      }
      reject(new ResourceNotFoundException('The specified paymentTransaction does not exist.'))
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Get all PaymentTransactions
 *
 * @return {Promise}
 */
PaymentTransactionsRepository.prototype.getAll = function (params = {}) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.PaymentTransaction.findAll(params)
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
 * Delete a PaymentTransaction
 *
 * @param {String} id
 * @return {Promise}
 */
PaymentTransactionsRepository.prototype.delete = function (id) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      return allModels.PaymentTransaction.destroy({
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
 * Create or update a PaymentTransaction
 *
 * @param {PaymentTransaction} model
 */
PaymentTransactionsRepository.prototype.save = function (model) {
  let allModels
  const repository = this
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
      return repository.get(model.id)
    }).then(function () {
      return repository.upsert(model, {})
    }).then(function (paymentTransaction) {
      resolve(paymentTransaction)
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
PaymentTransactionsRepository.prototype.upsert = function (model, data) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
    }).then(function () {
      if (typeof model === 'undefined') {
        const paymentTransaction = new allModels.PaymentTransaction()
        model = new paymentTransaction.constructor({}, { isNewRecord: typeof data.id === 'undefined' })
      }
      return allModels.PaymentTransaction.upsert({
        id: model.id,
        billingZip: typeof data.billingZip !== 'undefined' ? data.billingZip : model.billingZip,
        creditCardExpirationMonth: typeof data.creditCardExpirationMonth !== 'undefined' ? data.creditCardExpirationMonth : model.creditCardExpirationMonth,
        creditCardExpirationYear: typeof data.creditCardExpirationYear !== 'undefined' ? data.creditCardExpirationYear : model.creditCardExpirationYear,
        creditCardLast4: typeof data.creditCardLast4 !== 'undefined' ? data.creditCardLast4 : model.creditCardLast4,
        creditCardName: typeof data.creditCardName !== 'undefined' ? data.creditCardName : model.creditCardName,
        creditCardType: typeof data.creditCardType !== 'undefined' ? data.creditCardType : model.creditCardType,
        isTestMode: typeof data.isTestMode !== 'undefined' ? data.isTestMode : model.isTestMode,
        transactionAmount: typeof data.transactionAmount !== 'undefined' ? data.transactionAmount : model.transactionAmount,
        transactionId: typeof data.transactionId !== 'undefined' ? data.transactionId : model.transactionId,
        transactionStatus: typeof data.transactionStatus !== 'undefined' ? data.transactionStatus : model.transactionStatus
      })
    }).then(function (paymentTransaction) {
      resolve(paymentTransaction[0])
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

/**
 * Bulk create PaymentTransactions (seeder)
 *
 * @param {Array} pts
 * @return {Promise<any>}
 */
PaymentTransactionsRepository.prototype.batchUpdate = function (pts) {
  let allModels
  return new Promise(function (resolve, reject) {
    return loadModels().then(function (models) {
      allModels = models
      return allModels.PaymentTransaction.bulkCreate(pts)
    }).then(function (savedPaymentTransactions) {
      resolve(savedPaymentTransactions)
    }).catch(function (err) {
      reject(err)
    }).finally(function () {
      return allModels.sequelize.close()
    })
  })
}

module.exports = PaymentTransactionsRepository
