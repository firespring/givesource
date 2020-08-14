'use strict';

const fs = require('fs');
const path = require('path');
const connect = require('./connect.js');

module.exports = function() {
	return connect().then(function(sequelize) {
		const models = {};
		const model = require('./setting')(sequelize);
		models[model.name] = model;
		return models;
	});
}
