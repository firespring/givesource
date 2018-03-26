/*
 * Copyright 2018 Firespring, Inc.
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

const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/../../../.env`});

const fs = require('fs');
const path = require('path');
const deployInfo = require('../config/deploy-info.json');
const s3 = require('./aws/s3');

exports.fetch = function () {
	s3.getObject(process.env.AWS_REGION, deployInfo.PublicPagesS3BucketName, 'assets/css/custom.css').then(function (data) {
		const configDir = path.normalize(`${__dirname}/../build/public-pages/assets/css`);
		fs.writeFileSync(`${configDir}/custom.css`, data.Body);
		console.log('custom.css downloaded from s3');
	}).catch(function (err) {
		console.error(err, err.stack);
	});

	s3.getObject(process.env.AWS_REGION, deployInfo.PublicPagesS3BucketName, 'index.html').then(function (data) {
		const configDir = path.normalize(`${__dirname}/../build/public-pages`);
		fs.writeFileSync(`${configDir}/index.html`, data.Body);
		console.log('index.html downloaded from s3');
	}).catch(function (err) {
		console.error(err, err.stack);
	});
};