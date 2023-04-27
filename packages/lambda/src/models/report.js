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
const ReportHelper = require('./../helpers/report')

module.exports = (sequelize) => {
  return sequelize.define('Report', {
    fileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    nonprofitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ReportHelper.STATUS_PENDING,
      validate: {
        isIn: [[ReportHelper.STATUS_FAILED, ReportHelper.STATUS_PENDING, ReportHelper.STATUS_SUCCESS]]
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ReportHelper.TYPE_DONATIONS,
      validate: {
        isIn: [[ReportHelper.TYPE_DONATIONS, ReportHelper.TYPE_PAYOUT_REPORT, ReportHelper.TYPE_LAST_4, ReportHelper.TYPE_NONPROFIT_USERS]]
      }
    }
  })
}
