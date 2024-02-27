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
const ReportHelper = require('./../helpers/report')
class Report extends Model {}

module.exports = (sequelize) => {
  return Report.init({
    // todo `fileId` is redundant with the `FileId` attribute automatically create by
    // models.Report.belongsTo(sequelize.models.File, {})
    fileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // todo `nonprofitId` is redundant with the `NonprofitId` attribute automatically create by
    // models.Report.belongsTo(sequelize.models.Nonprofit, {})
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
  },
  { sequelize, modelName: 'Report' })
}
