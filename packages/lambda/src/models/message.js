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
const moment = require('moment-timezone');

module.exports = (sequelize) => {
	return sequelize.define('Message', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		setterMethods: {
			timezone(timezone) {
				if (timezone) {
					this.setDataValue('createdAt', moment.tz(this.createdAt, timezone).format('M/D/YYYY h:mm:ss A'));
				} else {
					const date = new Date(this.createdAt);
					this.setDataValue('createdAt', date.toLocaleDateString() + ' ' + date.toLocaleTimeString());
				}
			}
		}
	});
};