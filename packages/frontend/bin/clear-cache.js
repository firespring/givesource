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