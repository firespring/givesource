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
const path = require('path');
const deployInfo = require('../config/deploy-info.json');
const s3 = require('./aws/s3');

exports.fetch = function () {
	s3.getObject(process.env.AWS_REGION, deployInfo.publicPagesS3BucketName, 'assets/css/custom.css').then(function (data) {
		const configDir = path.normalize(`${__dirname}/../build/public-pages/assets/css`);
		fs.writeFileSync(`${configDir}/custom.css`, data.Body);
		console.log('custom.css downloaded from s3');
	}).catch(function (err) {
		console.error(err, err.stack);
	});

	s3.getObject(process.env.AWS_REGION, deployInfo.publicPagesS3BucketName, 'index.html').then(function (data) {
		const configDir = path.normalize(`${__dirname}/../build/public-pages`);
		fs.writeFileSync(`${configDir}/index.html`, data.Body);
		console.log('index.html downloaded from s3');
	}).catch(function (err) {
		console.error(err, err.stack);
	});
};