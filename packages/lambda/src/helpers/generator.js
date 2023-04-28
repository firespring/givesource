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

const _ = require('lodash')
const DonationHelper = require('./donation')
const faker = require('faker')
const loadModels = require('../models/index')

/**
 * Generator constructor
 *
 * @constructor
 */
function Generator () {
}

/**
 * Available generators
 *
 * @type {Object}
 * @private
 */
Generator.prototype._generators = {

  /**
   * Generate random Donation data
   *
   * @return {Object}
   */
  donation: function () {
    const donation = {
      donorId: faker.random.number(),
      isAnonymous: faker.random.boolean(),
      isFeeCovered: faker.random.boolean(),
      isOfflineDonation: faker.random.boolean(),
      nonprofitId: faker.random.number(),
      subtotal: faker.random.arrayElement([1000, 2000, 2500, 4000, 5000, 7500, 10000, 20000, 25000]),
      note: '',
      name: ''
    }
    donation.fees = DonationHelper.calculateFees(donation.isOfflineDonation, donation.isFeeCovered, donation.subtotal, 30, 0.029)
    donation.total = donation.isFeeCovered ? donation.subtotal + donation.fees : donation.subtotal

    if (!donation.isOfflineDonation) {
      donation.paymentTransactionId = faker.random.number()
      donation.paymentTransactionIsTestMode = faker.random.boolean()
      donation.paymentTransactionStatus = 'test'
    }

    return donation
  },

  /**
   * Generate random Donor data
   *
   * @return {Object}
   */
  donor: function () {
    return {
      address1: faker.address.streetAddress(false),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
      state: faker.address.stateAbbr(),
      zip: faker.address.zipCode()
    }
  },

  /**
   * Generate random File data
   *
   * @return {Object}
   */
  file: function () {
    return {
      path: faker.system.fileName(),
      filename: faker.system.fileName()
    }
  },

  /**
   * Generate random Message data
   *
   * @return {Object}
   */
  message: function () {
    return {
      email: faker.internet.email(),
      message: faker.lorem.sentence(),
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      type: faker.random.arrayElement(['FEEDBACK', 'CONTACT'])
    }
  },

  /**
   * Generate random Metric data
   *
   * @return {Object}
   */
  metric: function () {
    return {
      key: faker.random.word(),
      value: faker.random.number()
    }
  },

  /**
   * Generate random base Model data
   *
   * @return {Object}
   */
  model: function () {
    return {}
  },

  /**
   * Generate random Nonprofit data
   *
   * @return {Object}
   */
  nonprofit: function () {
    const legalName = faker.company.companyName()
    return {
      address1: faker.address.streetAddress(false),
      address2: faker.address.secondaryAddress(),
      category1: faker.random.number({ min: 1, max: 30 }),
      category2: faker.random.number({ min: 0, max: 30 }),
      category3: faker.random.number({ min: 0, max: 30 }),
      city: faker.address.city(),
      email: faker.internet.email(),
      firstName: faker.random.word(),
      lastName: faker.random.word(),
      legalName: legalName,
      legalNameSearch: legalName.toLowerCase(),
      longDescription: faker.lorem.paragraphs(),
      phone: faker.phone.phoneNumber(),
      shortDescription: faker.random.words(),
      slug: faker.lorem.slug(),
      state: faker.address.stateAbbr(),
      status: faker.random.arrayElement(['ACTIVE', 'DENIED', 'PENDING']),
      taxId: faker.random.alphaNumeric(10),
      zip: faker.address.zipCode()
    }
  },

  /**
   * Generate random NonprofitDonationTier data
   *
   * @return {Object}
   */
  nonprofitDonationTier: function () {
    return {
      amount: faker.random.arrayElement([1000, 2000, 2500, 4000, 5000, 6000, 7500, 10000, 20000, 50000]),
      description: faker.random.words(),
      nonprofitId: faker.random.number()
    }
  },

  /**
   * Generate random NonprofitSlide data
   *
   * @return {Object}
   */
  nonprofitSlide: function () {
    return {
      caption: faker.random.word(),
      embedUrl: faker.internet.url(),
      externalId: faker.random.word(),
      fileId: faker.random.number(),
      nonprofitId: faker.random.number(),
      sortOrder: faker.random.number(),
      thumbnail: 'https://picsum.photos/640/480',
      type: faker.random.arrayElement(['IMAGE', 'VIMEO', 'YOUTUBE']),
      url: 'https://picsum.photos/800/600'
    }
  },

  /**
   * Generate random PaymentTransaction data
   *
   * @return {Object}
   */
  paymentTransaction: function () {
    return {
      billingZip: faker.address.zipCode(),
      creditCardExpirationMonth: new Date().getMonth(),
      creditCardExpirationYear: new Date().getFullYear() + 1,
      creditCardLast4: '1234',
      creditCardName: faker.name.findName(),
      creditCardType: faker.random.arrayElement(['amex', 'discover', 'mastercard', 'visa']),
      isTestMode: faker.random.boolean(),
      transactionAmount: faker.random.number(),
      transactionId: faker.random.alphaNumeric(10),
      transactionStatus: 'test'
    }
  },

  /**
   * Generate random Report data
   *
   * @return {Object}
   */
  report: function () {
    return {
      status: faker.random.arrayElement(['FAILED', 'PENDING', 'SUCCESS']),
      type: faker.random.arrayElement(['DONATIONS', 'PAYOUT_REPORT']),
      url: faker.internet.url()
    }
  },

  /**
   * Generate random Setting data
   *
   * @return {Object}
   */
  setting: function () {
    return {
      key: faker.random.word(),
      value: faker.random.word()
    }
  },

  /**
   * Generate random Sponsor data
   *
   * @return {Object}
   */
  sponsor: function () {
    return {
      fileId: faker.random.number(),
      name: faker.random.word(),
      sortOrder: faker.random.number(),
      sponsorTierId: faker.random.number(),
      url: faker.internet.url()
    }
  },

  /**
   * Generate random Sponsor Tier data
   *
   * @return {Object}
   */
  sponsorTier: function () {
    return {
      name: faker.random.word(),
      size: faker.random.arrayElement(['LARGE', 'DEFAULT', 'SMALL']),
      sortOrder: faker.random.number()
    }
  },

  /**
   * Generate random User data
   *
   * @return {Object}
   */
  user: function () {
    return {
      cognitoUuid: faker.random.uuid(),
      cognitoUsername: faker.random.uuid(),
      email: faker.internet.email(),
      lastName: faker.name.firstName(),
      firstName: faker.name.lastName(),
      nonprofitId: faker.random.number()
    }
  }

}

