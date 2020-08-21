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

const Message = require('./../dynamo-models/message');
const Repository = require('./repository');
const RepositoryHelper = require('./../helpers/repository');
const ResourceNotFoundException = require('./../exceptions/resourceNotFound');

/**
 * MessagesRepository constructor
 *
 * @constructor
 */
function MessagesRepository(options) {
	options = options || {};
	if (!options.table) {
		options.table = RepositoryHelper.MessagesTable;
	}
	Repository.call(this, options);
}

/**
 * Extend the base Repository
 *
 * @type {Repository}
 */
MessagesRepository.prototype = new Repository();

/**
 * Get a Message
 *
 * @param {String} uuid
 * @return {Promise}
 */
MessagesRepository.prototype.get = function (uuid) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.getByKey('uuid', uuid).then(function (data) {
			if (data.hasOwnProperty('Item')) {
				resolve(new Message(data.Item));
			}
			reject(new ResourceNotFoundException('The specified message does not exist.'));
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get all Messages
 *
 * @return {Promise}
 */
MessagesRepository.prototype.getAll = function () {
	const repository = this;
	return new Promise(function (resolve, reject) {
		repository.batchScan().then(function (data) {
			let results = [];
			if (data.Items) {
				data.Items.forEach(function (item) {
					results.push(new Message(item));
				});
			}
			resolve(results);
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Delete a Message
 *
 * @param {String} uuid
 * @return {Promise}
 */
MessagesRepository.prototype.delete = function (uuid) {
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
 * Create or update a Message
 *
 * @param {Message} model
 */
MessagesRepository.prototype.save = function (model) {
	const repository = this;
	return new Promise(function (resolve, reject) {
		if (!(model instanceof Message)) {
			reject(new Error('invalid Message model'));
		}
		model.validate().then(function () {
			const key = {
				uuid: model.uuid
			};
			repository.put(key, model.except(['uuid'])).then(function (data) {
				resolve(new Message(data.Attributes));
			}).catch(function (err) {
				reject(err);
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports = MessagesRepository;