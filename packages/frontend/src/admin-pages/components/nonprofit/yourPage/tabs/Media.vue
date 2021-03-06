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
    <div class="c-page-section__content">
        <api-error v-model="apiError"></api-error>
        <div class="c-header-actions">
            <div>
                <input v-on:change="onFileChange" ref="fileInput" type="file" name="fileUpload" id="fileUpload" class="u-none" accept="image/*" :disabled="disableAddButton">
                <button v-on:click="onTrigger" type="button" class="c-btn c-btn--sm c-btn--icon" id="fileUploadTrigger" data-control="fileUpload" :disabled="disableAddButton">
                    <i class="fa fa-picture-o" aria-hidden="true"></i>Add Images
                </button>
                <router-link :to="{ name: 'nonprofit-your-page-media-videos-add' }" role="button" class="c-btn c-btn--sm c-btn--icon" :disabled="disableAddButton">
                    <i class="fa fa-video-camera" aria-hidden="true"></i>Add Video
                </router-link>
            </div>
        </div>

        <table class="table-middle table-reorder">
            <thead>
            <tr>
                <th></th>
                <th>Type</th>
                <th>Preview</th>
                <th class="u-width-100p"></th>
                <th></th>
            </tr>
            </thead>

            <draggable v-model="slides" :options="draggableOptions" :element="'tbody'" v-on:end="updateSortOrder">
                <media-list-table-row v-for="slide in slides" :slide="slide" :file="getFile(slide.fileId)" :key="slide.id"
                                      v-on:deleteSlide="deleteSlide" v-if="loadedSlides"></media-list-table-row>
            </draggable>
        </table>
    </div>
</template>

<script>
	import * as Utils from './../../../../helpers/utils';
	import ComponentDraggable from 'vuedraggable';
	import ComponentMediaListTableRow from './../media/MediaListTableRow.vue';

	const MediaHelper = require('./../../../../helpers/media');

	export default {
		data: function () {
			return {
				file: null,
				files: [],
				slides: [],
				loadedSlides: false,
				maxSlides: 8,

				// Sort Options
				draggableOptions: {
					handle: '.c-drag-handle',
					ghostClass: 'reorder-placeholder',
					draggable: 'tr',
				},

				apiError: {},
			}
		},
		props: [
			'nonprofitId'
		],
		computed: {
			disableAddButton: function () {
				const vue = this;
				return !vue.loadedSlides || (vue.slides.length >= vue.maxSlides);
			}
		},
		beforeMount: function () {
			const vue = this;

			vue.$request.get('nonprofits/' + vue.nonprofitId + '/slides').then(function (response) {
				if (response.data.errorMessage) {
					console.log(response.data);
					return Promise.reject();
				} else {
					response.data.sort(function (a, b) {
						return a.sortOrder - b.sortOrder;
					});
					vue.slides = response.data;
					const fileIds = [];
					vue.slides.forEach(function (slide) {
						if (slide.hasOwnProperty('fileId') && slide.fileId) {
							fileIds.push(slide.fileId);
						}
					});

					if (fileIds.length) {
						return vue.$request.get('files/', {fileIds: fileIds});
					} else {
						return Promise.resolve();
					}
				}
			}).then(function (response) {
				if (response && response.data) {
					vue.files = response.data;
				}
				vue.loadedSlides = true;
			}).catch(function (err) {
				vue.apiError = err.response.data.errors;
			});
		},
		created: function () {
			const vue = this;

			vue.bus.$on('photoEditorSave-New', function (data, file) {
				vue.uploadFile(data, file);
			});
		},
		beforeDestroy: function () {
			const vue = this;

			vue.bus.$off('photoEditorSave-New');
		},
		methods: {
			getFile: function (fileId) {
				const vue = this;
				return _.find(vue.files, {id: fileId});
			},
			updateSortOrder: function () {
				const vue = this;

				const original = JSON.parse(JSON.stringify(vue.slides));
				vue.slides.forEach(function (slide, i) {
					slide.sortOrder = i;
				});

				const toUpdate = _.differenceWith(vue.slides, original, _.isEqual);
				vue.$request.patch('nonprofits/' + vue.nonprofitId + '/slides', {
					slides: toUpdate
				}).catch(function (err) {
					vue.apiError = err.response.data.errors;
				});
			},
			onTrigger: function (event) {
				event.preventDefault();
				const vue = this;

				vue.$refs.fileInput.click();
			},
			onFileChange: function (event) {
				const vue = this;

				const extensions = ['gif', 'jpeg', 'jpg', 'png'];
				const files = event.target.files || event.dataTransfer.files;
				if (files.length && files[0] instanceof File && extensions.indexOf(files[0].name.toLowerCase().split('.').pop()) > -1) {
					vue.addModal('photo-editor', {
						file: files[0],
						listener: 'photoEditorSave-New',
						width: 770,
						height: 443
					});
					vue.$refs.fileInput.value = '';
					vue.addModal('spinner');
				} else {
					vue.addModal('error', {
						title: 'Invalid Image Type',
						message: 'The following image types are supported: .gif, .jpg or .png'
					});
				}
			},
			uploadFile: function (fileData, file) {
				const vue = this;

				vue.addModal('spinner');

				vue.$request.post('files', {
					content_type: fileData.type,
					filename: fileData.name
				}).then(function (response) {
					vue.file = response.data.file;
					const signedUrl = response.data.upload_url;

					const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers));
					let instance = axios.create();
					instance.defaults.headers.common['Content-Type'] = fileData.type || 'application/octet-stream';
					instance.defaults.headers.put['Content-Type'] = fileData.type || 'application/octet-stream';
					axios.defaults.headers = defaultHeaders;
					return instance.put(signedUrl, file);
				}).then(function () {
					return vue.$request.post('nonprofits/' + vue.nonprofitId + '/slides', {
						fileId: vue.file.id,
						type: MediaHelper.TYPE_IMAGE
					});
				}).then(function (response) {
					vue.$store.commit('generateCacheKey');
					vue.$router.push({
						name: 'nonprofit-your-page-media-photos-edit',
						params: {
							slideId: response.data[0].id
						}
					});
					vue.clearModals();
				}).catch(function (err) {
					vue.clearModals();
					vue.apiError = err.response.data.errors;
				});
			},
			deleteSlide: function (slide) {
				const vue = this;

				vue.addModal('spinner');
				vue.$request.delete('nonprofits/' + vue.nonprofitId + '/slides/' + slide.id).then(function () {
					const current = JSON.parse(JSON.stringify(vue.slides));
					vue.slides = _.reject(current, {id: slide.id});
					vue.clearModals();
					vue.updateSortOrder();
				}).catch(function (err) {
					vue.clearModals();
					vue.apiError = err.response.data.errors;
				});
			}
		},
		components: {
			'draggable': ComponentDraggable,
			'media-list-table-row': ComponentMediaListTableRow,
		}
	}
</script>




