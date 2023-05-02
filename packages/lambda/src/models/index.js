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

const connect = require('./connect.js')

const doConnect = function () {
  return connect().then(function (sequelize) {
    const models = { sequelize: sequelize }
    let model = require('./setting')(sequelize)
    models[model.name] = model
    model = require('./content')(sequelize)
    models[model.name] = model
    model = require('./sponsorTier')(sequelize)
    models[model.name] = model
    model = require('./sponsor')(sequelize)
    models[model.name] = model
    model = require('./file')(sequelize)
    models[model.name] = model
    model = require('./user')(sequelize)
    models[model.name] = model
    model = require('./nonprofit')(sequelize)
    models[model.name] = model
    model = require('./nonprofitSlide')(sequelize)
    models[model.name] = model
    model = require('./nonprofitDonationTier')(sequelize)
    models[model.name] = model
    model = require('./donation')(sequelize)
    models[model.name] = model
    model = require('./donor')(sequelize)
    models[model.name] = model
    model = require('./paymentTransaction')(sequelize)
    models[model.name] = model
    model = require('./message')(sequelize)
    models[model.name] = model
    model = require('./report')(sequelize)
    models[model.name] = model
    model = require('./agreement')(sequelize)
    models[model.name] = model
    model = require('./nonprofitAgreement')(sequelize)
    models[model.name] = model

    models.Nonprofit.hasMany(sequelize.models.Donation, {
      foreignKey: 'nonprofitId'
    })

    models.Nonprofit.hasMany(sequelize.models.NonprofitSlide, {
      foreignKey: 'nonprofitId'
    })

    models.Nonprofit.hasMany(sequelize.models.NonprofitDonationTier, {
      foreignKey: 'nonprofitId'
    })

    models.Nonprofit.hasMany(sequelize.models.User, {
      foreignKey: 'nonprofitId'
    })
    models.User.belongsTo(sequelize.models.Nonprofit, {
      foreignKey: 'nonprofitId'
    })

    models.NonprofitDonationTier.belongsTo(sequelize.models.Nonprofit, {
      foreignKey: 'nonprofitId'
    })

    models.NonprofitSlide.belongsTo(sequelize.models.Nonprofit, {
      foreignKey: 'nonprofitId'
    })

    models.Agreement.belongsToMany(models.Nonprofit, {
      through: models.NonprofitAgreement,
      foreignKey: 'agreementId',
      otherKey: 'nonprofitId'
    })
    models.Nonprofit.belongsToMany(models.Agreement, {
      through: models.NonprofitAgreement,
      foreignKey: 'nonprofitId',
      otherKey: 'agreementId'
    })

    models.Nonprofit.hasMany(models.NonprofitAgreement)
    models.Agreement.hasMany(models.NonprofitAgreement)

    models.Donation.belongsTo(sequelize.models.Nonprofit, {
      foreignKey: 'nonprofitId'
    })

    models.Donation.belongsTo(sequelize.models.Donor, {})

    models.Donation.belongsTo(sequelize.models.PaymentTransaction, {})

    models.PaymentTransaction.hasMany(sequelize.models.Donation, {})

    models.Report.belongsTo(sequelize.models.File, {})

    models.Report.belongsTo(sequelize.models.Nonprofit, {})
    return models
  })
}

// We need to memoize the call otherwise instanceof etc will not work properly
// as we could have multiple (different object) copies of the same model class
// with memoize'ing we also then need to re-init the connection
// @see https://sequelize.org/docs/v6/other-topics/aws-lambda/#tldr
let connectPromise
module.exports = function () {
  if (connectPromise) {
    return connectPromise.then(conn => {
      // restart connection pool to ensure connections are not re-used across invocations
      conn.sequelize.connectionManager.initPools()

      // restore `getConnection()` if it has been overwritten by `close()`
      if (conn.sequelize.connectionManager.hasOwnProperty('getConnection')) {
        delete conn.sequelize.connectionManager.getConnection
      }
      return conn
    })
  } else {
    connectPromise = doConnect()
  }
  return connectPromise
}
