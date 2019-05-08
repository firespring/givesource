<!--
  ~ Copyright 2019 Firespring, Inc.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
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
            <a href="#" v-on:click.prevent="deleteSlide" role="button" class="c-btn c-btn--sm c-btn--icon c-btn--bad c-btn--flat js-modal-trigger" rel="modal-confirm-delete">
                <i class="fa fa-trash" aria-hidden="true"></i>Delete
            </a>
        </td>
    </tr>
</template>

<script>
	const MediaHelper = require('./../../../../helpers/media');

	export default {
		props: {
			file: {
				type: Object,
				default() {
					return {};
				},
			},
			slide: {},
		},
		computed: {
			icon() {
				const vm = this;

				switch (vm.slide.type) {
					case MediaHelper.TYPE_VIMEO:
						return 'fa-vimeo-square';
					case MediaHelper.TYPE_YOUTUBE:
						return 'fa-youtube-square';
					case MediaHelper.TYPE_IMAGE:
					default:
						return 'fa-picture-o';
				}
			},
			editLink() {
				const vm = this;

				switch (vm.slide.type) {
					case MediaHelper.TYPE_VIMEO:
					case MediaHelper.TYPE_YOUTUBE:
						return 'nonprofit-your-page-media-videos-edit';
					case MediaHelper.TYPE_IMAGE:
					default:
						return 'nonprofit-your-page-media-photos-edit';
				}
			},
			caption() {
				const vm = this;

				switch (vm.slide.type) {
					case MediaHelper.TYPE_VIMEO:
					case MediaHelper.TYPE_YOUTUBE:
						return vm.slide.caption || vm.slide.url;
					case MediaHelper.TYPE_IMAGE:
					default:
						return vm.slide.caption || vm.file.filename;
				}
			},
			imageSrc() {
				const vm = this;

				switch (vm.slide.type) {
					case MediaHelper.TYPE_VIMEO:
					case MediaHelper.TYPE_YOUTUBE:
						return vm.slide.thumbnail;
					case MediaHelper.TYPE_IMAGE:
					default:
						return vm.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vm.file.path;
				}
			}
		},
		methods: {
			deleteSlide() {
				const vm = this;

				vm.$emit('deleteSlide', vm.slide);
			}
		}
	};
</script>