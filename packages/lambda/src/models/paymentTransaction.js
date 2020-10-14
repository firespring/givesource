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

const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
	return sequelize.define('PaymentTransaction', {
		billingZip: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		creditCardExpirationMonth: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		creditCardExpirationYear: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		creditCardLast4: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		creditCardName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		creditCardType: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		isTestMode: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		transactionAmount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		transactionId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		transactionStatus: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};