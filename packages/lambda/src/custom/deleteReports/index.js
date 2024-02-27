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
  reportsRepository.getAll().then(function (reports) {
    let promise = Promise.resolve()

    reports.forEach(function (report) {
      processedCount += 1
      if ((new Date(report.createdAt)) <= expire) {
        reportsCount += 1
        if (report.File?.path && report.fileId) {
          promise = promise.then(function () {
            return s3.deleteObject(process.env.AWS_REGION, process.env.AWS_S3_BUCKET_NAME, report.File.path).then(function () {
              filesCount += 1
              return filesRepository.delete(report.fileId)
            })
          })
        }

        promise = promise.then(function () {
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
