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

function Media () {
}

Media.prototype.TYPE_IMAGE = 'IMAGE'
Media.prototype.TYPE_VIMEO = 'VIMEO'
Media.prototype.TYPE_YOUTUBE = 'YOUTUBE'

Media.prototype.VIDEO_REGEX = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/

/**
 * Get data from this video's url
 *
 * @param {String} videoUrl
 * @return {Promise}
 */
Media.prototype.getVideoData = function (videoUrl) {
  const media = this
  return new Promise(function (resolve, reject) {
    videoUrl.match(media.VIDEO_REGEX)

    if (RegExp.$3.indexOf('youtu') > -1) {
      resolve(getYoutubeData(RegExp.$6))
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
      resolve(media.getVimeoData(RegExp.$6))
    } else {
      reject(new Error('Video URL must be a Youtube or Vimeo URL.'))
    }
  })
}

/**
 * Get data from this Vimeo id
 *
 * @param {String} vimeoId
 * @return {Promise}
 */
Media.prototype.getVimeoData = function (vimeoId) {
  const media = this
  return new Promise(function (resolve, reject) {
    axios.get('https://vimeo.com/api/v2/video/' + vimeoId + '.json').then(function (response) {
      const data = response.data[0]
      resolve({
        id: data.id,
        type: media.TYPE_VIMEO,
        thumbnail: data.thumbnail_large,
        embedUrl: 'https://player.vimeo.com/video/' + data.id
      })
    }).catch(function (err) {
      reject(err)
    })
  })
}

// todo - we should likely revert the moving of these to the prototype
// this is a functional, but hacky, fix
Media.TYPE_IMAGE = Media.prototype.TYPE_IMAGE
Media.TYPE_VIMEO = Media.prototype.TYPE_VIMEO
Media.TYPE_YOUTUBE = Media.prototype.TYPE_YOUTUBE
Media.VIDEO_REGEX = Media.prototype.VIDEO_REGEX
Media.getVideoData = Media.prototype.getVideoData
Media.getVimeoData = Media.prototype.getVimeoData

/**
 * Get data from this Youtube id
 *
 * @param {String} youtubeId
 * @return {{}}
 */
const getYoutubeData = (youtubeId) => {
  return {
    id: youtubeId,
    type: Media.TYPE_YOUTUBE,
    thumbnail: 'https://img.youtube.com/vi/' + youtubeId + '/hqdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/' + youtubeId + '?autoplay=0&modestbranding=1'
  }
}

export default Media