/**
 * Validate the type
 *
 * @param {String} type
 * @private
 */
Generator.prototype._validateType = function (type) {
  if (Object.keys(this._generators).indexOf(type) === -1) {
    throw new Error(`${type} generator does not exist`)
  }
}

/**
 * Generate data for a model
 *
 * @param {String} type
 * @param {{}} [data]
 */
Generator.prototype.data = function (type, data) {
  data = data || {}
  this._validateType(type)
  return _.extend({}, this._generators[type](), data)
}

/**
 * Generate an array of model data
 *
 * @param {String} type
 * @param {int} [count]
 * @param {{}} [data]
 * @return {Array}
 */
Generator.prototype.dataCollection = function (type, count, data) {
  this._validateType(type)
  count = count || 3
  const results = []
  for (let i = 0; i < count; i++) {
    results.push(this.data(type, data))
  }
  return results
}

/**
 * Generate an array of Models
 *
 * @param {String} type
 * @param {int} [count]
 * @param {{}} [data]
 * @return {Array}
 */
Generator.prototype.modelCollection = function (type, count, data) {
  this._validateType(type)
  const modelType = type.charAt(0).toUpperCase() + type.slice(1)
  let allModels
  const generatorContext = this
  count = count || 3
  const results = []
  return loadModels().then(function (models) {
    allModels = models
    for (let i = 0; i < count; i++) {
      const model = models[modelType].build(generatorContext.data(type, data))
      results.push(model)
    }
  }).then(function () {
    return results
  }).finally(function () {
    return allModels.sequelize.close()
  })
}

/**
 * Generate a model
 *
 * @param {String} type
 * @param {{}} [data]
 * @return {*}
 */
Generator.prototype.model = function (type, data) {
  this._validateType(type)
  let allModels
  const generatorContext = this
  return loadModels().then(function (models) {
    allModels = models
    const modelType = type.charAt(0).toUpperCase() + type.slice(1)
    const model = models[modelType].build(generatorContext.data(type, data))
    return model
  }).finally(function () {
    return allModels.sequelize.close()
  })
}

module.exports = Generator
