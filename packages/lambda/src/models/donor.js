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
	return sequelize.define('Donor', {
		amountForNonprofit: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		address1: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		address2: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		state: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		zip: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
	}, {
		setterMethods: {
			donorIsAnonymous() {
				this.setDataValue('firstName', 'Anonymous');
				this.setDataValue('lastName', '');
				this.setDataValue('address1', '');
				this.setDataValue('address2', '');
				this.setDataValue('city', '');
				this.setDataValue('state', '');
				this.setDataValue('zip', '');
				this.setDataValue('email', '');
				this.setDataValue('phone', '');
			}
		}
	});
};