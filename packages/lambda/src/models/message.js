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
const dayjs = require('./../helpers/day')

const { isString, isEmail } = require('../helpers/validation')
const { TYPE_CONTACT, TYPE_FEEDBACK, TYPE_NAME_CHANGE } = require('../helpers/message')

class Message extends Model {}

module.exports = (sequelize) => {
  return Message.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail, notEmpty: true }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isString, notEmpty: true }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: [[TYPE_CONTACT, TYPE_FEEDBACK, TYPE_NAME_CHANGE]] }
    }
  }, {
    sequelize,
    modelName: 'Message',
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
