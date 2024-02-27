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

'use strict'

const { DataTypes, Model } = require('sequelize')
const numeral = require('numeral')
const dayjs = require('./../helpers/day')

const { isNumericType, isImplicitBool } = require('../helpers/validation')

class Donation extends Model {}

module.exports = (sequelize) => {
  return Donation.init({
    amountForNonprofit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      get: function () {
        if (this.dataValues.amountForNonprofit) {
          // if a value was explicitly set, use that
          return this.dataValues.amountForNonprofit
        }
        // calculate default
        return (this.total - this.fees) || 0
      }
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    fees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: { isBoolean: true }
    },
    isFeeCovered: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      validate: { isImplicitBool }
    },
    isOfflineDonation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: { isBoolean: true }
    },
    nonprofitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumeric: true }
    },
    paymentTransactionIsTestMode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    paymentTransactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    },
    subtotalChargedToCard: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    donorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumeric: true }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Donation',
    paranoid: true,
    timestamps: true,
    getterMethods: {
      formattedAmount () {
        return numeral(this.total / 100).format('$0,0.00')
      },
      formattedDonationFee () {
        return numeral(this.fees / 100).format('$0,0.00')
      },
      formattedSubtotalChargedToCard () {
        return numeral(this.subtotalChargedToCard / 100).format('$0,0.00')
      },
      formattedAmountForNonprofit () {
        return numeral(this.amountForNonprofit / 100).format('$0,0.00')
      },
      isOfflineDonationExport () {
        return this.isOfflineDonation ? 'Yes' : 'No'
      },
      isFeeCoveredExport () {
        return this.isFeeCovered ? 'Yes' : 'No'
      },
      formattedSubtotal () {
        return numeral(this.subtotal / 100).format('$0,0.00')
      }
    },
    setterMethods: {
      timezone (timezone) {
        if (timezone) {
          this.setDataValue('createdAt', dayjs.tz(this.createdAt, timezone).format('M/D/YYYY h:mm:ss A'))
        } else {
          const date = dayjs(this.createdAt).format('M/D/YYYY h:mm:ss A')
          this.setDataValue('createdAt', date)
        }
      },
      mutate () {
        this.setDataValue('total', this.formattedAmount)
        this.setDataValue('subtotal', this.formattedSubtotal)
        this.setDataValue('fees', this.formattedDonationFee)
        this.setDataValue('subtotalChargedToCard', this.formattedSubtotalChargedToCard)
        this.setDataValue('amountForNonprofit', this.formattedAmountForNonprofit)
        this.setDataValue('isOfflineDonation', this.isOfflineDonationExport)
        this.setDataValue('isFeeCovered', this.isFeeCoveredExport)
      }
    }
  })
}
