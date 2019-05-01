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
    <div class="o-app">
        <navigation></navigation>

        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">

                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Site Appearance</h1>
                    </div>
                </div>

                <div class="o-app-main-content">
                    <api-error v-model="apiError"></api-error>

                    <form v-on:submit.prevent="submit">
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Logos, Images &amp; Color</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--file c-form-item--file-picker">
                                    <div class="c-form-item__label">
                                        <label for="givingDayLogo" class="c-form-item-label-text">Giving Day Event Logo</label>
                                    </div>
                                    <forms-image-upload v-model="formData.EVENT_LOGO" name="givingDayLogo" id="givingDayLogo"></forms-image-upload>
                                    <div class="c-notes c-notes--below u-width-100p">
                                        Your Giving Day event's logo will be displayed on all pages. It will be automatically resized as needed.
                                    </div>
                                    <div v-if="formErrors.EVENT_LOGO" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.EVENT_LOGO }}
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--file c-form-item--file-picker">
                                    <div class="c-form-item__label">
                                        <label for="foundationLogo" class="c-form-item-label-text">Your Foundation's Logo</label>
                                    </div>
                                    <forms-image-upload v-model="formData.FOUNDATION_LOGO" name="foundationLogo" id="foundationLogo"></forms-image-upload>
                                    <div class="c-notes c-notes--below u-width-100p">
                                        Your foundation logo will be displayed in a "Presented By" slot throughout your Giving Day site. Logos are automatically resized as needed.
                                    </div>
                                    <div v-if="formErrors.FOUNDATION_LOGO" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.FOUNDATION_LOGO }}
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--url">
                                    <div class="c-form-item__label">
                                        <label for="foundationUrl" class="c-form-item-label-text">Foundation Logo Link</label>
                                    </div>

                                    <div class="c-form-item__control">
                                        <div class="u-control-icon u-control-icon--url">
                                            <input v-model="formData.FOUNDATION_URL" type="url" name="foundationUrl" id="foundationUrl" placeholder="https://">
                                        </div>
                                        <div class="c-notes c-notes--below">
                                            Enter a URL that you want your foundation logo to link to (e.g., your foundation's website).
                                        </div>
                                        <div v-if="formErrors.FOUNDATION_URL" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.FOUNDATION_URL }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--file c-form-item--file-picker">
                                    <div class="c-form-item__label">
                                        <label for="backgroundMasthead" class="c-form-item-label-text">Masthead Background</label>
                                    </div>
                                    <forms-image-upload v-model="formData.MASTHEAD_IMAGE" name="backgroundMasthead" id="backgroundMasthead"></forms-image-upload>
                                    <div class="c-notes c-notes--below u-width-100p">
                                        This image will appear in the masthead of your page as a background image. We recommend using an image that's 1200x1200 or larger. Grayscale
                                        or duotone images work best.
                                    </div>
                                    <div v-if="formErrors.MASTHEAD_IMAGE" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.MASTHEAD_IMAGE }}
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--file c-form-item--file-picker">
                                    <div class="c-form-item__label">
                                        <label for="faviconImage" class="c-form-item-label-text">Favicon</label>
                                    </div>
                                    <forms-image-upload v-model="formData.FAVICON" name="faviconImage" id="faviconImage"></forms-image-upload>
                                    <div class="c-notes c-notes--below u-width-100p">
                                        This image will appear next to the website's title in the user's browser, as well as in their bookmarks list. Favicons should be 64x64.
                                        For more information on creating a favicon,
                                        <a href="http://blog.teamtreehouse.com/how-to-make-a-favicon" target="_blank" rel="noreferrer noopener">click here</a>.
                                    </div>
                                    <div v-if="formErrors.FAVICON" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.FAVICON }}
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--color">
                                    <div class="c-form-item__label">
                                        <label for="accentColor" class="c-form-item-label-text">Accent Color</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-color v-model="formData.ACCENT_COLOR" id="accentColor" name="accentColor" :defaultColor="defaultColor"></forms-color>
                                        <div class="c-notes c-notes--below">
                                            Customize the look of your page with an accent color.
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
	import ComponentColor from './../../../forms/Color.vue';
	import ComponentImageUpload from './../../../forms/ImageUpload.vue';

	export default {
		data() {
			return {
				settings: [],

				defaultColor: '#0098d8',

				// Form Data
				formData: {
					ACCENT_COLOR: '',
					EVENT_LOGO: null,
					FAVICON: null,
					FOUNDATION_LOGO: null,
					FOUNDATION_URL: '',
					MASTHEAD_IMAGE: null,
				},

				// Errors
				formErrors: {},
				apiError: {},

			};
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$request.get('settings', {
					keys: Object.keys(vm.formData)
				}).then(response => {
					vm.settings = response.data;
				});
			});
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
			settings: {
				handler() {
					const vm = this;
					if (vm.settings.length) {
						Object.keys(vm.formData).forEach(key => {
							const setting = _.find(vm.settings, {key: key});
							if (setting) {
								if (!vm.isFileSetting(key)) {
									vm.formData[key] = setting.value;
								} else {
									if (setting.value) {
										vm.$request.get('files/' + setting.value).then(response => {
											vm.formData[key] = response.data;
										}).catch(() => {
											vm.formData[key] = null;
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
			getConstraints() {
				return {
					ACCENT_COLOR: {
						label: 'Accent Color',
					},
					EVENT_LOGO: {
						presence: false,
						image: true,
					},
					FAVICON: {
						presence: false,
						favicon: true,
					},
					FOUNDATION_LOGO: {
						presence: false,
						image: true,
					},
					FOUNDATION_URL: {
						presence: false,
						label: 'Foundation Logo Link',
						url: true,
					},
					MASTHEAD_IMAGE: {
						presence: false,
						image: true,
					}
				};
			},
			submit() {
				const vm = this;

				vm.addModal('spinner');

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
				} else {
					vm.updateSettings();
				}
			},
			updateSettings() {
				const vm = this;

				vm.getSettingsToUpdate().then(settings => {
					const toUpdate = _.reject(settings, setting => {
						return (setting.value === '' || setting.value === null);
					});
					const toDelete = _.filter(settings, setting => {
						return (setting.value === '' || setting.value === null);
					});

					vm.$request.patch('settings', {
						settings: toUpdate
					}).then(response => {
						if (response.data.errorMessage) {
							vm.apiError = vm.formatErrorMessageResponse(response);
							vm.scrollToError('.c-alert');
						}
						return vm.$request.delete('settings', {
							settings: toDelete
						});
					}).then(response => {
						if (response.data.errorMessage) {
							vm.apiError = vm.formatErrorMessageResponse(response);
							vm.scrollToError('.c-alert');
						}

						// delete files that were replace or removed
						const filesToDelete = [];
						_.forEach(settings, setting => {
							if (vm.isFileSetting(setting.key)) {
								const originalSetting = _.find(vm.settings, {key: setting.key});
								if (originalSetting && originalSetting.value !== setting.value && originalSetting.value !== '' && originalSetting.value !== null) {
									filesToDelete.push(originalSetting.value);
								}
							}
						});

						if (filesToDelete.length > 0) {
							return vm.$request.delete('files', {
								files: filesToDelete
							});
						}

						return Promise.resolve();
					}).then(() => {
						vm.clearModals();
						vm.$router.push({name: 'settings-list'});
					}).catch(err => {
						vm.clearModals();
						vm.apiError = err.response.data.errors;
					});

				});

			},
			getSettingsToUpdate() {
				const vm = this;
				const settings = [];
				let promise = Promise.resolve();
				Object.keys(vm.formData).forEach(key => {
					if (vm.formData[key] instanceof File) {
						promise = promise.then(() => {
							return vm.uploadImage(key).then(uploadedFile => {
								vm.$store.commit('generateCacheKey');
								settings.push({
									key: key,
									value: uploadedFile && uploadedFile.hasOwnProperty('uuid') ? uploadedFile.uuid : ''
								});
							});
						});
					} else {
						promise = promise.then(() => {
							let settingValue = vm.formData[key];
							if (key === 'ACCENT_COLOR' && vm.formData[key] === vm.defaultColor) {
								settingValue = '';
							} else if (_.isPlainObject(vm.formData[key]) && vm.formData[key].hasOwnProperty('uuid')) {
								settingValue = vm.formData[key].uuid;
							}
							settings.push({
								key: key,
								value: settingValue
							});
						});
					}
				});

				promise = promise.then(() => {
					return settings;
				});

				return promise;
			},
			uploadImage(key) {
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
			isFileSetting(settingKey) {
				const fileKeys = ['EVENT_LOGO', 'FAVICON', 'FOUNDATION_LOGO', 'MASTHEAD_IMAGE'];
				return _.includes(fileKeys, settingKey);
			}
		},
		components: {
			'forms-color': ComponentColor,
			'forms-image-upload': ComponentImageUpload,
		}
	};
</script>