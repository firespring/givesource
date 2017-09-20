<!--
  ~ Copyright (C) 2017  Firespring
  ~
  ~ This program is free software: you can redistribute it and/or modify
  ~ it under the terms of the GNU General Public License as published by
  ~ the Free Software Foundation, either version 3 of the License, or
  ~ (at your option) any later version.
  ~
  ~ This program is distributed in the hope that it will be useful,
  ~ but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~ GNU General Public License for more details.
  ~
  ~ You should have received a copy of the GNU General Public License
  ~ along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -->

<template>
    <iframe v-if="loaded" :src="src" :width="width" :height="height" style="max-width: 100%; border-radius: 3px;" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</template>

<script>
	const MediaHelper = require('./../../helpers/media');

	module.exports = {
		data: function () {
			return {
				src: '',
				loaded: false,
			}
		},
		props: {
			url: {
				type: String,
				default: ''
			},
			width: {
				type: Number,
				default: 770
			},
			height: {
				type: Number,
				default: 443
			}
		},
		watch: {
			url: function () {
				const vue = this;

				vue.loaded = false;
				vue.loadIframe();
			}
		},
		mounted: function () {
			const vue = this;
			vue.loadIframe();
		},
		methods: {
			loadIframe: function () {
				const vue = this;

				if (vue.url) {
					MediaHelper.getVideoData(vue.url).then(function (response) {
						vue.src = response.embedUrl;
					}).then(function () {
						vue.loaded = true;
					});
				}
			}
		}
	};
</script>