/*
 * Copyright (C) 2018  Firespring
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

const logger = require('./../../helpers/log');
const Page = require('./../../models/page');
const PagesRepository = require('./../../repositories/pages');
const response = require('cfn-response');

exports.handle = function (event, context, callback) {
	logger.log('savePages event: %j', event);
	const repository = new PagesRepository();

	if (event.RequestType === 'Delete') {
		response.send(event, context, response.SUCCESS);
		return;
	}

	const pages = [
		{
			name: 'Home',
			slug: 'homepage',
			isEnabled: true,
		},
		{
			name: 'Donation Checkout',
			slug: 'cart',
			isEnabled: true,
		},
		{
			name: 'Contact Us',
			slug: 'contact-us',
			isEnabled: true,
		},
		{
			name: 'About Us',
			slug: 'about-us',
			isEnabled: false,
		},
		{
			name: 'FAQ',
			slug: 'faq',
			isEnabled: false,
		},
		{
			name: 'Toolkit',
			slug: 'toolkit',
			isEnabled: false,
		},
		{
			name: 'Terms',
			slug: 'terms',
			isEnabled: false,
		},
	];

	const models = [];
	pages.forEach(function (data) {
		models.push(new Page(data));
	});

	let promise = Promise.resolve();
	models.forEach(function (model) {
		console.log('model: %j', model);
		promise = promise.then(function () {
			return model.validate().then(function () {
				return repository.save(model);
			});
		});
	});

	promise = promise.then(function () {
		response.send(event, context, response.SUCCESS);
	}).catch(function (err) {
		logger.log(err);
		response.send(event, context, response.FAILED);
	});
};