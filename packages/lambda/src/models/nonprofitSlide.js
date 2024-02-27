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
const { isString, isNumericType } = require('../helpers/validation')
const { TYPE_IMAGE, TYPE_VIMEO, TYPE_YOUTUBE } = require('../helpers/nonprofitSlide')
class NonprofitSlide extends Model {}

module.exports = (sequelize) => {
  return NonprofitSlide.init({
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString }
    },
    embedUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    externalId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: [[TYPE_IMAGE, TYPE_VIMEO, TYPE_YOUTUBE]] }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString }
    },
    fileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    nonprofitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isNumericType }
    }
  },
  { sequelize, modelName: 'NonprofitSlide' })
}
