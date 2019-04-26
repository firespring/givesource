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
dotenv.config({path: path.resolve(__dirname, './../../../../.env')});
process.env.NODE_CONFIG_DIR = path.resolve(__dirname, './../../../../config/');

const config = require('config');

exports.bootstrap = function () {
	const stackSettings = config.get('stack');

	Object.keys(stackSettings).forEach(function (key) {
		if (!process.env.hasOwnProperty(key)) {
			process.env[key] = stackSettings[key];
		}
	});
};