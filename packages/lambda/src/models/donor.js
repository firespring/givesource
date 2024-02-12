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
class Donor extends Model {}

const { isEmail, isString } = require('../helpers/validation')

module.exports = (sequelize) => {
  return Donor.init({
    amountForNonprofit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString }
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString, notEmpty: true }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString, notEmpty: true }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString }
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString }
    }
  }, {
    sequelize,
    modelName: 'Donor',
    setterMethods: {
      donorIsAnonymous () {
        this.setDataValue('firstName', 'Anonymous')
        this.setDataValue('lastName', '')
        this.setDataValue('address1', '')
        this.setDataValue('address2', '')
        this.setDataValue('city', '')
        this.setDataValue('state', '')
        this.setDataValue('zip', '')
        this.setDataValue('email', '')
        this.setDataValue('phone', '')
      }
    }
  })
}
