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

const { DataTypes } = require('sequelize')
const numeral = require('numeral')
const moment = require('moment-timezone')

module.exports = (sequelize) => {
  return sequelize.define('Donation', {
    amountForNonprofit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: this.total - this.fees
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    fees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isFeeCovered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isOfflineDonation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    nonprofitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    paymentTransactionIsTestMode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    paymentTransactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    subtotalChargedToCard: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    donorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
          this.setDataValue('createdAt', moment.tz(this.createdAt, timezone).format('M/D/YYYY h:mm:ss A'))
        } else {
          const date = moment(this.createdAt, 'M/D/YYYY h:mm:ss A')
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
