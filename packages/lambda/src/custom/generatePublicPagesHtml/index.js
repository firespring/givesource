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

const util = require('./util')

exports.handle = (event, context, callback) => {
  const request = event.Records[0].cf.request
  const userAgent = request.headers['user-agent'][0].value

  const isAssetUri = !!request.uri.match(/\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff|svg|eot)/i)
  // todo remove headers check
  const isSocialBot = !!userAgent.match(/twitterbot|facebookexternalhit|linkedinbot|slackbot/i)
  const isSearchEngine = !!userAgent.match(/googlebot|bingbot|slur|duckduckbot|ia_archiver/i)
  const isNonprofitUri = request.uri.indexOf('/nonprofits/') === 0
  const nonprofitSlug = !isNonprofitUri ? null : request.uri
    .replace('/nonprofits/', '')
    .split('/')[0]
    .split('.')[0]
    .split('&')[0]

  function sendCustomResponse (body) {
    const response = {
      status: '200',
      statusDescription: 'HTTP OK',
      body: body,
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
  }

  const staticPathsToTry = []
  if (!isAssetUri) {
    if (isSearchEngine) {
      // just serve the original route and let the searchEngine render the original page
      // if (nonprofitSlug) staticPathsToTry.push('seo/' + nonprofitSlug + '.html')
      // staticPathsToTry.push('seo/event.html', 'seo/default.html')
    } else if (isSocialBot) {
      if (nonprofitSlug) staticPathsToTry.push('social-sharing/' + nonprofitSlug + '.html')
      staticPathsToTry.push('social-sharing/event.html', 'social-sharing/default.html')
    }
  }

  util.getFirstMatchFromS3(staticPathsToTry).then(s3Body => {
    if (s3Body) {
      // we found a custom file in s3 - serve that
      sendCustomResponse(s3Body)
    } else {
      // forward along to the original destination (static asset)
      callback(null, request)
    }
  }).catch(err => {
    console.log({ err })
    callback(null, {})
  })
}
