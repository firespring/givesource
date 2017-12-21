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

/**
 * QueryBuilder constructor
 *
 * @param {String} [type]
 * @constructor
 */
function QueryBuilder(type) {
	this._type = type || 'query';
	this._table = null;
	this._index = null;
	this._scanIndexForward = true;
	this._select = null;
	this._start = null;
	this._limit = 1000;
	this._keyConditions = [];
	this._filters = [];
	this._expressionAttributeNames = {};
	this._expressionAttributeValues = {};
}

/**
 * Type of query: 'query', 'scan'
 *
 * @param {String} type
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.type = function (type) {
	this._type = type;
	return this;
};

/**
 * Database table name
 *
 * @param {String} table
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.table = function (table) {
	this._table = table;
	return this;
};

/**
 * Index name
 *
 * @param {String} index
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.index = function (index) {
	this._index = index;
	return this;
};

/**
 * Scan index forward option
 *
 * @param {boolean} scanIndexForward
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.scanIndexForward = function (scanIndexForward) {
	this._scanIndexForward = scanIndexForward;
	return this;
};

/**
 * Select option
 *
 * @param {string} select
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.select = function (select) {
	this._select = select;
	return this;
};

/**
 * Exclusive start key
 *
 * @param {*} exclusiveStartKey
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.start = function (exclusiveStartKey) {
	this._start = exclusiveStartKey;
	return this;
};

/**
 * Query limit
 *
 * @param {int} limit
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.limit = function (limit) {
	this._limit = limit;
	return this;
};

/**
 * Key condition
 *
 * @param {String} key
 * @param {String} conditional
 * @param {*} value
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.condition = function (key, conditional, value) {
	if (conditional === '!=' || conditional.toLowerCase() === 'not') {
		this._keyConditions.push(`NOT #${key} = :${key}`);
	} else {
		this._keyConditions.push(`#${key} ${conditional} :${key}`);
	}
	this._expressionAttributeNames[`#${key}`] = key;
	this._expressionAttributeValues[`:${key}`] = value;
	return this;
};

/**
 * Filter
 *
 * @param {String} key
 * @param {String} conditional
 * @param {*} value
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.filter = function (key, conditional, value) {
	if (conditional === '!=' || conditional.toLowerCase() === 'not') {
		this._filters.push(`NOT #${key} = :${key}`);
	} else {
		this._filters.push(`#${key} ${conditional} :${key}`);
	}
	this._expressionAttributeNames[`#${key}`] = key;
	this._expressionAttributeValues[`:${key}`] = value;
	return this;
};

/**
 * Filter contains
 *
 * @param {String} key
 * @param {*} value
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.contains = function (key, value) {
	this._filters.push(`contains(#${key}, :${key})`);
	this._expressionAttributeNames[`#${key}`] = key;
	this._expressionAttributeValues[`:${key}`] = value;
	return this;
};

/**
 * Key condition - between
 *
 * @param {String} key
 * @param {*} minValue
 * @param {*} maxValue
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.between = function (key, minValue, maxValue) {
	this._keyConditions.push(`#${key}-between BETWEEN :${key}-min AND :${key}-max`);
	this._expressionAttributeNames[`#${key}-between`] = key;
	this._expressionAttributeValues[`:${key}-min`] = minValue;
	this._expressionAttributeValues[`:${key}-max`] = maxValue;
	return this;
};

/**
 * Key condition - begins with
 *
 * @param {String} key
 * @param {*} value
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.beginsWith = function (key, value) {
	this._keyConditions.push(`begins_with ( #${key}-begins, :${key}-begins )`);
	this._expressionAttributeNames[`#${key}-begins`] = key;
	this._expressionAttributeValues[`:${key}-begins`] = value;
	return this;
};

/**
 * Build the query parameters
 *
 * @return {{}}
 */
QueryBuilder.prototype.build = function () {
	const join = (this._type === 'query') ? ' AND ' : ', ';

	if (!this._table) {
		throw new Error('table is undefined');
	}

	const params = {
		TableName: this._table
	};

	if (this._index) {
		params['IndexName'] = this._index;
	}

	if (this._keyConditions.length) {
		params['KeyConditionExpression'] = this._keyConditions.join(join);
	}

	if (this._filters.length) {
		params['FilterExpression'] = this._filters.join(join);
	}

	if (this._expressionAttributeNames !== {} && this._expressionAttributeValues !== {}) {
		params['ExpressionAttributeNames'] = this._expressionAttributeNames;
		params['ExpressionAttributeValues'] = this._expressionAttributeValues;
	}

	if (this._limit) {
		params['Limit'] = this._limit;
	}

	if (this._select) {
		params['Select'] = this._select;
	}

	if (this._start) {
		params['ExclusiveStartKey'] = this._start;
	}

	if (this._scanIndexForward && this._type === 'query') {
		params['ScanIndexForward'] = this._scanIndexForward;
	}

	return params;
};

module.exports = QueryBuilder;