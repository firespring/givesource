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

                    <form v-on:submit="submit">
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
                                            <input v-model="formData.FOUNDATION_URL" type="url" name="foundationUrl" id="foundationUrl" placeholder="http://">
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

	module.exports = {
		data: function () {
			return {
				settings: [],

				defaultColor: '#0098d8',

				// Form Data
				formData: {
					ACCENT_COLOR: '',
					EVENT_LOGO: null,
					FOUNDATION_LOGO: null,
					FOUNDATION_URL: '',
					MASTHEAD_IMAGE: null,
				},

				// Errors
				formErrors: {},
                apiError: {},

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
					ACCENT_COLOR: {
						label: 'Accent Color',
					},
					EVENT_LOGO: {
						presence: false,
						image: true,
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
                        vue.apiError = err.response.data.errors;
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
								settings.push({
									key: key,
									value: uploadedFile && uploadedFile.hasOwnProperty('uuid') ? uploadedFile.uuid : ''
								});
							});
						});
					} else {
						promise = promise.then(function () {
							let settingValue = vue.formData[key];
							if (key === 'ACCENT_COLOR' && vue.formData[key] === vue.defaultColor) {
								settingValue = '';
							} else if (_.isPlainObject(vue.formData[key]) && vue.formData[key].hasOwnProperty('uuid')) {
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
				const fileKeys = ['EVENT_LOGO', 'FOUNDATION_LOGO', 'MASTHEAD_IMAGE'];
				return _.includes(fileKeys, settingKey);
			}
		},
		components: {
			'forms-color': require('./../../../forms/Color.vue'),
			'forms-image-upload': require('./../../../forms/ImageUpload.vue')
		}
	};
</script>