'use strict';

const fs = require('fs');
const path = require('path');
const connect = require('./connect.js');

module.exports = function() {
	return connect().then(function(sequelize) {
		const models = {"sequelize": sequelize};
		let model = require('./setting')(sequelize);
		models[model.name] = model;
		model = require('./content')(sequelize);
		models[model.name] = model;
		return models;
	});
}
