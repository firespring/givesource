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
	const NonprofitSlide = sequelize.define('NonprofitSlide', {
		sortOrder: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		caption: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		embedUrl: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		externalId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		thumbnail: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
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
	});

	// NonprofitSlide.belongsTo(sequelize.models.Nonprofit, {
	// 	foreignKey: 'nonprofitId'
	// });
	//
	// NonprofitSlide.hasOne(sequelize.models.File, {
	// 	foreignKey: 'fileId'
	// });

	return NonprofitSlide;
};