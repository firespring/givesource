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

const FilesRepository = require('./../../repositories/files')
const logger = require('./../../helpers/log')
const ReportsRepository = require('./../../repositories/reports')
const S3 = require('./../../aws/s3')

exports.handle = function (event, context, callback) {
  logger.log(`${context.functionName} event: %j`, event)
  const filesRepository = new FilesRepository()
  const reportsRepository = new ReportsRepository()
  const s3 = new S3()

  const expire = new Date()
  expire.setHours(expire.getHours() - 1)

  let filesCount = 0; let processedCount = 0; let reportsCount = 0
  // reportsRepository.getAll({
  //   include: [
  //     {
  //       model: allModels.Donation,
  //       required: false
  //     }
  //   ]
  // })
  reportsRepository.getAll().then(function (reports) {
    let promise = Promise.resolve()
    // console.log('reports', reports.map(report => {
    //   return {
    //     co: report.createdOn,
    //     uuid: report.fileUuid,
    //     ca: report.createdAt,
    //     p: report.path,
    //     dataValues: JSON.stringify(report.dataValues),
    //     file: JSON.stringify(report.File?.dataValues),
    //     filePath: report.File?.path
    //   }
    // }))
    /**
     * {
     *     co: undefined,
     *     uuid: undefined,
     *     ca: 2023-04-27T16:28:14.000Z,
     *     p: undefined,
     *     dataValues: '
     *     {"id":62,"fileId":63,"nonprofitId":0,"status":"SUCCESS","type":"LAST_4_REPORT","createdAt":"2023-04-27T16:28:14.000Z","updatedAt":"2023-04-27T16:28:15.000Z","FileId":63,"NonprofitId":0}
     *     '
     *   }
     */
    reports.forEach(function (report) {
      // console.log({report, F: report.File, filePath: report.File?.path, file: JSON.stringify(report.File?.dataValues)})
      console.log((new Date(report.createdAt)) <= expire, {fid: report.fileId, report: JSON.stringify(report.dataValues), filePath: report.File?.path, file: JSON.stringify(report.File?.dataValues)})
      processedCount += 1
      if ((new Date(report.createdAt)) <= expire) { // todo createdAt ?
        reportsCount += 1
        if (report.File?.path && report.fileId) { // todo
          promise = promise.then(function () {
            console.log('deleting from s3', {rFid: report.fileId, fid: report.File.id})
            return s3.deleteObject(process.env.AWS_REGION, process.env.AWS_S3_BUCKET_NAME, report.File.path).then(function () {
              filesCount += 1
              console.log('deleting from file repo', {rFid: report.fileId, fid: report.File.id})
              return filesRepository.delete(report.fileId)
            })
          })
        }

        promise = promise.then(function () {
          console.log('deleting from report repo', {rid: report.id})
          return reportsRepository.delete(report.id)
        })
      }
    })
    return promise
  }).then(function () {
    logger.log(`Reports processed: ${processedCount}. Reports deleted: ${reportsCount}. Files deleted: ${filesCount}.`)
    callback()
  }).catch(function (err) {
    console.log(err)
    callback()
  })
}
