<!--
  ~ Copyright 2018 Firespring, Inc.
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
    <div class="o-app">
        <navigation></navigation>

        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">

                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Social Sharing Settings</h1>
                    </div>
                </div>

                <div class="o-app-main-content">

                    <form v-on:submit="submit">
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Content For Social Sharing</h2>
                                    <div class="c-notes c-notes--below">
                                        This content will be used when someone clicks the "share" buttons on donation pages.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--file c-form-item--file-picker" :class="{ 'c-form-item--has-error': formErrors.SOCIAL_SHARING_IMAGE }">
                                    <div class="c-form-item__label">
                                        <label for="socialSharingImage" class="c-form-item-label-text">Social Image</label>
                                    </div>
                                    <forms-image-upload v-model="formData.SOCIAL_SHARING_IMAGE" name="socialSharingImage" id="socialSharingImage"></forms-image-upload>
                                    <div v-if="formErrors.SOCIAL_SHARING_IMAGE" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.SOCIAL_SHARING_IMAGE }}
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--textarea" :class="{ 'c-form-item--has-error': formErrors.SOCIAL_SHARING_DESCRIPTION }">
                                    <div class="c-form-item__label">
                                        <label for="socialSharingDescription" class="c-form-item-label-text">Social Description</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <textarea v-model="formData.SOCIAL_SHARING_DESCRIPTION" name="socialSharingDescription" id="socialSharingDescription"
                                                  :class="{ 'has-error': formErrors.SOCIAL_SHARING_DESCRIPTION }"></textarea>
                                        <div v-if="formErrors.SOCIAL_SHARING_DESCRIPTION" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.SOCIAL_SHARING_DESCRIPTION }}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Save Changes</button>
                            <router-link :to="{ name: 'settings-list' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                        </footer>
                    </form>

                </div>
            </div>
        </main>
    </div>
</template>

<script>
	import ComponentImageUpload from './../../../forms/ImageUpload.vue';

	export default {
		data: function () {
			return {
				settings: [],

				// Form Data
				formData: {
					SOCIAL_SHARING_IMAGE: null,
					SOCIAL_SHARING_DESCRIPTION: ''
				},

				// Errors
				formErrors: {}

			};
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('settings', {
					keys: Object.keys(vue.formData)
				}).then(function (response) {
					vue.settings = response.data;
				});
			});
		},
		watch: {
			formData: {
				handler: function () {
					const vue = this;
					if (Object.keys(vue.formErrors).length) {
						vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
					}
				},
				deep: true
			},
			settings: {
				handler: function () {
					const vue = this;
					if (vue.settings.length) {
						Object.keys(vue.formData).forEach(function (key) {
							const setting = _.find(vue.settings, {key: key});
							if (setting) {
								if (!vue.isFileSetting(key)) {
									vue.formData[key] = setting.value;
								} else {
									if (setting.value) {
										vue.$request.get('files/' + setting.value).then(function (response) {
											vue.formData[key] = response.data;
										}).catch(function () {
											vue.formData[key] = null;
										});
									}
								}
							}
						});
					}
				},
				deep: true
			}
		},
		methods: {
			getConstraints: function () {
				return {
					SOCIAL_SHARING_DESCRIPTION: {
						presence: false
					},
					SOCIAL_SHARING_IMAGE: {
						presence: false,
						image: true,
					}
				};
			},
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('spinner');

				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.updateSettings();
				}
			},
			updateSettings: function () {
				const vue = this;

				vue.getSettingsToUpdate().then(function (settings) {
					const toUpdate = _.reject(settings, function (setting) {
						return (setting.value === '' || setting.value === null);
					});
					const toDelete = _.filter(settings, function (setting) {
						return (setting.value === '' || setting.value === null);
					});

					vue.$request.patch('settings', {
						settings: toUpdate
					}).then(function (response) {
						if (response.data.errorMessage) {
							console.log(response.data);
						}
						return vue.$request.delete('settings', {
							settings: toDelete
						});
					}).then(function (response) {
						if (response.data.errorMessage) {
							console.log(response.data);
						}

						// delete files that were replace or removed
						const filesToDelete = [];
						_.forEach(settings, function (setting) {
							if (vue.isFileSetting(setting.key)) {
								const originalSetting = _.find(vue.settings, {key: setting.key});
								if (originalSetting && originalSetting.value !== setting.value && originalSetting.value !== '' && originalSetting.value !== null) {
									filesToDelete.push(originalSetting.value);
								}
							}
						});

						if (filesToDelete.length > 0) {
							return vue.$request.delete('files', {
								files: filesToDelete
							});
						}

						return Promise.resolve();
					}).then(function () {
						vue.clearModals();
						vue.$router.push({name: 'settings-list'});
					}).catch(function (err) {
						vue.clearModals();
						console.log(err);
					});

				});

			},
			getSettingsToUpdate: function () {
				const vue = this;
				const settings = [];
				let promise = Promise.resolve();
				Object.keys(vue.formData).forEach(function (key) {
					if (vue.formData[key] instanceof File) {
						promise = promise.then(function () {
							return vue.uploadImage(key).then(function (uploadedFile) {
								vue.$store.commit('generateCacheKey');
								settings.push({
									key: key,
									value: uploadedFile && uploadedFile.hasOwnProperty('uuid') ? uploadedFile.uuid : ''
								});
							});
						});
					} else {
						promise = promise.then(function () {
							let settingValue = vue.formData[key];
							if (_.isPlainObject(vue.formData[key]) && vue.formData[key].hasOwnProperty('uuid')) {
								settingValue = vue.formData[key].uuid;
							}
							settings.push({
								key: key,
								value: settingValue
							});
						});
					}
				});

				promise = promise.then(function () {
					return settings;
				});

				return promise;
			},
			uploadImage: function (key) {
				const vue = this;
				let file = null;
				let promise = Promise.resolve();
				if (vue.formData[key]) {
					promise = promise.then(function () {
						return vue.$request.post('files', {
							content_type: vue.formData[key].type,
							filename: vue.formData[key].name
						});
					}).then(function (response) {
						file = response.data.file;
						const signedUrl = response.data.upload_url;

						const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers));
						let instance = axios.create();
						instance.defaults.headers.common['Content-Type'] = vue.formData[key].type || 'application/octet-stream';
						instance.defaults.headers.put['Content-Type'] = vue.formData[key].type || 'application/octet-stream';
						axios.defaults.headers = defaultHeaders;
						return instance.put(signedUrl, vue.formData[key]);
					}).then(function () {
						return file;
					});
				}
				return promise;
			},
			isFileSetting(settingKey) {
				const fileKeys = ['SOCIAL_SHARING_IMAGE'];
				return _.includes(fileKeys, settingKey);
			}
		},
		components: {
			'forms-image-upload': ComponentImageUpload
		}
	};
</script>