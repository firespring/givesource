/*
 * Copyright (C) 2017  Firespring
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const _ = require('lodash');
const DonationHelper = require('./donation');
const faker = require('faker');

/**
 * Generator constructor
 *
 * @constructor
 */
function Generator() {
}

/**
 * Available generators
 *
 * @type {Object}
 * @private
 */
Generator.prototype._generators = {

	/**
	 * Generate random Donation data
	 *
	 * @return {Object}
	 */
	donation: function () {
		const donation = {
			uuid: faker.random.uuid(),
			createdOn: new Date().getTime(),
			isDeleted: 0,
			amountInCents: faker.random.arrayElement([1000, 2000, 2500, 4000, 5000, 7500, 10000, 20000, 25000]),
			donorUuid: faker.random.uuid(),
			isAnonymous: faker.random.boolean(),
			isFeeCovered: faker.random.boolean(),
			isOfflineDonation: faker.random.boolean(),
			nonprofitUuid: faker.random.uuid(),
		};
		donation.feesInCents = DonationHelper.calculateFees(donation.amountInCents, 30, 0.029);
		donation.totalInCents = donation.isFeeCovered ? donation.amountInCents + donation.feesInCents : donation.amountInCents;

		if (!donation.isOfflineDonation) {
			donation.paymentTransactionUuid = faker.random.uuid();
		}

		return donation;
	},

	/**
	 * Generate random Donor data
	 *
	 * @return {Object}
	 */
	donor: function () {
		return {
			uuid: faker.random.uuid(),
			createdOn: new Date().getTime(),
			isDeleted: 0,
			address1: faker.address.streetAddress(false),
			address2: faker.address.secondaryAddress(),
			city: faker.address.city(),
			email: faker.internet.email(),
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			phone: faker.phone.phoneNumber(),
			state: faker.address.stateAbbr(),
			zip: faker.address.zipCode()
		}
	},

	/**
	 * Generate random File data
	 *
	 * @return {Object}
	 */
	file: function () {
		return {
			uuid: faker.random.uuid(),
			createdOn: new Date().getTime(),
			isDeleted: 0,
			path: 'uploads/' + faker.system.fileName(),
			filename: faker.system.fileName()
		}
	},

	/**
	 * Generate random Message data
	 *
	 * @return {Object}
	 */
	message: function () {
		return {
			uuid: faker.random.uuid(),
			createdOn: new Date().getTime(),
			isDeleted: 0,
			email: faker.internet.email(),
			message: faker.lorem.sentence(),
			name: faker.name.findName(),
			phone: faker.phone.phoneNumber(),
			type: faker.random.arrayElement(['FEEDBACK', 'CONTACT']),
		};
	},

	/**
	 * Generate random base Model data
	 *
	 * @return {Object}
	 */
	model: function () {
		return {
			uuid: faker.random.uuid(),
			createdOn: new Date().getTime(),
			isDeleted: 0,
		};
	},

	/**
	 * Generate random Nonprofit data
	 *
	 * @return {Object}
	 */
	nonprofit: function () {
		return {
			uuid: faker.random.uuid(),
			createdOn: new Date().getTime(),
			isDeleted: 0,
			address1: faker.address.streetAddress(false),
			address2: faker.address.secondaryAddress(),
			category1: faker.random.word(),
			category2: faker.random.word(),
			category3: faker.random.word(),
			city: faker.address.city(),
			donationsCount: faker.random.number(),
			donationsSum: faker.random.number(),
			legalName: faker.company.companyName(),
			longDescription: faker.lorem.paragraphs(),
			phone: faker.phone.phoneNumber(),
			shortDescription: faker.random.words(),
			slug: faker.lorem.slug(),
			state: faker.address.stateAbbr(),
			status: faker.random.arrayElement(['ACTIVE', 'DENIED', 'PENDING', 'REVOKED']),
			taxId: faker.random.alphaNumeric(10),
			zip: faker.address.zipCode()
		};
	},

	/**
	 * Generate random NonprofitDonationTier data
	 *
	 * @return {Object}
	 */
	nonprofitDonationTier: function () {
		return {
			uuid: faker.random.uuid(),
			createdOn: new Date().getTime(),
			isDeleted: 0,
			amount: faker.random.arrayElement([1000, 2000, 2500, 4000, 5000, 6000, 7500, 10000, 20000, 50000]),
			description: faker.random.words(),
			nonprofitUuid: faker.random.uuid(),
		}
	},

	/**
	 * Generate random NonprofitSlide data
	 *
	 * @return {Object}
	 */
	nonprofitSlide: function () {
		return {
			uuid: faker.random.uuid(),
			createdOn: new Date().getTime(),
			isDeleted: 0,
			caption: faker.random.word(),
			embedUrl: faker.internet.url(),
			externalId: faker.random.word(),
			filename: faker.random.word() + '.jpeg',
			fileUuid: faker.random.uuid(),
			nonprofitUuid: faker.random.uuid(),
			sortOrder: faker.random.number(),
			thumbnail: faker.image.imageUrl(640, 480, 'nature'),
			type: faker.random.arrayElement(['IMAGE', 'VIMEO', 'YOUTUBE']),
			url: faker.image.imageUrl(800, 600, 'nature'),
		}
	},

	/**
	 * Generate random PaymentTransaction data
	 *
	 * @return {Object}
	 */
	paymentTransaction: function () {
		return {
			uuid: faker.random.uuid(),
			createdOn: new Date().getTime(),
			isDeleted: 0,
			billingZip: faker.address.zipCode(),
			creditCardCvvResult: 123,
			creditCardExpirationMonth: 12,
			creditCardExpirationYear: new Date().getFullYear() + 1,
			creditCardLast4: 1234,
			creditCardName: faker.name.findName(),
			creditCardZipCode: faker.address.zipCode(),
			isTestMode: faker.random.boolean(),
			total: faker.random.number(),
			transactionId: faker.random.alphaNumeric(10)
		};
	},

	/**
	 * Generate random Report data
	 *
	 * @return {Object}
	 */
	report: function () {
		return {
			uuid: faker.random.uuid(),
			createdOn: new Date().getTime(),
			isDeleted: 0,
			status: faker.random.arrayElement(['FAILED', 'PENDING', 'SUCCESS']),
			type: faker.random.arrayElement(['ALL_DONATIONS', 'NONPROFIT_DONATIONS']),
			url: faker.internet.url()
		};
	},

	/**
	 * Generate random Setting data
	 *
	 * @return {Object}
	 */
	setting: function () {
		return {
			uuid: faker.random.uuid(),
			createdOn: new Date().getTime(),
			isDeleted: 0,
			key: faker.random.word(),
			value: faker.random.word(),
		}
	},

	/**
	 * Generate random User data
	 *
	 * @return {Object}
	 */
	user: function () {
		return {
			uuid: faker.random.uuid(),
			createdOn: new Date().getTime(),
			isDeleted: 0,
			cognitoUuid: faker.random.uuid(),
			email: faker.internet.email(),
			lastName: faker.name.firstName(),
			firstName: faker.name.lastName(),
			nonprofitUuid: faker.random.uuid()
		};
	},

};

