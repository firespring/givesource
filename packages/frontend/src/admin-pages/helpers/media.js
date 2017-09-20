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

exports.TYPE_IMAGE = 'IMAGE';
exports.TYPE_VIMEO = 'VIMEO';
exports.TYPE_YOUTUBE = 'YOUTUBE';

exports.VIDEO_REGEX = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/;

/**
 * Get data from this video's url
 *
 * @param {String} videoUrl
 * @return {Promise}
 */
exports.getVideoData = function (videoUrl) {
	const media = this;
	return new Promise (function (resolve, reject) {
		videoUrl.match(media.VIDEO_REGEX);

		if (RegExp.$3.indexOf('youtu') > -1) {
			resolve(media.getYoutubeData(RegExp.$6));
		} else if (RegExp.$3.indexOf('vimeo') > -1) {
			media.getVimeoData(RegExp.$6).then(function (response) {
				resolve(response);
			}).catch(function (err) {
				reject(err);
			});
		} else {
			reject(new Error('Video URL must be a Youtube or Vimeo URL.'));
		}
	});
};

/**
 * Get data from this Vimeo id
 *
 * @param {String} vimeoId
 * @return {Promise}
 */
exports.getVimeoData = function (vimeoId) {
	const media = this;
	return new Promise(function (resolve, reject) {
		axios.get(`https://vimeo.com/api/v2/video/${vimeoId}.json`).then(function (response) {
			const data = response.data[0];
			resolve({
				id: `${data.id}`,
				type: media.TYPE_VIMEO,
				thumbnail: data.thumbnail_large,
				embedUrl: `https://player.vimeo.com/video/${data.id}`
			});
		}).catch(function (err) {
			reject(err);
		});
	});
};

/**
 * Get data from this Youtube id
 *
 * @param {String} youtubeId
 * @return {{id: string, type: string, thumbnail: string, embedUrl: string}}
 */
exports.getYoutubeData = function (youtubeId) {
	const media = this;
	return {
		id: `${youtubeId}`,
		type: media.TYPE_YOUTUBE,
		thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
		embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=0&modestbranding=1`
	};
};