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

const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path: path.resolve(__dirname, '../.env')});
process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '../base_config/');

const config = require('config');
const deployInfo = require('../config/deploy-info.json');
const fs = require('fs');
const S3 = require('./aws/s3');

exports.fetch = () => {
	const s3 = new S3();
	s3.getObject(config.get('stack.AWS_REGION'), deployInfo.PublicPagesS3BucketName, 'assets/css/custom.css').then(response => {
		const configDir = path.resolve(__dirname, './../build/public-pages/assets/css');
		fs.writeFileSync(configDir + '/custom.css', response.Body);
		console.log('custom.css downloaded from S3');
	}).catch(function (err) {
		console.log(err);
	});
};
