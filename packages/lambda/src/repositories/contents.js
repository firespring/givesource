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

const Content = require('./../dynamo-models/content');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');
const QueryBuilder = require('./../aws/queryBuilder');

/**
 * ContentsRepository constructor
 *
 * @constructor
 */
function ContentsRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.ContentsTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
ContentsRepository.prototype = new Repository();

/**
 * Get a Content
 *
 * @param {String} uuid
 * @return {Promise}
 */
ContentsRepository.prototype.get = function (uuid) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getByKey('uuid', uuid).then(function (data) {
			if (data.hasOwnProperty('Item')) {
				resolve(new Content(data.Item));
			}
			reject(new ResourceNotFoundException('The specified content does not exist.'));
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all contents by parentUuid
 *
 * @param {String} parentUuid
 * @return {Promise}
 */
ContentsRepository.prototype.getByParentUuid = function (parentUuid) {
	const repository = this;
	const builder = new QueryBuilder('query');
	return new Promise(function (resolve, reject) {
		builder.index('parentUuidIndex').condition('parentUuid', '=', parentUuid);
		repository.batchQuery(builder).then(function (data) {
			const results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new Content(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all contents by key
 *
 * @param {String} key
 * @return {Promise}
 */
ContentsRepository.prototype.getAllByKey = function (key) {
	const repository = this;
	const builder = new QueryBuilder('query');
	return new Promise(function (resolve, reject) {
		builder.index('keyIndex').condition('key', '=', key);
		repository.batchQuery(builder).then(function (data) {
			const results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new Content(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get Contents by keys
 *
 * @param {[]} keys
 * @return {Promise}
 */
ContentsRepository.prototype.batchGet = function (keys) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!keys) {
			reject(new Error('keys is undefined'));
		}

		const params = {
			FilterExpression: '',
			ExpressionAttributeNames: {'#key': 'key'},
			ExpressionAttributeValues: {},
		};

		keys.forEach(function (key) {
			const expression = `#key = :${key}`;
			params.FilterExpression = params.FilterExpression ? params.FilterExpression + ' OR ' + expression : expression;
			params.ExpressionAttributeValues[`:${key}`] = key;
		});

		repository.batchScan(params).then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new Content(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get a count by parentUuid
 *
 * @param {String} key
 * @return {Promise}
 */
ContentsRepository.prototype.getCountByKey = function (key) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		const builder = new QueryBuilder('query');
		builder.index('keyIndex').condition('key', '=', key).select('COUNT');
		repository.batchQuery(builder).then(function (data) {
			resolve(data.Count);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Delete a Content
 *
 * @param {String} uuid
 * @return {Promise}
 */
ContentsRepository.prototype.delete = function (uuid) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.deleteByKey('uuid', uuid).then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Batch delete Contents by parentUuid
 *
 * @param {String} parentUuid
 * @return {Promise}
 */
ContentsRepository.prototype.batchDeleteByParentUuid = function (parentUuid) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getByParentUuid(parentUuid).then(function (models) {
			return repository.batchDelete(models);
		}).then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Batch delete Contents by key
 *
 * @param {String} key
 * @return {Promise}
 */
ContentsRepository.prototype.batchDeleteByKey = function (key) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getAllByKey(key).then(function (models) {
			return repository.batchDelete(models);
		}).then(function () {
			resolve();
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Create or update a Content
 *
 * @param {Content} model
 */
ContentsRepository.prototype.save = function (model) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof Content)) {
			reject(new Error('invalid Content model'));
		}
		model.validate().then(function () {
			return repository.put({uuid: model.uuid}, model.except(['uuid']));
		}).then(function (data) {
			resolve(new Content(data.Attributes));
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = ContentsRepository;