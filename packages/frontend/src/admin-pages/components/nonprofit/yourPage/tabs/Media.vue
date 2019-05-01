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
                <button v-on:click.prevent="onTrigger" type="button" class="c-btn c-btn--sm c-btn--icon" id="fileUploadTrigger" data-control="fileUpload"
                        :disabled="disableAddButton">
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
                <media-list-table-row v-for="slide in slides" :slide="slide" :file="getFile(slide.fileUuid)" :key="slide.uuid"
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
		data() {
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
			'nonprofitUuid'
		],
		computed: {
			disableAddButton() {
				const vm = this;
				return !vm.loadedSlides || (vm.slides.length >= vm.maxSlides);
			}
		},
		beforeMount() {
			const vm = this;

			vm.$request.get('nonprofits/' + vm.nonprofitUuid + '/slides').then(response => {
				if (response.data.errorMessage) {
					vm.apiError = vm.formatErrorMessageResponse(response);
					vm.scrollToError('.c-alert');
					return Promise.reject();
				} else {
					response.data.sort((a, b) => {
						return a.sortOrder - b.sortOrder;
					});
					vm.slides = response.data;
					const uuids = [];
					vm.slides.forEach(slide => {
						if (slide.hasOwnProperty('fileUuid') && slide.fileUuid) {
							uuids.push(slide.fileUuid);
						}
					});

					if (uuids.length) {
						return vm.$request.get('files/', {uuids: uuids});
					} else {
						return Promise.resolve();
					}
				}
			}).then(response => {
				if (response && response.data) {
					vm.files = response.data;
				}
				vm.loadedSlides = true;
			}).catch(err => {
				vm.apiError = err.response.data.errors;
			});
		},
		created() {
			const vm = this;

			vm.bus.$on('photoEditorSave-New', (data, file) => {
				vm.uploadFile(data, file);
			});
		},
		beforeDestroy() {
			const vm = this;

			vm.bus.$off('photoEditorSave-New');
		},
		methods: {
			getFile(fileUuid) {
				const vm = this;
				return _.find(vm.files, {uuid: fileUuid});
			},
			updateSortOrder() {
				const vm = this;

				const original = JSON.parse(JSON.stringify(vm.slides));
				vm.slides.forEach((slide, i) => {
					slide.sortOrder = i;
				});

				const toUpdate = _.differenceWith(vm.slides, original, _.isEqual);
				vm.$request.patch('nonprofits/' + vm.nonprofitUuid + '/slides', {
					slides: toUpdate
				}).catch(err => {
					vm.apiError = err.response.data.errors;
				});
			},
			onTrigger() {
				this.$refs.fileInput.click();
			},
			onFileChange(event) {
				const vm = this;

				const extensions = ['gif', 'jpeg', 'jpg', 'png'];
				const files = event.target.files || event.dataTransfer.files;
				if (files.length && files[0] instanceof File && extensions.indexOf(files[0].name.toLowerCase().split('.').pop()) > -1) {
					vm.addModal('photo-editor', {
						file: files[0],
						listener: 'photoEditorSave-New',
						width: 770,
						height: 443
					});
					vm.$refs.fileInput.value = '';
					vm.addModal('spinner');
				} else {
					vm.addModal('error', {
						title: 'Invalid Image Type',
						message: 'The following image types are supported: .gif, .jpg or .png'
					});
				}
			},
			uploadFile(fileData, file) {
				const vm = this;

				vm.addModal('spinner');

				vm.$request.post('files', {
					content_type: fileData.type,
					filename: fileData.name
				}).then(response => {
					vm.file = response.data.file;
					const signedUrl = response.data.upload_url;

					const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers));
					let instance = axios.create();
					instance.defaults.headers.common['Content-Type'] = fileData.type || 'application/octet-stream';
					instance.defaults.headers.put['Content-Type'] = fileData.type || 'application/octet-stream';
					axios.defaults.headers = defaultHeaders;
					return instance.put(signedUrl, file);
				}).then(() => {
					return vm.$request.post('nonprofits/' + vm.nonprofitUuid + '/slides', {
						fileUuid: vm.file.uuid,
						type: MediaHelper.TYPE_IMAGE
					});
				}).then(response => {
					vm.$store.commit('generateCacheKey');
					vm.$router.push({
						name: 'nonprofit-your-page-media-photos-edit',
						params: {
							slideUuid: response.data.uuid
						}
					});
					vm.clearModals();
				}).catch(err => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});
			},
			deleteSlide(slide) {
				const vm = this;

				vm.addModal('spinner');
				vm.$request.delete('nonprofits/' + vm.nonprofitUuid + '/slides/' + slide.uuid).then(() => {
					const current = JSON.parse(JSON.stringify(vm.slides));
					vm.slides = _.reject(current, {uuid: slide.uuid});
					vm.clearModals();
					vm.updateSortOrder();
				}).catch(err => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});
			}
		},
		components: {
			'draggable': ComponentDraggable,
			'media-list-table-row': ComponentMediaListTableRow,
		}
	}
</script>




