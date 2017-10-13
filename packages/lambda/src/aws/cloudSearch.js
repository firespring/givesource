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

const AWS = require('aws-sdk');

/**
 * CloudSearch constructor
 *
 * @constructor
 */
function CloudSearch() {
}

/**
 * Create a CloudSearch domain
 *
 * @param {String} domainName
 * @return {Promise}
 */
CloudSearch.prototype.createDomain = function (domainName) {
	const awsCloudSearch = new AWS.CloudSearch({region: process.env.AWS_REGION});
	return new Promise(function (resolve, reject) {
		const params = {
			DomainName: domainName.toLowerCase()
		};
		awsCloudSearch.createDomain(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Delete a CloudSearch domain
 *
 * @param {String} domainName
 * @return {Promise}
 */
CloudSearch.prototype.deleteDomain = function (domainName) {
	const awsCloudSearch = new AWS.CloudSearch({region: process.env.AWS_REGION});
	return new Promise(function (resolve, reject) {
		const params = {
			DomainName: domainName.toLowerCase()
		};
		awsCloudSearch.deleteDomain(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve();
		});
	});
};

/**
 * Describe CloudSearch domains
 *
 * @param {Array} domainNames
 * @return {Promise}
 */
CloudSearch.prototype.describeDomains = function (domainNames) {
	const awsCloudSearch = new AWS.CloudSearch({region: process.env.AWS_REGION});
	return new Promise(function (resolve, reject) {
		const params = {
			DomainNames: domainNames.map(function (domainName) {
				return domainName.toLowerCase();
			})
		};
		awsCloudSearch.describeDomains(params, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

/**
 * Upload documents to CloudSearch
 *
 * @param {String} endpoint
 * @param {Array} documents
 * @return {Promise}
 */
CloudSearch.prototype.uploadDocuments = function (endpoint, documents) {
	const awsCloudSearchDomain = new AWS.CloudSearchDomain({endpoint: endpoint});
	return new Promise(function (resolve, reject) {
		const params = {
			contentType: 'application/json',
			documents: JSON.stringify(documents)
		};
		awsCloudSearchDomain.uploadDocuments(params, function (err) {
			if (err) {
				reject(err);
			}
			resolve();
		});
	});
};

module.exports = CloudSearch;