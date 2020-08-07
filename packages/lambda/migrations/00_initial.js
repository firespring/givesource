'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await Promise.all([
			queryInterface.createTable('Contents', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				parentId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0,
				},
				sortOrder: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0,
				},
				type: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				value: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				name: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				isDeleted: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false,
				},
				createdAt: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: '0000-00-00 00:00:00'
				},
				updatedAt: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: '0000-00-00 00:00:00'
				}
			}),
			queryInterface.createTable('Donations', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				}
				//id` INT(11) NOT NULL, ' +
				//createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				//amountForNonprofit` INT(11) NOT NULL DEFAULT 0, ' +
				//count` INT(11) NOT NULL DEFAULT 0, ' +
				//fees` INT(11) NOT NULL DEFAULT 0, ' +
				//isAnonymous` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//isFeeCovered` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//isOfflineDonation` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//nonprofitId` INT(11) NOT NULL DEFAULT 0, ' +
				//paymentTransactionIsTestMode` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//paymentTransactionId` INT(11) NOT NULL DEFAULT 0, ' +
				//subtotal` INT(11) NOT NULL DEFAULT 0, ' +
				//subtotalChargedToCard` INT(11) NOT NULL DEFAULT 0, ' +
				//total` INT(11) NOT NULL DEFAULT 0, ' +
				//type` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//donorId` INT(11) NOT NULL DEFAULT 0, ' +
				//note` VARCHAR(255) DEFAULT NULL, ' +
				//PRIMARY KEY (`id`), ' +
				//KEY `ix_donations_nonprofit_id` (`nonprofitId`), ' +
				//KEY `ix_donations_payment_transaction_id` (`paymentTransactionId`), ' +
				//KEY `ix_donations_donor_id` (`donorId`) ' +
			}),
			queryInterface.createTable('Donors', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				}
				//id` INT(11) NOT NULL, ' +
				//createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				//isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//amountForNonprofit` INT(11) NOT NULL DEFAULT 0, ' +
				//address1` VARCHAR(50) NOT NULL, ' +
				//address2` VARCHAR(50) NOT NULL, ' +
				//city` VARCHAR(50) NOT NULL, ' +
				//email` VARCHAR(50) NOT NULL, ' +
				//firstName` VARCHAR(50) NOT NULL, ' +
				//lastName` VARCHAR(50) NOT NULL, ' +
				//phone` VARCHAR(50) NOT NULL, ' +
				//state` VARCHAR(50) NOT NULL, ' +
				//zip` VARCHAR(50) NOT NULL, ' +
				//PRIMARY KEY (`id`), ' +
				//KEY `ix_donors_email` (`email`) ' +
				//
			}),
			queryInterface.createTable('Files', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				//id` INT(11) NOT NULL, ' +
				//createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				//isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//path` VARCHAR(50) NOT NULL, ' +
				//filename` VARCHAR(50) NOT NULL, ' +
				//PRIMARY KEY (`id`) ' +
				//
			}),
			queryInterface.createTable('Messages', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				//id` INT(11) NOT NULL, ' +
				//createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				//isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//email` VARCHAR(50) NOT NULL, ' +
				//name` VARCHAR(50) NOT NULL, ' +
				//message` VARCHAR(50) NOT NULL, ' +
				//phone` VARCHAR(50) NOT NULL, ' +
				//type` VARCHAR(50) NOT NULL, ' +
				//PRIMARY KEY (`id`) ' +
				//
			}),
			queryInterface.createTable('Metrics', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				//id` INT(11) NOT NULL, ' +
				//createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				//isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//key` VARCHAR(50) NOT NULL, ' +
				//value` VARCHAR(50) NOT NULL, ' +
				//PRIMARY KEY (`id`) ' +
				//
			}),
			queryInterface.createTable('NonprofitDonationTiers', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				//id` INT(11) NOT NULL, ' +
				//createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				//isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//amount` INT(11) NOT NULL DEFAULT 0, ' +
				//description` VARCHAR(255) NOT NULL, ' +
				//nonprofitId` INT(11) NOT NULL DEFAULT 0, ' +
				//PRIMARY KEY (`id`), ' +
				//KEY `ix_nonprofit_donation_tiers_nonprofit_id` (`nonprofitId`) ' +
				//
			}),
			queryInterface.createTable('Nonprofits', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				//id` INT(11) NOT NULL, ' +
				//createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				//isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//address1` VARCHAR(50) NOT NULL, ' +
				//address2` VARCHAR(50) NOT NULL, ' +
				//category1` INT(11) NOT NULL DEFAULT 0, ' +
				//category2` INT(11) NOT NULL DEFAULT 0, ' +
				//category3` INT(11) NOT NULL DEFAULT 0, ' +
				//city` VARCHAR(50) NOT NULL, ' +
				//email` VARCHAR(50) NOT NULL, ' +
				//firstName` VARCHAR(50) NOT NULL, ' +
				//lastName` VARCHAR(50) NOT NULL, ' +
				//phone` VARCHAR(50) NOT NULL, ' +
				//state` VARCHAR(50) NOT NULL, ' +
				//zip` VARCHAR(50) NOT NULL, ' +
				//legalName` VARCHAR(50) NOT NULL, ' +
				//legalNameSearch` VARCHAR(50) NOT NULL, ' +
				//logoFileId` INT(11) NOT NULL DEFAULT 0, ' +
				//longDescription` VARCHAR(255) NOT NULL, ' +
				//receiveDonationNotifications` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//shortDescription` VARCHAR(50) NOT NULL, ' +
				//slug` VARCHAR(50) NOT NULL, ' +
				//socialSharingDescription` VARCHAR(50) NOT NULL, ' +
				//socialSharingFileId` INT(11) NOT NULL DEFAULT 0, ' +
				//status` VARCHAR(50) NOT NULL, ' +
				//taxId` VARCHAR(50) NOT NULL, ' +
				//PRIMARY KEY (`id`), ' +
				//KEY `ix_nonprofits_is_deleted` (`isDeleted`), ' +
				//KEY `ix_nonprofits_status_legal_name_search_is_deleted` (`status`, `legalNameSearch`, `isDeleted`), ' +
				//KEY `ix_nonprofits_slug` (`slug`) ' +
				//
			}),
			queryInterface.createTable('NonprofitSlides', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				//id` INT(11) NOT NULL, ' +
				//createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				//isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//sortOrder` INT(11) NOT NULL DEFAULT 0, ' +
				//caption` VARCHAR(50) NOT NULL, ' +
				//embedUrl` VARCHAR(50) NOT NULL, ' +
				//externalId` VARCHAR(50) NOT NULL, ' +
				//thumbnail` VARCHAR(50) NOT NULL, ' +
				//type` VARCHAR(50) NOT NULL, ' +
				//url` VARCHAR(50) NOT NULL, ' +
				//fileId` INT(11) NOT NULL DEFAULT 0, ' +
				//nonprofitId` INT(11) NOT NULL DEFAULT 0, ' +
				//PRIMARY KEY (`id`), ' +
				//KEY `ix_nonprofit_slides_nonprofit_id` (`nonprofitId`) ' +
				//
			}),
			queryInterface.createTable('PaymentTransactions', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				//id` INT(11) NOT NULL, ' +
				//createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				//isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//billingZip` VARCHAR(50) NOT NULL, ' +
				//creditCardExpirationMonth` INT(11) NOT NULL DEFAULT 0, ' +
				//creditCardExpirationYear` INT(11) NOT NULL DEFAULT 0, ' +
				//creditCardLast4` VARCHAR(50) NOT NULL, ' +
				//creditCardName` VARCHAR(50) NOT NULL, ' +
				//creditCardType` VARCHAR(50) NOT NULL, ' +
				//isTestMode` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//transactionAmount` INT(11) NOT NULL DEFAULT 0, ' +
				//transactionId` VARCHAR(50) NOT NULL, ' +
				//transactionStatus` VARCHAR(50) NOT NULL, ' +
				//PRIMARY KEY (`id`) ' +
				//
			}),
			queryInterface.createTable('Reports', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				//id` INT(11) NOT NULL, ' +
				//createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				//isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//status` VARCHAR(50) NOT NULL, ' +
				//type` VARCHAR(50) NOT NULL, ' +
				//fileId` INT(11) NOT NULL DEFAULT 0, ' +
				//nonprofitId` INT(11) NOT NULL DEFAULT 0, ' +
				//PRIMARY KEY (`id`) ' +
				//
			}),
			queryInterface.createTable('Settings', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				key: {
					type: Sequelize.STRING(50),
					allowNull: false
				},
				value: {
					type: Sequelize.STRING(50),
					allowNull: false
				},
				isDeleted: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				createdAt: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: '0000-00-00 00:00:00'
				},
				updatedAt: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: '0000-00-00 00:00:00'
				}
			}),
			queryInterface.createTable('Sponsors', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				//id` INT(11) NOT NULL, ' +
				//createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				//isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//logoUrl` VARCHAR(50) NOT NULL, ' +
				//name` VARCHAR(50) NOT NULL, ' +
				//sortOrder` INT(11) NOT NULL DEFAULT 0, ' +
				//url` VARCHAR(50) NOT NULL, ' +
				//fileId` INT(11) NOT NULL DEFAULT 0, ' +
				//sponsorTierId` INT(11) NOT NULL DEFAULT 0, ' +
				//PRIMARY KEY (`id`), ' +
				//KEY `ix_sponsors_sponsor_tier_id` (`sponsorTierId`) ' +
				//
			}),
			queryInterface.createTable('SponsorTiers', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				//id` INT(11) NOT NULL, ' +
				//createdOn` datetime NOT NULL DEFAULT \'0000-00-00 00:00:00\', ' +
				//isDeleted` TINYINT(1) NOT NULL DEFAULT 0, ' +
				//name` VARCHAR(50) NOT NULL, ' +
				//size` VARCHAR(50) NOT NULL, ' +
				//sortOrder` INT(11) NOT NULL DEFAULT 0, ' +
				//PRIMARY KEY (`id`), ' +
				//KEY `ix_sponsor_tiers_name` (`name`) ' +
				//
			})
		]);
	},
	down: async (queryInterface, Sequelize) => {
		await Promise.all([
			queryInterface.dropTable('Contents'),
			queryInterface.dropTable('Donations'),
			queryInterface.dropTable('Donors'),
			queryInterface.dropTable('Files'),
			queryInterface.dropTable('Messages'),
			queryInterface.dropTable('Metrics'),
			queryInterface.dropTable('NonprofitDonationTiers'),
			queryInterface.dropTable('Nonprofits'),
			queryInterface.dropTable('NonprofitSlides'),
			queryInterface.dropTable('PaymentTransactions'),
			queryInterface.dropTable('Reports'),
			queryInterface.dropTable('Settings'),
			queryInterface.dropTable('Sponsors'),
			queryInterface.dropTable('SponsorTiers')
		]);
	}
};
