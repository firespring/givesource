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
class File extends Model {}

const { isString } = require('../helpers/validation')

module.exports = (sequelize) => {
  return File.init({
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    }
  }, { sequelize, modelName: 'File' })
}
