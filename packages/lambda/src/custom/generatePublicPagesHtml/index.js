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

const SSM = require('./../../aws/ssm')
const S3 = require('./../../aws/s3')

exports.handle = (event, context, callback) => {
  const request = event.Records[0].cf.request
  const userAgent = request.headers['user-agent'][0].value
  const s3 = new S3()

  console.log('start request: ', request.uri)

  // request targets non-html files
  if (request.uri.match(/\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff|svg|eot)/i)) {
    callback(null, request)
    return
  }

  let html
  // request is coming from a social media bot
  if (userAgent.match(/twitterbot|facebookexternalhit|linkedinbot|slackbot/i)) {
    const ssm = new SSM()
    const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME.replace(process.env.AWS_REGION + '.', '').replace('us-east-1.', '')

    Promise.resolve().then(() => {
      // get stack configuration
      return ssm.getParameter('us-east-1', '/' + functionName + '/config')
    }).then(response => {
      const config = JSON.parse(response.Parameter.Value)

      if (request.uri.indexOf('/nonprofits/') === 0) {
        let slug = request.uri.replace('/nonprofits/', '')
        slug = slug.split('/')[0].split('.')[0].split('&')[0]
        if (slug) {
          return s3.getObject(config.AWS_STACK_REGION, config.AWS_S3_BUCKET_NAME, 'social-sharing/' + slug + '.html').then(response => {
            html = response.Body.toString()
          }).catch(() => {
            return s3.getObject(config.AWS_STACK_REGION, config.AWS_S3_BUCKET_NAME, 'social-sharing/event.html').then(response => {
              html = response.Body.toString()
            }).catch(() => {
              return s3.getObject(config.AWS_STACK_REGION, config.AWS_S3_BUCKET_NAME, 'social-sharing/default.html').then(response => {
                html = response.Body.toString()
              })
            })
          })
        }
      }

      return s3.getObject(config.AWS_STACK_REGION, config.AWS_S3_BUCKET_NAME, 'social-sharing/event.html').then(response => {
        html = response.Body.toString()
      }).catch(() => {
        return s3.getObject(config.AWS_STACK_REGION, config.AWS_S3_BUCKET_NAME, 'social-sharing/default.html').then(response => {
          html = response.Body.toString()
        })
      })
    }).then(() => {
      const response = {
        status: '200',
        statusDescription: 'HTTP OK',
        body: html,
        headers: {
          'cache-control': [{
            key: 'Cache-Control',
            value: 'max-age=120'
          }],
          'content-type': [{
            key: 'Content-Type',
            value: 'text/html'
          }]
        }
      }
      callback(null, response)
    }).catch(err => {
      console.log(err)
      callback(null, {})
    })

    // request is coming from a search engine crawler
  } else if (userAgent.match(/googlebot|bingbot|slur|duckduckbot|ia_archiver/i)) {
    const ssm = new SSM()
    const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME.replace(process.env.AWS_REGION + '.', '').replace('us-east-1.', '')

    Promise.resolve().then(() => {
      // get stack configuration
      return ssm.getParameter('us-east-1', '/' + functionName + '/config')
    }).then(response => {
      const config = JSON.parse(response.Parameter.Value)

      if (request.uri.indexOf('/nonprofits/') === 0) {
        let slug = request.uri.replace('/nonprofits/', '')
        slug = slug.split('/')[0].split('.')[0].split('&')[0]
        if (slug) {
          return s3.getObject(config.AWS_STACK_REGION, config.AWS_S3_BUCKET_NAME, 'seo/' + slug + '.html').then(response => {
            html = response.Body.toString()
          }).catch(() => {
            return s3.getObject(config.AWS_STACK_REGION, config.AWS_S3_BUCKET_NAME, 'seo/event.html').then(response => {
              html = response.Body.toString()
            }).catch(() => {
              return s3.getObject(config.AWS_STACK_REGION, config.AWS_S3_BUCKET_NAME, 'seo/default.html').then(response => {
                html = response.Body.toString()
              })
            })
          })
        }
      }

      return s3.getObject(config.AWS_STACK_REGION, config.AWS_S3_BUCKET_NAME, 'seo/event.html').then(response => {
        html = response.Body.toString()
      }).catch(() => {
        return s3.getObject(config.AWS_STACK_REGION, config.AWS_S3_BUCKET_NAME, 'seo/default.html').then(response => {
          html = response.Body.toString()
        })
      })
    }).then(html => {
      const response = {
        status: '200',
        statusDescription: 'HTTP OK',
        body: html,
        headers: {
          'cache-control': [{
            key: 'Cache-Control',
            value: 'max-age=300'
          }],
          'content-type': [{
            key: 'Content-Type',
            value: 'text/html'
          }]
        }
      }
      callback(null, response)
    }).catch(err => {
      console.log(err)
      callback(null, {})
    })

    // normal request
  } else {
    callback(null, request)
  }
}
