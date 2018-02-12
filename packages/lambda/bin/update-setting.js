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

const inquirer = require('inquirer');
const Lambda = require('./../src/aws/lambda');

return inquirer.prompt([
	{
		type: 'list',
		message: 'What setting would you like to update?',
		name: 'key',
		choices: ['ADMIN_URL', 'EVENT_URL']
	},
	{
		type: 'input',
		message: function (answers) {
			return 'What should the new value of ' + answers.key + ' be?'
		},
		name: 'value',
	},
	{
		type: 'confirm',
		message: function (answers) {
			return 'Are you sure you want to update ' + answers.key + ' to "' + answers.value + '"?'
		},
		name: 'confirm',
	}
]).then(function (answers) {
	if (answers.confirm) {

		const settings = {};
		settings[answers.key] = answers.value;

		const lambda = new Lambda();
		let lambdaRequestBody = {
			ResourceProperties: {
				Settings: JSON.stringify(settings)
			}
		};
		lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-SaveSettings', lambdaRequestBody, 'RequestResponse').then(function () {
			console.log('Setting updated');
		}).catch(function (err) {
			console.log(err);
		});

	} else {
		console.log('No settings were updated, the changes were not confirmed.');
	}
});