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

const CloudFront = require('./../src/aws/cloudFront');
const Lambda = require('./../src/aws/lambda');

// Test delete lambda@edge function
const cloudFront = new CloudFront();
const lambda = new Lambda();
const region = 'us-east-1';
const distribution = 'E3CJR3NNHUC2ZB';
const functionName = 'GD-997-SecurityHeadersUploads';

cloudFront.getDistributionConfig(distribution).then(function (response) {
	const eTag = response.ETag;
	const config = response.DistributionConfig;
	console.log(config);
	if (config.DefaultCacheBehavior) {
		config.DefaultCacheBehavior.LambdaFunctionAssociations = {
			Quantity: 0
		};
	}
	return cloudFront.updateDistribution(distribution, eTag, config);
}).then(function () {
	return lambda.deleteFunction(region, functionName);
}).then(function () {
	console.log('deleted');
}).catch(function (err) {
	console.log(err);
});