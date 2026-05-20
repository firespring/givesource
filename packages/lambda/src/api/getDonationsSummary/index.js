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

const HttpException = require('./../../exceptions/http')
const Request = require('./../../aws/request')
const Sequelize = require('sequelize')
const loadModels = require('../../models/index')

exports.handle = function (event, context, callback) {
  const request = new Request(event, context)

  let allModels
  let metrics = {}
  let topNonprofits = []
  let matchFundNonprofitId = null

  request.validate().then(function () {
    return loadModels()
  }).then(function (models) {
    allModels = models
    return allModels.Donation.findAll({
      attributes: [
        'count', [allModels.sequelize.fn('sum', allModels.sequelize.col('count')), 'donationsCount'],
        'subtotal', [allModels.sequelize.fn('sum', allModels.sequelize.col('subtotal')), 'donationsTotal']
      ],
      raw: true
    })
  }).then(function (results) {
    var result = results[0]
    metrics.donationsTotal = result.donationsTotal
    metrics.donationsCount = result.donationsCount

    return allModels.Setting.findOne({
      where: { key: 'MATCH_FUND_NONPROFIT_ID' }
    })
  }).then(function (setting) {
    if (setting) {
      matchFundNonprofitId = setting.value
    }

    var where = [{ status: 'ACTIVE' }]
    if (matchFundNonprofitId) {
      where.push({
        id: {
          [Sequelize.Op.ne]: matchFundNonprofitId
        }
      })
    }

    var attr = Object.keys(allModels.Nonprofit.rawAttributes)
    attr.push([allModels.sequelize.fn('sum', allModels.sequelize.col('Donations.subtotal')), 'donationsSubtotal'])
    return allModels.Nonprofit.findAll({
      attributes: attr,
      include: [
        { model: allModels.Donation, attributes: [] }
      ],
      group: ['Nonprofit.id'],
      where: where,
      order: allModels.sequelize.literal('donationsSubtotal DESC LIMIT 0, 10')
    })
  }).then(function (results) {
    topNonprofits = results.map(function (np) {
      return {
        legalName: np.legalName,
        slug: np.slug,
        donationsSubtotal: np.get('donationsSubtotal')
      }
    })

    callback(null, {
      timestamp: new Date().toISOString(),
      donationsTotal: metrics.donationsTotal,
      donationsCount: metrics.donationsCount,
      topNonprofits: topNonprofits
    })
  }).catch(function (err) {
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  }).finally(function () {
    if (allModels) {
      return allModels.sequelize.close()
    }
  })
}
