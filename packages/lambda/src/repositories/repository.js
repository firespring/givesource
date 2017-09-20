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
const AWS = require('aws-sdk');
const env = require('../helpers/env');
const Model = require('../models/model');
const QueryBuilder = require('../aws/queryBuilder');

/**
 * Repository constructor
 *
 * @constructor
 */
function Repository(table) {
	const region = env.AWS_REGION;
	this.dbClient = new AWS.DynamoDB.DocumentClient({region: region});
	this.table = table || null;
}

/**
 * Get an item by key
 *
 * @param {String} key
 * @param {*} value
 * @return {Promise}
 */
Repository.prototype.getByKey = function (key, value) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!repository.table) {
			reject(new Error('Repository table is undefined'));
		}
		if (!key) {
			reject(new Error('key is undefined'));
		}
		if (!value) {
			reject(new Error('value is undefined'));
		}
		const params = {
			TableName: repository.table,
			Key: {}
		};
		params.Key[key] = value;
		repository.dbClient.get(params, function (err, data) {
			if (err) {
				reject(new Error(err, 'DynamoDB'));
			}
			resolve(data);
		});
	});
};

/**
 * Delete and item by key
 *
 * @param {String} key
 * @param {*} value
 * @return {Promise}
 */
Repository.prototype.deleteByKey = function (key, value) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!repository.table) {
			reject(new Error('Repository table is undefined'));
		}
		if (!key) {
			reject(new Error('key is undefined'));
		}
		if (!value) {
			reject(new Error('value is undefined'));
		}
		const params = {
			TableName: repository.table,
			Key: {},
			ReturnValues: 'NONE'
		};
		params.Key[key] = value;
		repository.dbClient.delete(params, function (err) {
			if (err) {
				reject(new Error(err, 'DynamoDB'));
			}
			resolve();
		});
	});
};

/**
 * Create or update a Model by key
 *
 * @param {{}} key
 * @param {{}} data
 * @return {Promise}
 */
Repository.prototype.put = function (key, data) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		const [updateExpression, attributeNames, attributeValues] = repository.buildUpdateExpression(data);
		const params = {
			Key: key,
			UpdateExpression: updateExpression,
			ExpressionAttributeNames: attributeNames,
			ExpressionAttributeValues: attributeValues,
			TableName: repository.table,
			ReturnValues: 'ALL_NEW'
		};
		repository.dbClient.update(params, function (err, data) {
			if (err) {
				reject(new Error(err, 'DynamoDB'));
			}
			resolve(data);
		});
	});
};

/**
 * Scan table
 *
 * @param {{}} [params]
 */
Repository.prototype.scan = function (params) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		params = params || {};
		if (!repository.table) {
			reject(new Error('Repository table undefined'));
		}
		params = _.extend({}, {TableName: repository.table}, params);
		repository.dbClient.scan(params, function (err, data) {
			if (err) {
				reject(new Error(err, 'DynamoDB'));
			}
			resolve(data);
		});
	});
};

/**
 * Recursively scan all items
 *
 * @param {{}} [params]
 * @param {{}} [results]
 * @return {Promise}
 */
Repository.prototype.batchScan = function (params, results) {
	const repository = this;
	params = params || {};
	results = results || {Count: 0, Items: []};
	return new Promise(function (resolve, reject) {
		repository.scan(params).then(function (data) {
			if (data.Count) {
				results.Count += data.Count;
			}
			if (data.Items) {
				results.Items = results.Items.concat(data.Items);
			}
			if (data.LastEvaluatedKey) {
				params.LastEvaluatedKey = data.LastEvaluatedKey;
				resolve(repository.batchScan(params, results));
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Recursively write items in batches of 25, retry unprocessed items x times
 *
 * @param {[]} requestItems
 * @param {int} [retries]
 * @return {Promise}
 */
Repository.prototype.batchWrite = function (requestItems, retries) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		requestItems = requestItems || [];
		retries = (typeof retries === 'undefined') ? 1 : retries;
		let unprocessed = [];
		let batches = _.chunk(requestItems, 25);
		batches.forEach(function (batch) {
			let params = {
				RequestItems: {}
			};
			params.RequestItems[repository.table] = batch;
			repository.dbClient.batchWrite(params, function (err, data) {
				if (err) {
					reject(new Error(err, 'DynamoDB'));
				}
				if (data && data.UnprocessedItems && data.UnprocessedItems[repository.table]) {
					unprocessed = unprocessed.concat(data.UnprocessedItems[repository.table]);
				}
			});
		});
		if (unprocessed.length > 0) {
			if (retries > 0) {
				resolve(repository.batchWrite(unprocessed, retries -= 1));
			}
			resolve({UnprocessedItems: unprocessed});
		}
		resolve();
	});
};

/**
 * Batch update models
 *
 * @param {[]} models
 * @return {Promise}
 */
Repository.prototype.batchUpdate = function (models) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		const requestItems = [];
		models = models || [];
		models.forEach(function (model) {
			if (model instanceof Model) {
				requestItems.push({
					PutRequest: {
						Item: model.all()
					}
				});
			}
		});
		repository.batchWrite(requestItems, 3).then(function (data) {
			resolve(data);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Batch delete models
 *
 * @param {[]} models
 * @return {Promise}
 */
Repository.prototype.batchDelete = function (models) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		const requestItems = [];
		models = models || [];
		models.forEach(function (model) {
			requestItems.push({
				DeleteRequest: {
					Key: {
						uuid: model.uuid
					}
				}
			});
		});
		repository.batchWrite(requestItems, 3).then(function (data) {
			resolve(data);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get the UpdateExpression, ExpressionAttributeNames and ExpressionAttributeValues
 *
 * @param {{}} values
 * @return {[*,*,*]}
 */
Repository.prototype.buildUpdateExpression = function (values) {
	let updateExpression = '';
	const setExpression = [];
	const removeExpression = [];
	const attributeNames = {};
	let attributeValues = {};
	Object.keys(values).forEach(function (key) {
		const value = values[key];
		const attributeName = `#${key}`;
		const attributeValue = `:${key}`;
		if (value !== '' && value !== null && typeof value !== 'undefined') {
			setExpression.push(`${attributeName} = ${attributeValue}`);
			attributeNames[attributeName] = key;
			attributeValues[attributeValue] = value;
		} else {
			removeExpression.push(`${attributeName}`);
			attributeNames[attributeName] = key;
		}
	});
	if (setExpression.length > 0) {
		updateExpression += `SET ${setExpression.join(', ')} `;
	}
	if (removeExpression.length > 0) {
		updateExpression += `REMOVE ${removeExpression.join(', ')} `;
	}
	if (Object.keys(attributeValues).length === 0) {
		attributeValues = undefined;
	}
	return [updateExpression, attributeNames, attributeValues];
};

/**
 * Query the database
 *
 * @param {QueryBuilder} builder
 * @return {Promise}
 */
Repository.prototype.query = function (builder) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(builder instanceof QueryBuilder)) {
			reject(new Error('builder must be a QueryBuilder'));
		}
		builder.table(repository.table);
		repository.dbClient[builder.queryType](builder.build(), function (err, data) {
			if (err) {
				reject(new Error(err, 'DynamoDB'));
			}
			resolve(data);
		});
	});
};

module.exports = Repository;