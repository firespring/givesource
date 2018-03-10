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

const CloudFront = require('./aws/cloudFront');
const deployInfo = require('./../config/deploy-info.json');

const cloudFront = new CloudFront();
cloudFront.createInvalidation(deployInfo.AdminPagesCloudFrontDistribution, ['/index.html']).then(function () {
	console.log('Admin pages cache cleared');
	return cloudFront.createInvalidation(deployInfo.PublicPagesCloudFrontDistribution, ['/index.html']);
}).then(function () {
	console.log('Public pages cache cleared');
}).catch(function (err) {
	console.log(err);
});