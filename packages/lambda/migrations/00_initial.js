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
				key: {
					type: Sequelize.STRING(2048),
					allowNull: false
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
					type: Sequelize.STRING(2048),
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
				},
				amountForNonprofit: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				count: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				fees: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				isAnonymous: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				isFeeCovered: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				isOfflineDonation: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				nonprofitId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				paymentTransactionIsTestMode: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				paymentTransactionId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				subtotal: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				subtotalChargedToCard: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				total: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				type: {
					type: Sequelize.TINYINT(1),
					allowNull: false,
					defaultValue: 0
				},
				donorId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				name: {
					type: Sequelize.STRING(255),
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
			queryInterface.createTable('Donors', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				amountForNonprofit: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				address1: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				address2: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				city: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				email: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				firstName: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				lastName: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				phone: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				state: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				zip: {
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
			queryInterface.createTable('Files', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				path: {
					type: Sequelize.STRING(2048),
					allowNull: false,
				},
				filename: {
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
			queryInterface.createTable('Messages', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				email: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				name: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				message: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				phone: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				type: {
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
			queryInterface.createTable('Metrics', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				key: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				value: {
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
			queryInterface.createTable('NonprofitDonationTiers', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				amount: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				value: {
					type: Sequelize.STRING(255),
					allowNull: false,
				},
				description: {
					type: Sequelize.STRING(2048),
					allowNull: false,
					defaultValue: ''
				},
				nonprofitId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
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
			queryInterface.createTable('Nonprofits', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				address1: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				address2: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				category1: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				category2: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				category3: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				city: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				email: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				firstName: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				lastName: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				phone: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				state: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				zip: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				legalName: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				legalNameSearch: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				logoFileId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				longDescription: {
					type: Sequelize.STRING(255),
					allowNull: false,
				},
				shortDescription: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				slug: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				socialSharingDescription: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				socialSharingFileId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				status: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				taxId: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				receiveDonationNotifications: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
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
			queryInterface.createTable('NonprofitSlides', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				sortOrder: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				caption: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				embedUrl: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				externalId: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				thumbnail: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				type: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				url: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				fileId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				nonprofitId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
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
			queryInterface.createTable('PaymentTransactions', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				billingZip: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				creditCardExpirationMonth: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				creditCardExpirationYear: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				creditCardLast4: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				creditCardName: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				creditCardType: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				isTestMode: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				transactionAmount: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				transactionId: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				transactionStatus: {
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
			queryInterface.createTable('Reports', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				status: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				type: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				fileId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				nonprofitId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
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
			queryInterface.createTable('Settings', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				key: {
					type: Sequelize.STRING(2048),
					allowNull: false
				},
				value: {
					type: Sequelize.STRING(2048),
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
				logoUrl: {
					type: Sequelize.STRING(2048),
					allowNull: false,
				},
				name: {
					type: Sequelize.STRING(2048),
					allowNull: false,
				},
				sortOrder: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				url: {
					type: Sequelize.STRING(2048),
					allowNull: false,
				},
				fileId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				sponsorTierId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
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
			queryInterface.createTable('SponsorTiers', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				name: {
					type: Sequelize.STRING(2048),
					allowNull: false,
				},
				size: {
					type: Sequelize.STRING(2048),
					allowNull: false,
				},
				sortOrder: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
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
			queryInterface.createTable('Users', {
				id: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					autoIncrement: true,
					primaryKey: true
				},
				email: {
					type: Sequelize.STRING(2048),
					allowNull: false,
				},
				firstName: {
					type: Sequelize.STRING(2048),
					allowNull: false,
					defaultValue: ''
				},
				lastName: {
					type: Sequelize.STRING(2048),
					allowNull: false,
					defaultValue: ''
				},
				isVerified: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
				},
				nonprofitId: {
					type: Sequelize.INTEGER(11),
					allowNull: false,
					defaultValue: 0
				},
				cognitoUsername: {
					type: Sequelize.STRING(2048),
					allowNull: false
				},
				cognitoUuid: {
					type: Sequelize.STRING(2048),
					allowNull: false,
					defaultValue: ''
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
			})
		]);

		await Promise.all([
			queryInterface.addIndex('Donations', ['nonprofitId']),
			queryInterface.addIndex('Donations', ['paymentTransactionId']),
			queryInterface.addIndex('Donations', ['donorId']),
			queryInterface.addIndex('Donors', ['email']),
			queryInterface.addIndex('NonprofitDonationTiers', ['nonprofitId']),
			queryInterface.addIndex('Nonprofits', ['isDeleted']),
			queryInterface.addIndex('Nonprofits', ['status', 'legalNameSearch', 'isDeleted']),
			queryInterface.addIndex('Nonprofits', ['slug']),
			queryInterface.addIndex('NonprofitSlides', ['nonprofitId']),
			queryInterface.addIndex('Sponsors', ['sponsorTierId']),
			queryInterface.addIndex('SponsorTiers', ['name']),
			queryInterface.addIndex('Users', ['email']),
			queryInterface.addIndex('Users', ['cognitoUuid']),
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
			queryInterface.dropTable('SponsorTiers'),
			queryInterface.dropTable('Users')
		]);
	}
};
