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

        <form v-on:submit.prevent="submit">

            <div class="c-form-item c-form-item--text">
                <div class="c-form-item__label">
                    <label for="slug" class="c-form-item-label-text">Page URL</label>
                </div>
                <div class="c-form-item__control">
                    <div class="c-form-control-grid u-items-center" v-if="editSlug">
                        <div class="c-form-control-grid__item u-flex-collapse">
                            <label for="slug"><strong>{{ pageLink }}</strong></label>
                        </div>
                        <div class="c-form-control-grid__item u-flex-expand">
                            <input v-model="formData.slug" type="text" name="slug" id="slug" v-on:change="slugMask">
                        </div>
                    </div>
                    <div class="c-notes c-notes--below" v-if="editSlug">
                        Note: Changing your page's URL will break existing bookmarks and links to your page.
                    </div>

                    <div class="c-form-control-grid u-items-center" v-if="!editSlug">
                        <div class="c-form-control-grid__item u-flex-collapse">
                            {{ pageLink }}{{ nonprofit.slug }}
                        </div>
                        <div class="c-form-control-grid__item u-flex-collapse">
                            <a v-on:click.prevent="changeSlug" href="#" class="c-btn c-btn--xs c-btn--flat c-btn--neutral">Change</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="c-form-item c-form-item--file c-form-item--file-picker">

                <div class="c-form-item__label">
                    <label for="pageLogo" class="c-form-item-label-text">Page Logo</label>
                </div>

                <div class="c-form-item__control u-flex-wrap">
                    <forms-image-upload v-model="formData.logo" name="pageLogo" id="pageLogo"></forms-image-upload>
                    <div class="c-notes c-notes--below u-width-100p">
                        Your logo will be automatically resized to fit the design.
                    </div>
                    <div v-if="formErrors.logo" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                        {{ formErrors.logo }}
                    </div>
                </div>

            </div>

            <div class="c-form-item c-form-item--text">
                <div class="c-form-item__label">
                    <label for="shortDescription" class="c-form-item-label-text">Short Description (Up to 200 characters)</label>
                </div>
                <div class="c-form-item__control">
                    <input v-model="formData.shortDescription" type="text" name="shortDescription" id="shortDescription" maxlength="200"
                           :class="{ 'has-error': formErrors.shortDescription }">
                    <div v-if="formErrors.shortDescription" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                        {{ formErrors.shortDescription }}
                    </div>
                </div>
            </div>

            <div class="c-form-item c-form-item--rich-text">
                <div class="c-form-item__label">
                    <label for="longDescription" class="c-form-item-label-text">Long Description</label>
                </div>
                <div class="c-form-item__control">
                    <div class="c-notes c-notes--above">
                        Describe the non-profit's mission, purpose, and goals for the giving day.
                    </div>
                    <forms-ckeditor v-model="formData.longDescription" :loaded="loaded" id="longDescription" :hasErrors="formErrors.longDescription"
                                    type="moderate"></forms-ckeditor>
                    <div v-if="formErrors.longDescription" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                        {{ formErrors.longDescription }}
                    </div>
                </div>
            </div>

            <footer class="c-form-actions">
                <button type="submit" class="c-btn c-btn--flat">Save Changes</button>
            </footer>
        </form>
    </div>
</template>

