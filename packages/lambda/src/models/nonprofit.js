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

module.exports = (sequelize) => {
  const Nonprofit = sequelize.define('Nonprofit', {
    address1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    category2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    category3: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
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
      allowNull: false
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    legalName: {
      type: DataTypes.STRING,
      allowNull: false
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
      defaultValue: ''
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
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
      allowNull: false
    },
    taxId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    receiveDonationNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  })

  return Nonprofit
}
