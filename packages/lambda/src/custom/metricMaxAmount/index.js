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

const HttpException = require('./../../exceptions/http')
const MetricsRepository = require('./../../repositories/metrics')
const Request = require('./../../aws/request')

export function handle (event, context, callback) {
  const request = new Request(event, context).parameters(['amount', 'key'])
  const repository = new MetricsRepository()

  let metric = null
  const key = request.get('key')
  const amount = request.get('amount', 0)

  repository.batchGet([key]).then((metrics) => {
    if (metrics.length) {
      metric = metrics.pop()
      if (metric.value < amount) {
        metric.populate({ value: amount })
        return metric.validate()
      } else {
        metric = null
      }
    } else {
      metric = new Metric({ key: key, value: amount })
      return metric.validate()
    }
  }).then(() => {
    return metric ? repository.batchUpdate([metric]) : Promise.resolve()
  }).then(() => {
    callback()
  }).catch((err) => {
    console.log('Error: %j', err);
    (err instanceof HttpException) ? callback(err.context(context)) : callback(err)
  })
}
