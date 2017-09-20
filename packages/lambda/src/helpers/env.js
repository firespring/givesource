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

// If we are running locally, set AWS specific environment variables from our .env
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
	require('dotenv').config({path: `${__dirname}/../../../../.env`});
	process.env['AWS_LAMBDA_FUNCTION_NAME'] = process.env.AWS_STACK_NAME;
	process.env['AWS_REGION'] = process.env.AWS_DEPLOY_REGION;
}

exports.AWS_REGION = process.env.AWS_REGION;
exports.STACK_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME.replace(/-[^-]*$/, '');
exports.NODE_ENV = process.env.hasOwnProperty('NODE_ENV') ? process.env.NODE_ENV : 'production';