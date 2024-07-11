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

import AWS from 'aws-sdk'

/**
 * CloudFormation constructor
 *
 * @constructor
 */
function CloudFormation () {
}

/**
 * Describe AWS CloudFormation stack(s)
 *
 * @param {String} region
 * @param {String} [stackName]
 * @param {String} [nextToken]
 * @param {[]} [stacks]
 * @return {Promise}
 */
CloudFormation.prototype.describeStacks = (region, stackName, nextToken, stacks) => {
  const cloudFormation = this
  const awsCloudFormation = new AWS.CloudFormation({ region: region })
  return new Promise((resolve, reject) => {
    stacks = stacks || []
    const params = {}
    if (stackName) {
      params.StackName = stackName
    }
    if (nextToken) {
      params.NextToken = nextToken
    }
    awsCloudFormation.describeStacks(params, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      stacks = stacks.concat(data.Stacks)
      if (data.NextToken) {
        resolve(cloudFormation.describeStacks(region, stackName, data.nextToken, stacks))
      } else {
        resolve(stacks)
      }
    })
  })
}

export default CloudFormation
