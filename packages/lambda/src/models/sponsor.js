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
const { isNumericType, isString } = require('../helpers/validation')
class Sponsor extends Model {}

module.exports = (sequelize) => {
  Sponsor.init({
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    sponsorTierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  { sequelize, modelName: 'Sponsor' })

  Sponsor.associate = function (models) {
    Sponsor.hasOne(models.SponsorTier, {
      foreignKey: 'sponsorTierId'
    })
  }

  return Sponsor
}
