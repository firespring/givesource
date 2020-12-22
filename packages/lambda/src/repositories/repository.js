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

const _ = require('lodash');
const AWS = require('aws-sdk');
const QueryBuilder = require('./../aws/queryBuilder');
const loadModels = require('../models/index');
const Sequelize = require('sequelize');

/**
 * Repository constructor
 *
 * @constructor
 */
function Repository(options) {
	options = options || {};
	this.table = options.table || null;
	this.dbClient = new AWS.DynamoDB.DocumentClient({region: options.region || process.env.AWS_REGION});
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
 * Get items by keys
 *
 * @param {[]} keys
 * @return {Promise}
 */
Repository.prototype.batchGetKeys = function (keys) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!repository.table) {
			reject(new Error('Repository table is undefined'));
		}
		if (!keys) {
			reject(new Error('map is undefined'));
		}
		const params = {
			RequestItems: {}
		};
		params.RequestItems[repository.table] = {
			Keys: keys
		};
		repository.dbClient.batchGet(params, function (err, data) {
			if (err) {
				reject(new Error(err, 'DynamoDB'));
			}
			if (data.Responses.hasOwnProperty(repository.table)) {
				resolve(data.Responses[repository.table]);
			} else {
				resolve([]);
			}
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
				params.ExclusiveStartKey = data.LastEvaluatedKey;
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
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			let promise = Promise.resolve();
			models.forEach(function (model) {
				promise = promise.then(function () {
					return model.update();
				});
			});
			return promise;
		}).then(function (stuff) {
			resolve(stuff);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
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
	let allModels;
	return new Promise(function (resolve, reject) {
		return loadModels().then(function (models) {
			allModels = models;
		}).then(function () {
			let promise = Promise.resolve();
			models.forEach(function (model) {
				promise = promise.then(function () {
					return model.destroy();
				});
			});
			return promise;
		}).then(function (stuff) {
			resolve(stuff);
		}).catch(function (err) {
			reject(err);
		}).finally(function () {
			return allModels.sequelize.close();
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
		repository.dbClient[builder._type](builder.build(), function (err, data) {
			if (err) {
				reject(new Error(err, 'DynamoDB'));
			}
			resolve(data);
		});
	});
};

/**
 * DynamoDB batch query
 *
 * @param {QueryBuilder} builder
 * @param {{}} [results]
 * @return {Promise}
 */
Repository.prototype.batchQuery = function (builder, results) {
	const repository = this;
	results = results || {Count: 0, Items: [], LastEvaluatedKey: false};
	return new Promise(function (resolve, reject) {
		repository.query(builder).then(function (data) {
			let numResults = 0;
			if (data.Count) {
				results.Count += data.Count;
				numResults = results.Count;
			}
			if (data.Items) {
				results.Items = results.Items.concat(data.Items);
				numResults = results.Items.length;
			}
			if (data.LastEvaluatedKey) {
				results.LastEvaluatedKey = data.LastEvaluatedKey;
				if (builder._max === 0) {
					builder.start(data.LastEvaluatedKey);
					resolve(repository.batchQuery(builder, results));
				}
				if (builder._max > 0 && numResults < builder._max) {
					builder.start(data.LastEvaluatedKey).limit(builder._max - numResults);
					resolve(repository.batchQuery(builder, results));
				}
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = Repository;
