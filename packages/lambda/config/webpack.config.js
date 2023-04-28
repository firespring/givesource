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

const dotenv = require('dotenv')
dotenv.config({path: '../.base_env'})

const path = require('path')
const WebpackBundlePlugin = require('./../webpack/webpackBundlePlugin')

module.exports = {
  mode: 'development',
  entry: {
    // Api Gateway Authorizer Lambda Function
    AuthorizeUsers: './src/custom/authorizeUsers/index.js',

    // Api Lambda Functions
    AdminPostDonationsReceipt: './src/api/adminPostDonationsReceipt/index.js',
    AdminRegisterNonprofit: './src/api/adminRegisterNonprofit/index.js',
    DeleteAgreement: './src/api/deleteAgreement/index.js',
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
    DeleteNonprofitUser: './src/api/deleteNonprofitUser/index.js',
    DeletePaymentTransaction: './src/api/deletePaymentTransaction/index.js',
    DeleteSetting: './src/api/deleteSetting/index.js',
    DeleteSettings: './src/api/deleteSettings/index.js',
    DeleteSponsor: './src/api/deleteSponsor/index.js',
    DeleteSponsors: './src/api/deleteSponsors/index.js',
    DeleteSponsorTier: './src/api/deleteSponsorTier/index.js',
    DeleteUser: './src/api/deleteUser/index.js',
    DownloadFile: './src/api/downloadFile/index.js',
    GetAgreement: './src/api/getAgreement/index.js',
    GetAgreements: './src/api/getAgreements/index.js',
    GetContents: './src/api/getContents/index.js',
    GetDonation: './src/api/getDonation/index.js',
    GetDonations: './src/api/getDonations/index.js',
    GetDonationsReceipt: './src/api/getDonationsReceipt/index.js',
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
    GetNonprofitReport: './src/api/getNonprofitReport/index.js',
    GetNonprofits: './src/api/getNonprofits/index.js',
    GetNonprofitSlide: './src/api/getNonprofitSlide/index.js',
    GetNonprofitSlides: './src/api/getNonprofitSlides/index.js',
    GetNonprofitUsers: './src/api/getNonprofitUsers/index.js',
    GetPaymentTransaction: './src/api/getPaymentTransaction/index.js',
    GetPaymentTransactions: './src/api/getPaymentTransactions/index.js',
    GetReport: './src/api/getReport/index.js',
    GetSecureSetting: './src/api/getSecureSetting/index.js',
    GetSenderEmailAddress: './src/api/getSenderEmailAddress/index.js',
    GetSetting: './src/api/getSetting/index.js',
    GetSettings: './src/api/getSettings/index.js',
    GetSponsor: './src/api/getSponsor/index.js',
    GetSponsors: './src/api/getSponsors/index.js',
    GetSponsorTier: './src/api/getSponsorTier/index.js',
    GetSponsorTiers: './src/api/getSponsorTiers/index.js',
    GetUserProfile: './src/api/getUserProfile/index.js',
    GetUsers: './src/api/getUsers/index.js',
    PatchAgreement: './src/api/patchAgreement/index.js',
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
    PatchSecureSetting: './src/api/patchSecureSetting/index.js',
    PatchSenderEmailAddress: './src/api/patchSenderEmailAddress/index.js',
    PatchSetting: './src/api/patchSetting/index.js',
    PatchSettings: './src/api/patchSettings/index.js',
    PatchSponsor: './src/api/patchSponsor/index.js',
    PatchSponsors: './src/api/patchSponsors/index.js',
    PatchSponsorTier: './src/api/patchSponsorTier/index.js',
    PatchSponsorTiers: './src/api/patchSponsorTiers/index.js',
    PatchUser: './src/api/patchUser/index.js',
    PostAgreement: './src/api/postAgreement/index.js',
    PostContent: './src/api/postContent/index.js',
    PostDonation: './src/api/postDonation/index.js',
    PostDonationsReceipt: './src/api/postDonationsReceipt/index.js',
    PostDonor: './src/api/postDonor/index.js',
    PostFile: './src/api/postFile/index.js',
    PostMessage: './src/api/postMessage/index.js',
    PostNonprofit: './src/api/postNonprofit/index.js',
    PostNonprofitDonation: './src/api/postNonprofitDonation/index.js',
    PostNonprofitDonationTier: './src/api/postNonprofitDonationTier/index.js',
    PostNonprofitReport: './src/api/postNonprofitReport/index.js',
    PostNonprofitSlide: './src/api/postNonprofitSlide/index.js',
    PostNonprofitUser: './src/api/postNonprofitUser/index.js',
    PostDonationsOffline: './src/api/postDonationsOffline/index.js',
    PostPaymentTransaction: './src/api/postPaymentTransaction/index.js',
    PostReport: './src/api/postReport/index.js',
    PostSetting: './src/api/postSetting/index.js',
    PostSponsor: './src/api/postSponsor/index.js',
    PostSponsorTier: './src/api/postSponsorTier/index.js',
    PostUser: './src/api/postUser/index.js',
    ProcessDonations: './src/api/processDonations/index.js',
    RegisterNonprofit: './src/api/registerNonprofit/index.js',
    ResendUserEmailVerification: './src/api/resendUserEmailVerification/index.js',
    SearchNonprofits: './src/api/searchNonprofits/index.js',
    ValidateRecaptcha: './src/api/validateRecaptcha/index.js',
    VerifyEmail: './src/api/verifyEmail/index.js',

    // Custom Lambda Functions
    ApiDistributionInvalidation: './src/custom/apiDistributionInvalidation/index.js',
    ApiGatewayFlushCache: './src/custom/apiGatewayFlushCache/index.js',
    AssociateLambdaEdgeFunctions: './src/custom/associateLambdaEdgeFunctions/index.js',
    CognitoCreateUser: './src/custom/cognitoCreateUser/index.js',
    CognitoCreateUserGroup: './src/custom/cognitoCreateUserGroup/index.js',
    CognitoCreateUserPool: './src/custom/cognitoCreateUserPool/index.js',
    CognitoCreateUserPoolClient: './src/custom/cognitoCreateUserPoolClient/index.js',
    CognitoCustomMessage: './src/custom/cognitoCustomMessage/index.js',
    CreateLambdaEdgeFunction: './src/custom/createLambdaEdgeFunction/index.js',
    CreateParameter: './src/custom/createParameter/index.js',
    DeleteReports: './src/custom/deleteReports/index.js',
    GenerateCustomFrontendCss: './src/custom/generateCustomFrontendCss/index.js',
    GenerateDonationsReceipt: './src/custom/generateDonationsReceipt/index.js',
    GenerateDynamicContent: './src/custom/generateDynamicContent/index.js',
    GenerateReport: './src/custom/generateReport/index.js',
    GeneratePublicPagesHtml: './src/custom/generatePublicPagesHtml/index.js',
    MetricAddAmount: './src/custom/metricAddAmount/index.js',
    MetricMaxAmount: './src/custom/metricMaxAmount/index.js',
    S3PutObject: './src/custom/s3PutObject/index.js',
    S3SyncObjects: './src/custom/s3SyncObjects/index.js',
    SaveSettings: './src/custom/saveSettings/index.js',
    SendContactMessageEmail: './src/custom/sendContactMessageEmail/index.js',
    SendDonationNotificationEmail: './src/custom/sendDonationNotificationEmail/index.js',
    SendDonationsReceiptEmail: './src/custom/sendDonationsReceiptEmail/index.js',
    SendRegistrationPendingEmail: './src/custom/sendRegistrationPendingEmail/index.js',

    // Database Lambda Functions
    BootstrapDatabase: './src/database/bootstrapDatabase/index.js',
    MigrateDatabase: './src/database/migrateDatabase/index.js',

    // Cache Lambda Functions
    PutSocialSharing: './src/cache/putSocialSharing/index.js',
    PutSEO: './src/cache/putSEO/index.js',
    PutNonprofitSocialSharing: './src/cache/putNonprofitSocialSharing/index.js',
    PutNonprofitSEO: './src/cache/putNonprofitSEO/index.js',
    WarmSocialSharing: './src/cache/warmSocialSharing/index.js',
    WarmSEO: './src/cache/warmSEO/index.js'

  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, '../build/functions'),
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: {
    'aws-sdk': 'commonjs aws-sdk'
  },
  module: {
    rules: [
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
        return asset.substr(asset.indexOf('/'), asset.length - 1)
      }
    })
  ],
  resolve: {
    modules: [path.resolve(__dirname, '../src'), 'node_modules']
  }
}
