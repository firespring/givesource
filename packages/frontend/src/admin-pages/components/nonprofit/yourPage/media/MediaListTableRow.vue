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
    <tr>
        <td class="icon">
            <div class="c-drag-handle ui-sortable-handle"></div>
        </td>
        <td class="icon">
            <i class="fa" :class="icon" aria-hidden="true"></i>
        </td>
        <td class="image u-text-c">
            <img :src="imageSrc" :alt="caption">
        </td>
        <td>
            <strong>
                <router-link :to="{ name: editLink, params: { slideUuid: slide.uuid } }">{{ caption }}</router-link>
            </strong>
        </td>
        <td class="icon">
            <a href="#" v-on:click="deleteSlide" role="button" class="c-btn c-btn--sm c-btn--icon c-btn--bad c-btn--flat js-modal-trigger" rel="modal-confirm-delete">
                <i class="fa fa-trash" aria-hidden="true"></i>Delete
            </a>
        </td>
    </tr>
</template>

<script>
	const MediaHelper = require('./../../../../helpers/media');

	module.exports = {
		props: [
			'slide'
		],
		computed: {
			icon: function () {
				const vue = this;

				switch (vue.slide.type) {
					case MediaHelper.TYPE_VIMEO:
						return 'fa-vimeo-square';
					case MediaHelper.TYPE_YOUTUBE:
						return 'fa-youtube-square';
					case MediaHelper.TYPE_IMAGE:
					default:
						return 'fa-picture-o';
				}
			},
			editLink: function () {
				const vue = this;

				switch (vue.slide.type) {
					case MediaHelper.TYPE_VIMEO:
					case MediaHelper.TYPE_YOUTUBE:
						return 'nonprofit-your-page-media-videos-edit';
					case MediaHelper.TYPE_IMAGE:
					default:
						return 'nonprofit-your-page-media-photos-edit';
				}
			},
			caption: function () {
				const vue = this;

				switch (vue.slide.type) {
					case MediaHelper.TYPE_VIMEO:
					case MediaHelper.TYPE_YOUTUBE:
						return vue.slide.caption || vue.slide.url;
					case MediaHelper.TYPE_IMAGE:
					default:
						return vue.slide.caption || vue.slide.filename;
				}
			},
			imageSrc: function () {
				const vue = this;

				switch (vue.slide.type) {
					case MediaHelper.TYPE_VIMEO:
					case MediaHelper.TYPE_YOUTUBE:
						return vue.slide.thumbnail;
					case MediaHelper.TYPE_IMAGE:
					default:
						return vue.slide.url;
				}
			}
		},
		methods: {
			deleteSlide: function (event) {
				event.preventDefault();
				const vue = this;

				vue.$emit('deleteSlide', vue.slide);
			}
		}
	};
</script>