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

require('./config/bootstrap').bootstrap()

const config = require('config')
const inquirer = require('inquirer')
const Lambda = require('../src/aws/lambda')

inquirer.prompt([
  {
    type: 'list',
    message: 'What setting would you like to update?',
    name: 'key',
    choices: ['ADMIN_URL', 'EVENT_URL', 'RECAPTCHA_KEY']
  },
  {
    type: 'input',
    message: function (answers) {
      return 'What should the new value of ' + answers.key + ' be?'
    },
    name: 'value'
  },
  {
    type: 'confirm',
    message: function (answers) {
      return 'Are you sure you want to update ' + answers.key + ' to "' + answers.value + '"?'
    },
    name: 'confirm'
  }
]).then(function (answers) {
  if (answers.confirm) {
    const settings = {}
    settings[answers.key] = answers.value

    const lambda = new Lambda()
    const lambdaRequestBody = {
      ResourceProperties: {
        Settings: JSON.stringify(settings)
      }
    }
    lambda.invoke(config.get('stack.AWS_REGION'), config.get('stack.AWS_STACK_NAME') + '-SaveSettings', lambdaRequestBody, 'RequestResponse').then(function () {
      console.log('Setting updated')
      lambda.invoke(process.env.AWS_REGION, process.env.AWS_STACK_NAME + '-ApiDistributionInvalidation', { paths: ['/settings*'] }, 'RequestResponse')
    }).catch(function (err) {
      console.log(err)
    })
  } else {
    console.log('No settings were updated, the changes were not confirmed.')
  }
})
