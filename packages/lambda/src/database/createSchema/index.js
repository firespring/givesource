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

const response = require('cfn-response');
const Request = require('./../../aws/request');
const SecretsManager = require('./../../aws/secretsManager');
const Sequelize = require('sequelize');
const mysql2 = require('mysql2');

exports.handle = function (event, context, callback) {
	console.log(JSON.stringify(event));
	const secretsManager = new SecretsManager();
	const request = new Request(event, context);

	// if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
	// 	response.send(event, context, response.SUCCESS, {});
	// 	return;
	// }

	request.validate().then(function (res) {
		console.log('right above sequelize'); /*DM: Debug */
		const sequelize = new Sequelize({
			host: process.env.AURORA_DB_HOST,
			username: process.env.DATABASE_USER,
			password: JSON.parse(res.SecretString).password,
			database: 'givesource',
			dialect: 'mysql',
			dialectModule: mysql2
		});
		console.log('hit here'); /*DM: Debug */
		return sequelize.authenticate();
	}).then(function (sequelize) {
		console.log(sequelize); /*DM: Debug */
		return secretsManager.getSecretValue(process.env.AWS_REGION, process.env.SECRETS_MANAGER_SECRET_ID);
	}).then(function (res) {
		if ('SecretString' in res) {
			let connection = mysql.createConnection({
				host: process.env.AURORA_DB_HOST,
				user: process.env.DATABASE_USER,
				password: JSON.parse(res.SecretString).password,
				ssl: true,
				port: 3306
			});

			connection.connect(function (err) {
				if (err) throw err;
				console.log('connected!'); /*DM: Debug */
			});

			connection.query('CREATE DATABASE IF NOT EXISTS `givesource` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;', function (err, rows, fields) {
				if (err) throw err;
			});

			connection.changeUser({database: 'givesource'});

			//create the database
			connection.query('DROP TABLE IF EXISTS contents');

			connection.query(
				'CREATE TABLE `contents` (' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`parentId` INT(11) NOT NULL DEFAULT 0, ' +
				'`sortOrder` INT(11) NOT NULL DEFAULT 0, ' +
				'`type` VARCHAR(50) NOT NULL, ' +
				'`value` VARCHAR(50) NOT NULL, ' +
				'`name` VARCHAR(50) NOT NULL, ' +
				'PRIMARY KEY (`id`), ' +
				'KEY `ix_contents_parent_id_index` (`parentId`))');

			connection.query('DROP TABLE IF EXISTS donations');

			connection.query('CREATE TABLE `donations` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`amountForNonprofit` INT(11) NOT NULL DEFAULT 0, ' +
				'`count` INT(11) NOT NULL DEFAULT 0, ' +
				'`fees` INT(11) NOT NULL DEFAULT 0, ' +
				'`isAnonymous` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`isFeeCovered` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`isOfflineDonation` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`nonprofitId` INT(11) NOT NULL DEFAULT 0, ' +
				'`paymentTransactionIsTestMode` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`paymentTransactionId` INT(11) NOT NULL DEFAULT 0, ' +
				'`subtotal` INT(11) NOT NULL DEFAULT 0, ' +
				'`subtotalChargedToCard` INT(11) NOT NULL DEFAULT 0, ' +
				'`total` INT(11) NOT NULL DEFAULT 0, ' +
				'`type` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`donorId` INT(11) NOT NULL DEFAULT 0, ' +
				'`note` VARCHAR(255) DEFAULT NULL, ' +
				'PRIMARY KEY (`id`), ' +
				'KEY `ix_donations_nonprofit_id` (`nonprofitId`), ' +
				'KEY `ix_donations_payment_transaction_id` (`paymentTransactionId`), ' +
				'KEY `ix_donations_donor_id` (`donorId`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS donors');

			connection.query('CREATE TABLE `donors` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`amountForNonprofit` INT(11) NOT NULL DEFAULT 0, ' +
				'`address1` VARCHAR(50) NOT NULL, ' +
				'`address2` VARCHAR(50) NOT NULL, ' +
				'`city` VARCHAR(50) NOT NULL, ' +
				'`email` VARCHAR(50) NOT NULL, ' +
				'`firstName` VARCHAR(50) NOT NULL, ' +
				'`lastName` VARCHAR(50) NOT NULL, ' +
				'`phone` VARCHAR(50) NOT NULL, ' +
				'`state` VARCHAR(50) NOT NULL, ' +
				'`zip` VARCHAR(50) NOT NULL, ' +
				'PRIMARY KEY (`id`), ' +
				'KEY `ix_donors_email` (`email`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS files');

			connection.query('CREATE TABLE `files` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`path` VARCHAR(50) NOT NULL, ' +
				'`filename` VARCHAR(50) NOT NULL, ' +
				'PRIMARY KEY (`id`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS messages');

			connection.query('CREATE TABLE `messages` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`email` VARCHAR(50) NOT NULL, ' +
				'`name` VARCHAR(50) NOT NULL, ' +
				'`message` VARCHAR(50) NOT NULL, ' +
				'`phone` VARCHAR(50) NOT NULL, ' +
				'`type` VARCHAR(50) NOT NULL, ' +
				'PRIMARY KEY (`id`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS metrics');

			connection.query('CREATE TABLE `metrics` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`key` VARCHAR(50) NOT NULL, ' +
				'`value` VARCHAR(50) NOT NULL, ' +
				'PRIMARY KEY (`id`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS nonprofit_donation_tiers');

			connection.query('CREATE TABLE `nonprofit_donation_tiers` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`amount` INT(11) NOT NULL DEFAULT 0, ' +
				'`description` VARCHAR(255) NOT NULL, ' +
				'`nonprofitId` INT(11) NOT NULL DEFAULT 0, ' +
				'PRIMARY KEY (`id`), ' +
				'KEY `ix_nonprofit_donation_tiers_nonprofit_id` (`nonprofitId`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS nonprofits');

			connection.query('CREATE TABLE `nonprofits` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`address1` VARCHAR(50) NOT NULL, ' +
				'`address2` VARCHAR(50) NOT NULL, ' +
				'`category1` INT(11) NOT NULL DEFAULT 0, ' +
				'`category2` INT(11) NOT NULL DEFAULT 0, ' +
				'`category3` INT(11) NOT NULL DEFAULT 0, ' +
				'`city` VARCHAR(50) NOT NULL, ' +
				'`email` VARCHAR(50) NOT NULL, ' +
				'`firstName` VARCHAR(50) NOT NULL, ' +
				'`lastName` VARCHAR(50) NOT NULL, ' +
				'`phone` VARCHAR(50) NOT NULL, ' +
				'`state` VARCHAR(50) NOT NULL, ' +
				'`zip` VARCHAR(50) NOT NULL, ' +
				'`legalName` VARCHAR(50) NOT NULL, ' +
				'`legalNameSearch` VARCHAR(50) NOT NULL, ' +
				'`logoFileId` INT(11) NOT NULL DEFAULT 0, ' +
				'`longDescription` VARCHAR(255) NOT NULL, ' +
				'`receiveDonationNotifications` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`shortDescription` VARCHAR(50) NOT NULL, ' +
				'`slug` VARCHAR(50) NOT NULL, ' +
				'`socialSharingDescription` VARCHAR(50) NOT NULL, ' +
				'`socialSharingFileId` INT(11) NOT NULL DEFAULT 0, ' +
				'`status` VARCHAR(50) NOT NULL, ' +
				'`taxId` VARCHAR(50) NOT NULL, ' +
				'PRIMARY KEY (`id`), ' +
				'KEY `ix_nonprofits_is_deleted` (`isDeleted`), ' +
				'KEY `ix_nonprofits_status_legal_name_search_is_deleted` (`status`, `legalNameSearch`, `isDeleted`), ' +
				'KEY `ix_nonprofits_slug` (`slug`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS nonprofit_slides');

			connection.query('CREATE TABLE `nonprofit_slides` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`sortOrder` INT(11) NOT NULL DEFAULT 0, ' +
				'`caption` VARCHAR(50) NOT NULL, ' +
				'`embedUrl` VARCHAR(50) NOT NULL, ' +
				'`externalId` VARCHAR(50) NOT NULL, ' +
				'`thumbnail` VARCHAR(50) NOT NULL, ' +
				'`type` VARCHAR(50) NOT NULL, ' +
				'`url` VARCHAR(50) NOT NULL, ' +
				'`fileId` INT(11) NOT NULL DEFAULT 0, ' +
				'`nonprofitId` INT(11) NOT NULL DEFAULT 0, ' +
				'PRIMARY KEY (`id`), ' +
				'KEY `ix_nonprofit_slides_nonprofit_id` (`nonprofitId`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS payment_transactions');

			connection.query('CREATE TABLE `payment_transactions` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`billingZip` VARCHAR(50) NOT NULL, ' +
				'`creditCardExpirationMonth` INT(11) NOT NULL DEFAULT 0, ' +
				'`creditCardExpirationYear` INT(11) NOT NULL DEFAULT 0, ' +
				'`creditCardLast4` VARCHAR(50) NOT NULL, ' +
				'`creditCardName` VARCHAR(50) NOT NULL, ' +
				'`creditCardType` VARCHAR(50) NOT NULL, ' +
				'`isTestMode` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`transactionAmount` INT(11) NOT NULL DEFAULT 0, ' +
				'`transactionId` VARCHAR(50) NOT NULL, ' +
				'`transactionStatus` VARCHAR(50) NOT NULL, ' +
				'PRIMARY KEY (`id`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS reports');

			connection.query('CREATE TABLE `reports` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`status` VARCHAR(50) NOT NULL, ' +
				'`type` VARCHAR(50) NOT NULL, ' +
				'`fileId` INT(11) NOT NULL DEFAULT 0, ' +
				'`nonprofitId` INT(11) NOT NULL DEFAULT 0, ' +
				'PRIMARY KEY (`id`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS settings');

			connection.query('CREATE TABLE `settings` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`key` VARCHAR(50) NOT NULL, ' +
				'`value` VARCHAR(50) NOT NULL, ' +
				'PRIMARY KEY (`id`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS sponsors');

			connection.query('CREATE TABLE `sponsors` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`logoUrl` VARCHAR(50) NOT NULL, ' +
				'`name` VARCHAR(50) NOT NULL, ' +
				'`sortOrder` INT(11) NOT NULL DEFAULT 0, ' +
				'`url` VARCHAR(50) NOT NULL, ' +
				'`fileId` INT(11) NOT NULL DEFAULT 0, ' +
				'`sponsorTierId` INT(11) NOT NULL DEFAULT 0, ' +
				'PRIMARY KEY (`id`), ' +
				'KEY `ix_sponsors_sponsor_tier_id` (`sponsorTierId`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS sponsor_tiers');

			connection.query('CREATE TABLE `sponsor_tiers` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`name` VARCHAR(50) NOT NULL, ' +
				'`size` VARCHAR(50) NOT NULL, ' +
				'`sortOrder` INT(11) NOT NULL DEFAULT 0, ' +
				'PRIMARY KEY (`id`), ' +
				'KEY `ix_sponsor_tiers_name` (`name`) ' +
				')');

			connection.query('DROP TABLE IF EXISTS users');

			connection.query('CREATE TABLE `users` ( ' +
				'`id` INT(11) NOT NULL, ' +
				'`createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				'`isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				'`email` VARCHAR(50) NOT NULL, ' +
				'`lastName` VARCHAR(50) NOT NULL, ' +
				'`firstName` VARCHAR(50) NOT NULL, ' +
				'`cognitoId` INT(11) NOT NULL DEFAULT 0, ' +
				'`nonprofitId` INT(11) NOT NULL DEFAULT 0, ' +
				'PRIMARY KEY (`id`), ' +
				'KEY `ix_users_email` (`email`), ' +
				'KEY `ix_users_cognito_id` (`cognitoId`) ' +
				')');
			connection.end();

			response.send(event, context, response.SUCCESS, {});
			callback();
		}
	}).catch(function (err) {
		console.log(err);
		response.send(event, context, response.FAILED, {});
		callback(err);
	});
};
