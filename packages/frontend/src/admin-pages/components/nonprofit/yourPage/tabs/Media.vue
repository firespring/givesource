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
    <div class="c-page-section__content">
        <div class="c-header-actions">
            <div>
                <input v-on:change="onFileChange" ref="fileInput" type="file" name="fileUpload" id="fileUpload" class="u-none" :disabled="disableAddButton">
                <button v-on:click="onTrigger" type="button" class="c-btn c-btn--sm c-btn--icon" id="fileUploadTrigger" data-control="fileUpload" :disabled="disableAddButton">
                    <i class="fa fa-picture-o" aria-hidden="true"></i>Add Photos
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
                <th class="u-width-100p">Caption</th>
                <th></th>
            </tr>
            </thead>

            <draggable v-model="slides" :options="draggableOptions" :element="'tbody'" v-on:end="updateSortOrder">
                <media-list-table-row v-for="slide in slides" :slide="slide" :key="slide.uuid" v-on:deleteSlide="deleteSlide"></media-list-table-row>
            </draggable>
        </table>
    </div>
</template>

<script>
	const MediaHelper = require('./../../../../helpers/media');

	module.exports = {
		data: function () {
			return {
				file: null,
				slides: [],
				loadedSlides: false,
				maxSlides: 8,

				// Sort Options
				draggableOptions: {
					handle: '.c-drag-handle',
					ghostClass: 'reorder-placeholder',
					draggable: 'tr',
				}
			}
		},
		props: [
			'nonprofitUuid'
		],
		computed: {
			disableAddButton: function () {
				const vue = this;
				return !vue.loadedSlides || (vue.slides.length >= vue.maxSlides);
			}
		},
		beforeMount: function () {
			const vue = this;

			axios.get(API_URL + 'nonprofits/' + vue.nonprofitUuid + '/slides').then(function (response) {
				if (response.data.errorMessage) {
					console.log(response.data);
				} else {
					response.data.sort(function (a, b) {
						return a.sortOrder - b.sortOrder;
					});
					vue.slides = response.data;
					vue.loadedSlides = true;
				}
			}).catch(function (err) {
				console.log(err);
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
			updateSortOrder: function () {
				const vue = this;

				const original = JSON.parse(JSON.stringify(vue.slides));
				vue.slides.forEach(function (slide, i) {
					slide.sortOrder = i;
				});

				const toUpdate = _.differenceWith(vue.slides, original, _.isEqual);
				axios.patch(API_URL + 'nonprofits/' + vue.nonprofitUuid + '/slides', {
					slides: toUpdate
				}).catch(function (err) {
					console.log(err);
				});
			},
			onTrigger: function (event) {
				event.preventDefault();
				const vue = this;

				vue.$refs.fileInput.click();
			},
			onFileChange: function (event) {
				const vue = this;
				const files = event.target.files || event.dataTransfer.files;
				if (files.length) {
					vue.addModal('photo-editor', {
						file: files[0],
						listener: 'photoEditorSave-New',
						width: 770,
						height: 443
					});
					vue.$refs.fileInput.value = '';
					vue.addModal('spinner');
				}
			},
			uploadFile: function (fileData, file) {
				const vue = this;

				vue.addModal('spinner');

				axios.post(API_URL + 'files', {
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
					return axios.post(API_URL + 'nonprofits/' + vue.nonprofitUuid + '/slides', {
						fileUuid: vue.file.uuid,
						filename: vue.file.filename,
						type: MediaHelper.TYPE_IMAGE,
						url: PUBLIC_PAGES_CLOUDFRONT_URL + '/' + vue.file.path
					});
				}).then(function (response) {
					vue.$router.push({
						name: 'nonprofit-your-page-media-photos-edit',
						params: {
							slideUuid: response.data.uuid
						}
					});
					vue.clearModals();
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			},
			deleteSlide: function (slide) {
				const vue = this;

				vue.addModal('spinner');
				if (slide.fileUuid) {
					axios.delete(API_URL + 'files/' + slide.fileUuid).then(function () {
						return axios.delete(API_URL + 'nonprofits/' + vue.nonprofitUuid + '/slides/' + slide.uuid);
					}).then(function () {
						const current = JSON.parse(JSON.stringify(vue.slides));
						vue.slides = _.reject(current, {uuid: slide.uuid});
						vue.clearModals();
						vue.updateSortOrder();
					}).catch(function (err) {
						vue.clearModals();
						console.log(err);
					});
				} else {
					axios.delete(API_URL + 'nonprofits/' + vue.nonprofitUuid + '/slides/' + slide.uuid).then(function () {
						const current = JSON.parse(JSON.stringify(vue.slides));
						vue.slides = _.reject(current, {uuid: slide.uuid});
						vue.clearModals();
						vue.updateSortOrder();
					}).catch(function (err) {
						vue.clearModals();
						console.log(err);
					});
				}
			}
		},
		components: {
			'draggable': require('vuedraggable'),
			'media-list-table-row': require('./../media/MediaListTableRow.vue')
		}
	}
</script>




