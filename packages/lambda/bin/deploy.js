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

const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/../../../.env`});

const fs = require('fs');
const fuzzy = require('fuzzy');
const inquirer = require('inquirer');
const Lambda = require('./../src/aws/lambda');
const path = require('path');

const stackName = process.env.AWS_STACK_NAME;
const buildDirectory = path.normalize(`${__dirname}/../build`);
const functionsDirectory = path.normalize(`${buildDirectory}/functions`);

/**
 * Deploy a lambda function
 *
 * @param {String} functionName
 * @return {Promise}
 */
const deploy = function (functionName) {
	const lambda = new Lambda();
	const deployedFunctionName = `${stackName}-${functionName}`;

	return lambda.getFunction(deployedFunctionName).then(function () {
		const filepath = `${buildDirectory}/${functionName}.zip`;
		const data = fs.readFileSync(filepath);
		const zipFile = new Buffer(data, 'binary');
		return lambda.updateFunctionCode(process.env.AWS_REGION, deployedFunctionName, zipFile);
	}).catch(function (err) {
		console.log(err);
	});
};




/**
 * Batch deploy all lambda functions
 *
 * @param {[]} functions
 * @param {int} [retries]
 * @return {Promise}
 */
const batchDeploy = function (functions, retries) {
	retries = (retries > -1) ? retries : 3;
	return new Promise(function (resolve, reject) {
		const failed = [];
		let promise = Promise.resolve();
		functions.forEach(function (func) {
			promise = promise.then(function () {
				return deploy(func).then(function () {
					console.log(`deployed ${func}`);
				}).catch(function () {
					failed.push(func);
				});
			});
		});
		promise = promise.then(function () {
			if (failed.length > 0) {
				if (retries > 0) {
					retries = retries - 1;
					return batchDeploy(failed, retries);
				} else {
					reject(new Error(`Failed to deploy: ${JSON.stringify(failed)}`));
				}
			} else {
				resolve();
			}
		});
	});
};

const list = fs.readdirSync(functionsDirectory);
const choices = ['All'].concat(list);

const searchFunctions = function (answers, input) {
	input = input || '';
	return new Promise(function (resolve) {
		const results = fuzzy.filter(input, choices);
		resolve(results.map(function (el) {
			return el.original;
		}));
	});
};

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
inquirer.prompt([
	{
		type: 'autocomplete',
		message: 'Select a function to deploy:',
		name: 'selected',
		source: searchFunctions,
		validate: function (answer) {
			if (answer.length < 1) {
				return 'C';
			}
			return true;
		}
	}
]).then(function (answer) {
	const functions = (answer.selected === 'All') ? list : [answer.selected];
	console.log('deploying...');
	batchDeploy(functions).catch(function (err) {
		console.log(err);
	});
}).catch(function (err) {
	console.log(err);
});