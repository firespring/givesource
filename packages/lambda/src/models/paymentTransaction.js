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
const { isString, isBoolean, isNumericType } = require('../helpers/validation')
class PaymentTransaction extends Model {}

module.exports = (sequelize) => {
  return PaymentTransaction.init({
    billingZip: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    creditCardExpirationMonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    },
    creditCardExpirationYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    },
    creditCardLast4: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    creditCardName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    creditCardType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    isTestMode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: { isBoolean }
    },
    transactionAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    transactionStatus: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PaymentTransaction',
    getterMethods: {
      formattedAmount () {
        return numeral(this.transactionAmount / 100).format('$0,0.00')
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
      }
    }
  })
}
