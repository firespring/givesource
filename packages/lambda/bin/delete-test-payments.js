/*
 * Copyright 2018 Firespring, Inc.
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

const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path: path.resolve(__dirname, './../../../.env')});
process.env.NODE_CONFIG_DIR = path.resolve(__dirname, './../../../config/');

const config = require('config');
const Donation = require('./../src/models/donation');
const DonationsRepository = require('./../src/repositories/donations');
const inquirer = require('inquirer');
const QueryBuilder = require('./../src/aws/queryBuilder');

return inquirer.prompt([
	{
		type: 'confirm',
		message: function () {
			return 'Are you sure you want to delete test payments for stack: ' + config.get('stack.AWS_STACK_NAME') + '?';
		},
		name: 'confirm',
	}
]).then(function (answers) {
	if (answers.confirm) {
		const donationsRepository = new DonationsRepository();

		const builder = new QueryBuilder('query');
		builder.limit(1000).index('paymentTransactionIsTestModeCreatedOnIndex').condition('paymentTransactionIsTestMode', '=', 1).condition('createdOn', '>', 0).scanIndexForward(false);
		return donationsRepository.batchQuery(builder).then(function (response) {
			if (response.Count) {
				return Promise.resolve(response.Items.map(function (item) {
					return new Donation(item);
				}));
			} else {
				return Promise.resolve([]);
			}
		}).then(function (donations) {
			if (donations.length) {
				return donationsRepository.batchDelete(donations);
			} else {
				return Promise.resolve();
			}
		}).then(function () {
			console.log('deleted test donations');
		});
	}
});