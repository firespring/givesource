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
const path = require('path');
const WebpackBundlePlugin = require('./../webpack/webpackBundlePlugin');

dotenv.config({path: `${__dirname}/../../../.env`});

module.exports = function (env) {
	return {
		entry: {
			// Api Gateway Authorizer Lambda Function
			AuthorizeUsers: './src/custom/authorizeUsers/index.js',

			// Api Lambda Functions
			AdminRegisterNonprofit: './src/api/adminRegisterNonprofit/index.js',
			DeleteContent: './src/api/deleteContent/index.js',
			DeleteContents: './src/api/deleteContents/index.js',
			DeleteDonation: './src/api/deleteDonation/index.js',
			DeleteDonor: './src/api/deleteDonor/index.js',
			DeleteFile: './src/api/deleteFile/index.js',
			DeleteFiles: './src/api/deleteFiles/index.js',
			DeleteMessage: './src/api/deleteMessage/index.js',
			DeleteMetrics: './src/api/deleteMetrics/index.js',
			DeleteNonprofit: './src/api/deleteNonprofit/index.js',
			DeleteNonprofitDonation: './src/api/deleteNonprofitDonation/index.js',
			DeleteNonprofitDonationTiers: './src/api/deleteNonprofitDonationTiers/index.js',
			DeleteNonprofitSlide: './src/api/deleteNonprofitSlide/index.js',
			DeletePaymentTransaction: './src/api/deletePaymentTransaction/index.js',
			DeleteReport: './src/api/deleteReport/index.js',
			DeleteSetting: './src/api/deleteSetting/index.js',
			DeleteSettings: './src/api/deleteSettings/index.js',
			DeleteSponsor: './src/api/deleteSponsor/index.js',
			DeleteSponsors: './src/api/deleteSponsors/index.js',
			DeleteSponsorTier: './src/api/deleteSponsorTier/index.js',
			GetContents: './src/api/getContents/index.js',
			GetDonation: './src/api/getDonation/index.js',
			GetDonations: './src/api/getDonations/index.js',
			GetDonor: './src/api/getDonor/index.js',
			GetDonors: './src/api/getDonors/index.js',
			GetEmail: './src/api/getEmail/index.js',
			GetFile: './src/api/getFile/index.js',
			GetFiles: './src/api/getFiles/index.js',
			GetMessage: './src/api/getMessage/index.js',
			GetMessages: './src/api/getMessages/index.js',
			GetMetrics: './src/api/getMetrics/index.js',
			GetNonprofit: './src/api/getNonprofit/index.js',
			GetNonprofitDonation: './src/api/getNonprofitDonation/index.js',
			GetNonprofitDonations: './src/api/getNonprofitDonations/index.js',
			GetNonprofitDonationTier: './src/api/getNonprofitDonationTier/index.js',
			GetNonprofitDonationTiers: './src/api/getNonprofitDonationTiers/index.js',
			GetNonprofitPage: './src/api/getNonprofitPage/index.js',
			GetNonprofits: './src/api/getNonprofits/index.js',
			GetNonprofitSlide: './src/api/getNonprofitSlide/index.js',
			GetNonprofitSlides: './src/api/getNonprofitSlides/index.js',
			GetNonprofitUsers: './src/api/getNonprofitUsers/index.js',
			GetPaymentTransaction: './src/api/getPaymentTransaction/index.js',
			GetPaymentTransactions: './src/api/getPaymentTransactions/index.js',
			GetReport: './src/api/getReport/index.js',
			GetReports: './src/api/getReports/index.js',
			GetSetting: './src/api/getSetting/index.js',
			GetSettings: './src/api/getSettings/index.js',
			GetSponsor: './src/api/getSponsor/index.js',
			GetSponsors: './src/api/getSponsors/index.js',
			GetSponsorTier: './src/api/getSponsorTier/index.js',
			GetSponsorTiers: './src/api/getSponsorTiers/index.js',
			GetUserProfile: './src/api/getUserProfile/index.js',
			GetUsers: './src/api/getUsers/index.js',
			PatchContent: './src/api/patchContent/index.js',
			PatchContents: './src/api/patchContents/index.js',
			PatchDonation: './src/api/patchDonation/index.js',
			PatchMessage: './src/api/patchMessage/index.js',
			PatchMetrics: './src/api/patchMetrics/index.js',
			PatchNonprofit: './src/api/patchNonprofit/index.js',
			PatchNonprofitDonation: './src/api/patchNonprofitDonation/index.js',
			PatchNonprofitDonationTiers: './src/api/patchNonprofitDonationTiers/index.js',
			PatchNonprofitSlide: './src/api/patchNonprofitSlide/index.js',
			PatchNonprofitSlides: './src/api/patchNonprofitSlides/index.js',
			PatchNonprofitStatus: './src/api/patchNonprofitStatus/index.js',
			PatchPaymentTransaction: './src/api/patchPaymentTransaction/index.js',
			PatchReport: './src/api/patchReport/index.js',
			PatchSetting: './src/api/patchSetting/index.js',
			PatchSettings: './src/api/patchSettings/index.js',
			PatchSponsor: './src/api/patchSponsor/index.js',
			PatchSponsors: './src/api/patchSponsors/index.js',
			PatchSponsorTier: './src/api/patchSponsorTier/index.js',
			PatchSponsorTiers: './src/api/patchSponsorTiers/index.js',
			PatchUser: './src/api/patchUser/index.js',
			PostContent: './src/api/postContent/index.js',
			PostDonation: './src/api/postDonation/index.js',
			PostDonationsReceipt: './src/api/postDonationsReceipt/index.js',
			PostDonor: './src/api/postDonor/index.js',
			PostFile: './src/api/postFile/index.js',
			PostMessage: './src/api/postMessage/index.js',
			PostNonprofit: './src/api/postNonprofit/index.js',
			PostNonprofitDonation: './src/api/postNonprofitDonation/index.js',
			PostNonprofitDonationTier: './src/api/postNonprofitDonationTier/index.js',
			PostNonprofitSlide: './src/api/postNonprofitSlide/index.js',
			PostNonprofitUser: './src/api/postNonprofitUser/index.js',
			PostPaymentTransaction: './src/api/postPaymentTransaction/index.js',
			PostReport: './src/api/postReport/index.js',
			PostSetting: './src/api/postSetting/index.js',
			PostSponsor: './src/api/postSponsor/index.js',
			PostSponsorTier: './src/api/postSponsorTier/index.js',
			PostUser: './src/api/postUser/index.js',
			ProcessDonations: './src/api/processDonations/index.js',
			RegisterNonprofit: './src/api/registerNonprofit/index.js',
			SearchNonprofits: './src/api/searchNonprofits/index.js',
			VerifyEmail: './src/api/verifyEmail/index.js',

			// CloudFormation Custom Lambda Functions
			ApiGatewayDeploy: './src/custom/apiGatewayDeploy/index.js',
			CognitoCreateUser: './src/custom/cognitoCreateUser/index.js',
			CognitoCreateUserGroup: './src/custom/cognitoCreateUserGroup/index.js',
			CognitoCreateUserPool: './src/custom/cognitoCreateUserPool/index.js',
			CognitoCreateUserPoolClient: './src/custom/cognitoCreateUserPoolClient/index.js',
			CognitoCustomMessage: './src/custom/cognitoCustomMessage/index.js',
			RenderTemplate: './src/custom/renderTemplate/index.js',
			S3PutObject: './src/custom/s3PutObject/index.js',
			S3SyncObjects: './src/custom/s3SyncObjects/index.js',
			SaveSettings: './src/custom/saveSettings/index.js',
			SendDonationsReceiptEmail: './src/custom/sendDonationsReceiptEmail/index.js',
		},
		output: {
			path: path.resolve(__dirname, '../build/functions'),
			library: '[name]',
			libraryTarget: 'commonjs2',
			filename: '[name]/index.js'
		},
		target: 'node',
		externals: {'aws-sdk': 'commonjs aws-sdk'},
		module: {
			loaders: [
				{
					test: /\.json$/,
					loader: 'json-loader'
				},
				{
					test: /\.mustache/,
					loader: 'raw-loader'
				}
			]
		},
		plugins: [
			new WebpackBundlePlugin({
				output: path.resolve(__dirname, '../build'),
				assetName: function (asset) {
					return asset.substr(asset.indexOf('/'), asset.length - 1);
				}
			})
		],
		resolve: {
			modules: [path.resolve(__dirname, '../src'), 'node_modules']
		}
	};
};