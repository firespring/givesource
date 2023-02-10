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

const fs = require('fs')
const path = require('path')
const logger = require('./../../helpers/log')
const response = require('cfn-response')
const Request = require('./../../aws/request')
const S3 = require('./../../aws/s3')
const SecretsManager = require('./../../aws/secretsManager')
const mysql2 = require('mysql2')
const Sequelize = require('sequelize')
const Umzug = require('umzug')
const cacert = `-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL
MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv
b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj
ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM
9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw
IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6
VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L
93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm
jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA
A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI
U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs
N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv
o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU
5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy
rqXRfboQnoZsG4q5WTP468SQvvG5
-----END CERTIFICATE-----`

exports.handle = function (event, context, callback) {
  logger.log('migrateDatabase event: %j', event)

  const secretsManager = new SecretsManager()
  const request = new Request(event, context)
  const s3 = new S3()
  const localPath = '/tmp'

  if (event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS)
    return
  }

  request.validate().then(function () {
    fs.rmdirSync(path.join(localPath, process.env.MIGRATIONS_LOCATION), { recursive: true })
    return s3.listObjects(process.env.AWS_REGION, process.env.MIGRATIONS_BUCKET, process.env.MIGRATIONS_LOCATION).then(function (objects) {
      return Promise.all(objects.map(function (obj) {
        return s3.downloadObject(process.env.AWS_REGION, process.env.MIGRATIONS_BUCKET, obj.Key, localPath)
      }))
    })
  }).then(function () {
    return secretsManager.getSecretValue(process.env.AWS_REGION, process.env.MAINTENANCE_DATABASE_SECRET_ID)
  }).then(function (secret) {
    const dbHost = process.env.DATABASE_HOST
    const dbName = process.env.DATABASE_NAME
    const maintenanceSecret = JSON.parse(secret.SecretString)
    const sequelize = new Sequelize({
      host: dbHost,
      username: maintenanceSecret.username,
      password: maintenanceSecret.password,
      database: dbName,
      dialect: 'mysql',
      dialectModule: mysql2,
      port: 3306,
      dialectOptions: {
        ssl: { ca: cacert }
      }
    })

    const umzug = new Umzug({
      migrations: {
        path: path.join(localPath, process.env.MIGRATIONS_LOCATION),
        params: [
          sequelize.getQueryInterface(),
          Sequelize
        ],
        customResolver: function (filePath) {
          return __non_webpack_require__(filePath)
        }
      },
      storage: 'sequelize',
      storageOptions: {
        sequelize: sequelize
      }
    })
    return umzug
  }).then(function (umzug) {
    if (event.down) {
      return umzug.down({ to: '' + event.down })
    } else {
      return umzug.up()
    }
  }).then(function (migrations) {
    logger.log('Ran migrations:' + migrations.map(it => { return it.file }))
    response.send(event, context, response.SUCCESS, {})
    callback()
  }).catch(function (err) {
    logger.log(err)
    response.send(event, context, response.FAILED, {})
    callback(err)
  })
}
