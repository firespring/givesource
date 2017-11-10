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
 * @param {String} type
 * @constructor
 */
function QueryBuilder(type) {
	this.queryType = type;
	this.tableName = null;
	this.indexName = null;
	this._scanIndexForward = true;
	this._select = null;
	this.startKey = null;
	this.limitNumber = 1000;
	this.keyConditions = [];
	this.filters = [];
	this.expressionAttributeNames = {};
	this.expressionAttributeValues = {};
}

/**
 * Type of query: 'query', 'scan'
 *
 * @param {String} type
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.type = function (type) {
	this.queryType = type;
	return this;
};

/**
 * Database table name
 *
 * @param {String} table
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.table = function (table) {
	this.tableName = table;
	return this;
};

/**
 * Index name
 *
 * @param {String} index
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.index = function (index) {
	this.indexName = index;
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
 * @param {*} startKey
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.start = function (startKey) {
	this.startKey = startKey;
	return this;
};

/**
 * Query limit
 *
 * @param {int} limit
 * @return {QueryBuilder}
 */
QueryBuilder.prototype.limit = function (limit) {
	this.limitNumber = limit;
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
		this.keyConditions.push(`NOT #${key} = :${key}`);
	} else {
		this.keyConditions.push(`#${key} ${conditional} :${key}`);
	}
	this.expressionAttributeNames[`#${key}`] = key;
	this.expressionAttributeValues[`:${key}`] = value;
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
		this.filters.push(`NOT #${key} = :${key}`);
	} else {
		this.filters.push(`#${key} ${conditional} :${key}`);
	}
	this.expressionAttributeNames[`#${key}`] = key;
	this.expressionAttributeValues[`:${key}`] = value;
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
	this.keyConditions.push(`#${key}-between BETWEEN :${key}-min AND :${key}-max`);
	this.expressionAttributeNames[`#${key}-between`] = key;
	this.expressionAttributeValues[`:${key}-min`] = minValue;
	this.expressionAttributeValues[`:${key}-max`] = maxValue;
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
	this.keyConditions.push(`begins_with ( #${key}-begins, :${key}-begins )`);
	this.expressionAttributeNames[`#${key}-begins`] = key;
	this.expressionAttributeValues[`:${key}-begins`] = value;
	return this;
};

/**
 * Build the query parameters
 *
 * @return {{}}
 */
QueryBuilder.prototype.build = function () {
	if (this.queryType === null || this.queryType === undefined) {
		this.queryType = 'query';
	}
	const join = (this.queryType === 'query') ? ' AND ' : ', ';

	if (this.tableName === null || this.tableName === '' || this.tableName === undefined) {
		throw new Error('table is undefined');
	}

	const params = {
		TableName: this.tableName
	};

	if (this.indexName !== null) {
		params['IndexName'] = this.indexName;
	}

	if (this.keyConditions.length > 0) {
		params['KeyConditionExpression'] = this.keyConditions.join(join);
	}

	if (this.filters.length > 0) {
		params['FilterExpression'] = this.filters.join(join);
	}

	if (this.keyConditions.length > 0 || this.filters.length > 0) {
		params['ExpressionAttributeNames'] = this.expressionAttributeNames;
		params['ExpressionAttributeValues'] = this.expressionAttributeValues;
	}

	if (this.limitNumber) {
		params['Limit'] = this.limitNumber;
	}

	if (this._select) {
		params['Select'] = this._select;
	}

	if (this.startKey) {
		params['ExclusiveStartKey'] = this.startKey;
	}

	if (this._scanIndexForward !== null && this.queryType === 'query') {
		params['ScanIndexForward'] = this._scanIndexForward;
	}

	return params;
};

module.exports = QueryBuilder;