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

'use strict';

const fs = require('fs');
const path = require('path');
const connect = require('./connect.js');

module.exports = function() {
	return connect().then(function(sequelize) {
		const models = {"sequelize": sequelize};
		let model = require('./setting')(sequelize);
		models[model.name] = model;
		model = require('./content')(sequelize);
		models[model.name] = model;
		model = require('./sponsorTier')(sequelize);
		models[model.name] = model;
		model = require('./sponsor')(sequelize);
		models[model.name] = model;
		model = require('./file')(sequelize);
		models[model.name] = model;
		model = require('./user')(sequelize);
		models[model.name] = model;
		model = require('./nonprofit')(sequelize);
		models[model.name] = model;
		model = require('./nonprofitSlide')(sequelize);
		models[model.name] = model;
		model = require('./nonprofitDonationTier')(sequelize);
		models[model.name] = model;
		model = require('./donation')(sequelize);
		models[model.name] = model;
		model = require('./donor')(sequelize);
		models[model.name] = model;
		model = require('./paymentTransaction')(sequelize);
		models[model.name] = model;
		model = require('./message')(sequelize);
		models[model.name] = model;

		models.Nonprofit.hasMany(sequelize.models.NonprofitSlide, {
			foreignKey: 'nonprofitId'
		});

		models.Nonprofit.hasMany(sequelize.models.NonprofitDonationTier, {
			foreignKey: 'nonprofitId'
		});

		models.NonprofitDonationTier.belongsTo(sequelize.models.Nonprofit, {
			foreignKey: 'nonprofitId'
		});

		models.NonprofitSlide.belongsTo(sequelize.models.Nonprofit, {
			foreignKey: 'nonprofitId'
		});

		models.Donation.belongsTo(sequelize.models.Nonprofit, {
			foreignKey: 'nonprofitId'
		});

		models.Donation.belongsTo(sequelize.models.Donor, {});

		models.Donation.hasOne(sequelize.models.PaymentTransaction, {
			foreignKey: 'paymentTransactionId'
		});

		return models;
	});
}
