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
const { isString, isEmail, isNumericType } = require('../helpers/validation')
const { STATUS_ACTIVE, STATUS_DENIED, STATUS_PENDING, STATUS_REVOKED } = require('../helpers/nonprofit')
class Nonprofit extends Model {}

module.exports = (sequelize) => {
  Nonprofit.init({
    address1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString }
    },
    category1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    },
    category2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    },
    category3: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    legalName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    legalNameSearch: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    logoFileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    longDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString }
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: { isString }
    },
    socialSharingDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    socialSharingFileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'PENDING',
      validate: { isIn: [[STATUS_ACTIVE, STATUS_DENIED, STATUS_PENDING, STATUS_REVOKED]] }
    },
    taxId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    receiveDonationNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  { sequelize, modelName: 'Nonprofit' })

  return Nonprofit
}