<script>
	import ComponentCKEditor from './../../../forms/Ckeditor.vue';
	import ComponentImageUpload from './../../../forms/ImageUpload.vue';

	const slug = require('slug');

	export default {
		data() {
			return {
				loaded: false,
				editSlug: false,

				// Form Data
				formData: {
					longDescription: '',
					shortDescription: '',
					slug: '',
					logo: null,
					logoFileUuid: ''
				},

				// Errors
				formErrors: {},
				apiError: {},
			};
		},
		computed: {
			pageLink() {
				return this.$store.getters.setting('EVENT_URL') + '/nonprofits/';
			}
		},
		props: {
			nonprofit: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		watch: {
			formData: {
				handler() {
					const vm = this;
					if (Object.keys(vm.formErrors).length) {
						vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
					}
				},
				deep: true
			},
			nonprofit: {
				handler() {
					const vm = this;

					vm.formData = vm.sync(vm.formData, vm.nonprofit);
					if (!_.isEmpty(vm.formData.logoFileUuid)) {
						vm.$request.get('files/' + vm.formData.logoFileUuid).then(response => {
							vm.formData.logo = response.data;
						}).catch(() => {
							vm.formData.logo = null;
						});
					} else {
						vm.formData.logo = null;
					}
					vm.loaded = true;
				},
				deep: true
			}
		},
		methods: {
			getConstraints() {
				return {
					longDescription: {
						presence: false,
					},
					shortDescription: {
						presence: false,
						length: 200,
					},
					slug: {
						presence: true
					},
					logo: {
						presence: false,
						image: true
					}
				}
			},
			submit() {
				const vm = this;

				vm.addModal('spinner');

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
				} else {
					vm.updateNonprofit();
				}
			},
			updateNonprofit() {
				const vm = this;

				vm.getUpdatedNonprofitParams().then(updatedParams => {
					let promise = Promise.resolve();
					const originalLogoFileUuid = vm.nonprofit.logoFileUuid;

					if (Object.keys(updatedParams).length) {
						promise = promise.then(() => {
							return vm.$request.patch('nonprofits/' + vm.nonprofit.uuid, updatedParams).then(response => {
								if (response.data.errorMessage) {
									vm.apiError = vm.formatErrorMessageResponse(response);
									vm.scrollToError('.c-alert');
								}
								vm.editSlug = false;
								vm.$emit('updateNonprofit', response.data);
							})
						});
					}

					if (updatedParams.hasOwnProperty('logoFileUuid') && !_.isEmpty(originalLogoFileUuid)) {
						promise = promise.then(() => {
							return vm.$request.delete('files/' + originalLogoFileUuid);
						});
					}

					promise.then(() => {
						vm.clearModals();
					});

					return promise;
				}).catch(err => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});
			},
			changeSlug() {
				this.editSlug = true;
			},
			slugMask(event) {
				const vm = this;
				vm.formData.slug = slug(event.target.value, {lower: true});
			},
			getUpdatedNonprofitParams() {
				const vm = this;
				let promise = Promise.resolve();

				if (vm.formData.logo instanceof File) {
					promise = promise.then(() => {
						return vm.uploadFile('logo').then(uploadedFile => {
							vm.$store.commit('generateCacheKey');
							vm.formData.logoFileUuid = uploadedFile && uploadedFile.hasOwnProperty('uuid') ? uploadedFile.uuid : '';
						});
					});
				} else if (_.isPlainObject(vm.formData.logo) && vm.formData.logo.hasOwnProperty('uuid')) {
					vm.formData.logoFileUuid = vm.formData.logo.uuid;
				} else {
					vm.formData.logoFileUuid = '';
				}

				promise = promise.then(() => {
					const params = vm.getUpdatedParameters(vm.formData, vm.nonprofit);
					delete params.logo;
					return params;
				});

				return promise;
			},
			uploadFile(key) {
				const vm = this;
				let file = null;
				let promise = Promise.resolve();
				if (vm.formData[key]) {
					promise = promise.then(() => {
						return vm.$request.post('files', {
							content_type: vm.formData[key].type,
							filename: vm.formData[key].name
						});
					}).then(response => {
						file = response.data.file;
						const signedUrl = response.data.upload_url;

						const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers));
						let instance = axios.create();
						instance.defaults.headers.common['Content-Type'] = vm.formData[key].type || 'application/octet-stream';
						instance.defaults.headers.put['Content-Type'] = vm.formData[key].type || 'application/octet-stream';
						axios.defaults.headers = defaultHeaders;
						return instance.put(signedUrl, vm.formData[key]);
					}).then(() => {
						return file;
					});
				}
				return promise;
			},
		},
		components: {
			'forms-ckeditor': ComponentCKEditor,
			'forms-image-upload': ComponentImageUpload,
		}
	};
</script>