/**
 * Validate the type
 *
 * @param {String} type
 * @private
 */
Generator.prototype._validateType = function (type) {
	if (Object.keys(this._generators).indexOf(type) === -1) {
		throw new Error(`${type} generator does not exist`);
	}
};

/**
 * Generate data for a model
 *
 * @param {String} type
 * @param {{}} [data]
 */
Generator.prototype.data = function (type, data) {
	data = data || {};
	this._validateType(type);
	return _.extend({}, this._generators[type](), data);
};

/**
 * Generate a model
 *
 * @param {String} type
 * @param {{}} [data]
 * @return {*}
 */
Generator.prototype.model = function (type, data) {
	this._validateType(type);
	const Model = require(`./../models/${type}`);
	return new Model(this.data(type, data));
};

/**
 * Generate an array of model data
 *
 * @param {String} type
 * @param {int} [count]
 * @param {{}} [data]
 * @return {Array}
 */
Generator.prototype.dataCollection = function (type, count, data) {
	this._validateType(type);
	count = count || 3;
	const results = [];
	for (let i = 0; i < count; i++) {
		results.push(this.data(type, data));
	}
	return results;
};

/**
 * Generate an array of Models
 *
 * @param {String} type
 * @param {int} [count]
 * @param {{}} [data]
 * @return {Array}
 */
Generator.prototype.modelCollection = function (type, count, data) {
	this._validateType(type);
	count = count || 3;
	const results = [];
	for (let i = 0; i < count; i++) {
		results.push(this.model(type, data));
	}
	return results;
};

module.exports = Generator;
