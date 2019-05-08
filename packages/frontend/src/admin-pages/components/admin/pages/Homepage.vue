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
                <div class="o-app-main-content">
                    <api-error v-model="apiError"></api-error>

                    <div class="o-page-header">
                        <div class="o-page-header__text">
                            <nav class="o-page-header-nav c-breadcrumb">
                                <span><router-link :to="{name: 'pages-list'}">Pages</router-link></span>
                            </nav>
                            <h1 class="o-page-header-title">Home</h1>
                        </div>
                    </div>

                    <form v-on:submit.prevent="submit">

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Primary Elements</h2>
                                    <div class="c-notes c-notes--below">
                                        These elements will always appear in your homepage's masthead and main content areas. Customize them to reflect your event's different
                                        stages.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--text">
                                    <div class="c-form-item__label">
                                        <label for="homepageTitle" class="c-form-item-label-text">Homepage Title</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input v-model="formData.contents.HOMEPAGE_TITLE.value" type="text" name="homepageTitle" id="homepageTitle">
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--file c-form-item--file-picker">
                                    <div class="c-form-item__label">
                                        <label for="homepageSpotlight" class="c-form-item-label-text">Homepage Spotlight Image</label>
                                    </div>
                                    <forms-image-upload v-model="formData.contents.HOMEPAGE_SPOTLIGHT.value" name="homepageSpotlight" id="homepageSpotlight"></forms-image-upload>
                                    <div class="c-notes c-notes--below u-width-100p">
                                        This image will appear in your homepage's masthead. If you've uploaded a masthead background, this spotlight image will appear on top of it.
                                    </div>
                                    <div v-if="formErrors['contents.HOMEPAGE_SPOTLIGHT.value']" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors['contents.HOMEPAGE_SPOTLIGHT.value'] }}
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--rich-text">
                                    <div class="c-form-item__label">
                                        <label for="headerText" class="c-form-item-label-text">Masthead Text</label>
                                        <div class="c-notes">
                                            This text will appear in your homepage's masthead, directly below the featured image (if one has been uploaded).
                                        </div>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.contents.HOMEPAGE_MASTHEAD_TEXT.value" :loaded="loaded" id="headerText" type="basic"></forms-ckeditor>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--rich-text">
                                    <div class="c-form-item__label">
                                        <label for="mainText" class="c-form-item-label-text">Main Text</label>

                                        <div class="c-notes">
                                            This text will appear in the main content area of your homepage.
                                        </div>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.contents.HOMEPAGE_MAIN_TEXT.value" :loaded="loaded" id="mainText" type="advanced"></forms-ckeditor>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Nonprofit Registration Text</h2>
                                    <div class="c-notes c-notes--below">
                                        This text will only appear on your homepage while you're accepting nonprofit registrations.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--text">
                                    <div class="c-form-item__label">
                                        <label for="nonprofitRegistrationButtonLabel" class="c-form-item-label-text">Registration Button Label</label>
                                        <div class="c-notes">
                                            Defaults to "Register Your Nonprofit Today" if left blank.
                                        </div>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input v-model="formData.contents.HOMEPAGE_REGISTER_BUTTON.value" type="text" name="nonprofitRegistrationButtonLabel"
                                               id="nonprofitRegistrationButtonLabel">
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--rich-text">
                                    <div class="c-form-item__label">
                                        <label for="nonprofitDetailsText" class="c-form-item-label-text">Details</label>
                                        <div class="c-notes">
                                            This text appears below the registration button. Use it to give nonprofits some additional information about registering.
                                        </div>
                                    </div>

                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.contents.HOMEPAGE_REGISTER_DETAILS.value" :loaded="loaded" id="nonprofitDetailsText" type="basic">
                                        </forms-ckeditor>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Match Fund</h2>
                                    <div class="c-notes c-notes--below">
                                        This text will only appear on your homepage if you're accepting match funds for all nonprofits.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--checkbox">
                                    <div class="c-form-item__control">

                                        <ul class="c-input-list c-input-list--checkbox" aria-labelledby="enableMatchFunds">
                                            <li class="has-sub-options" :class="{'has-sub-options--show': showMatchFundOptions}">
                                                <input v-model="formData.contents.HOMEPAGE_MATCH_IS_ENABLED.value" type="checkbox" name="enableMatchFunds"
                                                       id="enableMatchFunds-1">
                                                <label for="enableMatchFunds-1">Enable Match Funds for all Participating Nonprofits</label>

                                                <div class="sub-options">

                                                    <div class="c-form-item c-form-item--select c-form-item--combobox c-form-item--required"
                                                         :class="{ 'c-form-item--has-error': formErrors['settings.MATCH_FUND_NONPROFIT_UUID'] }">
                                                        <div class="c-form-item__label">
                                                            <label for="matchFundNonprofitUuid" class="c-form-item-label-text">Match Fund Nonprofit</label>
                                                        </div>
                                                        <div class="c-form-item__control">
                                                            <forms-select-nonprofit v-model="formData.settings.MATCH_FUND_NONPROFIT_UUID" id="matchFundNonprofitUuid"
                                                                                    name="matchFundNonprofitUuid" :nonprofits="nonprofits"
                                                                                    :hasError="formErrors.hasOwnProperty('settings.MATCH_FUND_NONPROFIT_UUID')"></forms-select-nonprofit>
                                                            <div v-if="formErrors['settings.MATCH_FUND_NONPROFIT_UUID']"
                                                                 class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                                                {{ formErrors['settings.MATCH_FUND_NONPROFIT_UUID'] }}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="c-form-item c-form-item--text">
                                                        <div class="c-form-item__label">
                                                            <label for="matchFundButtonLabel" class="c-form-item-label-text">Match Fund Button Label</label>
                                                            <div class="c-notes">
                                                                Defaults to "Love Them All" if left blank.
                                                            </div>
                                                        </div>
                                                        <div class="c-form-item__control">
                                                            <input v-model="formData.contents.HOMEPAGE_MATCH_BUTTON.value" type="text" name="matchFundButtonLabel"
                                                                   id="matchFundButtonLabel">
                                                        </div>
                                                    </div>

                                                    <div class="c-form-item c-form-item--text">
                                                        <div class="c-form-item__label">
                                                            <label for="matchFundDetails" class="c-form-item-label-text">Match Fund Details Text</label>
                                                            <div class="c-notes">
                                                                This text appears below the Match Fund button.
                                                            </div>
                                                        </div>
                                                        <div class="c-form-item__control">
                                                            <input v-model="formData.contents.HOMEPAGE_MATCH_DETAILS.value" type="text" name="matchFundDetails"
                                                                   id="matchFundDetails">
                                                        </div>
                                                    </div>

                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Post-Event Text</h2>
                                    <div class="c-notes c-notes--below">
                                        This text will only appear on your homepage after your Giving Day event has ended.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--rich-text">
                                    <div class="c-form-item__label">
                                        <label for="postEventDetailsText" class="c-form-item-label-text">Details</label>
                                        <div class="c-notes">
                                            This text appears below the email receipt form. Use it to give nonprofits some additional information to your nonprofits and donors.
                                        </div>
                                    </div>

                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.contents.HOMEPAGE_POST_EVENT_TEXT.value" :loaded="loaded" id="postEventDetailsText"
                                                        type="advanced"></forms-ckeditor>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Save Changes</button>
                            <router-link :to="{name: 'pages-list'}" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                        </footer>

                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
	import ComponentCKEditor from './../../forms/Ckeditor.vue';
	import ComponentImageUpload from './../../forms/ImageUpload.vue';
	import ComponentSelectNonprofit from './../../forms/SelectNonprofit.vue';
	import Request from './../../../helpers/request';

	export default {
		data() {
			return {
				nonprofits: [],
				contents: [],
				original: [],
				settings: [],
				loaded: false,

				// Form Data
				formData: {
					contents: {
						HOMEPAGE_TITLE: {
							key: 'HOMEPAGE_TITLE',
							type: 'TEXT',
							value: ''
						},
						HOMEPAGE_SPOTLIGHT: {
							key: 'HOMEPAGE_SPOTLIGHT',
							type: 'FILE',
							value: null
						},
						HOMEPAGE_MASTHEAD_TEXT: {
							key: 'HOMEPAGE_MASTHEAD_TEXT',
							type: 'RICH_TEXT',
							value: ''
						},
						HOMEPAGE_MAIN_TEXT: {
							key: 'HOMEPAGE_MAIN_TEXT',
							type: 'RICH_TEXT',
							value: ''
						},
						HOMEPAGE_POST_EVENT_TEXT: {
							key: 'HOMEPAGE_POST_EVENT_TEXT',
							type: 'RICH_TEXT',
							value: ''
						},
						HOMEPAGE_REGISTER_BUTTON: {
							key: 'HOMEPAGE_REGISTER_BUTTON',
							type: 'TEXT',
							value: 'Register Your Nonprofit Today'
						},
						HOMEPAGE_REGISTER_DETAILS: {
							key: 'HOMEPAGE_REGISTER_DETAILS',
							type: 'RICH_TEXT',
							value: ''
						},
						HOMEPAGE_MATCH_IS_ENABLED: {
							key: 'HOMEPAGE_MATCH_IS_ENABLED',
							type: 'OPTION',
							value: false
						},
						HOMEPAGE_MATCH_BUTTON: {
							key: 'HOMEPAGE_MATCH_BUTTON',
							type: 'TEXT',
							value: 'Love Them All'
						},
						HOMEPAGE_MATCH_DETAILS: {
							key: 'HOMEPAGE_MATCH_DETAILS',
							type: 'TEXT',
							value: ''
						},
					},
					settings: {
						MATCH_FUND_NONPROFIT_UUID: ''
					}
				},

				// Errors
				formErrors: {},
				apiError: {},

			};
		},
		computed: {
			showMatchFundOptions() {
				return this.formData.contents.HOMEPAGE_MATCH_IS_ENABLED.value;
			},
		},
		beforeRouteEnter(to, from, next) {
			const fetchData = () => {
				const request = new Request();
				let contents = null;
				let nonprofits = null;
				let settings = null;
				let promise = Promise.resolve();

				promise = promise.then(() => {
					return request.get('contents', {
						keys: [
							'HOMEPAGE_TITLE',
							'HOMEPAGE_SPOTLIGHT',
							'HOMEPAGE_MASTHEAD_TEXT',
							'HOMEPAGE_MAIN_TEXT',
							'HOMEPAGE_POST_EVENT_TEXT',
							'HOMEPAGE_REGISTER_BUTTON',
							'HOMEPAGE_REGISTER_DETAILS',
							'HOMEPAGE_MATCH_IS_ENABLED',
							'HOMEPAGE_MATCH_BUTTON',
							'HOMEPAGE_MATCH_DETAILS'
						]
					}).then(response => {
						contents = response.data;
					});
				});

				promise = promise.then(() => {
					return request.get('settings', {
						keys: ['MATCH_FUND_NONPROFIT_UUID']
					}).then(response => {
						settings = response.data;
					});
				});

				promise = promise.then(() => {
					return request.get('nonprofits/search', {
						status: 'ACTIVE'
					}).then(response => {
						nonprofits = response.data;
					});
				});

				promise = promise.then(() => {
					const spotlight = _.find(contents, {key: 'HOMEPAGE_SPOTLIGHT'});
					if (spotlight) {
						return request.get('files/' + spotlight.value).then(response => {
							spotlight.file = response.data;
						}).catch(() => {
							spotlight.file = null;
						});
					} else {
						return Promise.resolve();
					}
				});

				promise = promise.then(() => {
					return {
						contents: contents,
						nonprofits: nonprofits,
						settings: settings
					};
				});

				return promise;
			};

			fetchData().then(data => {
				next(vm => {
					vm.contents = data.contents;
					vm.original = JSON.parse(JSON.stringify(data.contents));
					vm.nonprofits = data.nonprofits;
					vm.settings = data.settings;
					vm.loaded = true;
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
			contents: {
				handler() {
					const vm = this;
					if (vm.contents.length) {
						Object.keys(vm.formData.contents).forEach(key => {
							const content = _.cloneDeep(_.find(vm.contents, {key: key}));
							if (content) {
								if (content.type === 'FILE' && content.hasOwnProperty('file')) {
									vm.formData.contents[key] = content;
									vm.formData.contents[key].value = content.file;
								} else {
									vm.formData.contents[key] = content;
								}
							}
						});
					}
				},
				deep: true
			},
			settings: {
				handler() {
					const vm = this;
					if (vm.settings.length) {
						Object.keys(vm.formData.settings).forEach(key => {
							const setting = _.find(vm.settings, {key: key});
							if (setting) {
								vm.formData.settings[key] = setting.value;
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
					'contents.HOMEPAGE_SPOTLIGHT.value': {
						label: 'Homepage Spotlight Image',
						presence: false,
						image: true
					},
					'settings.MATCH_FUND_NONPROFIT_UUID': {
						label: 'Match Fund Nonprofit',
						presence(value, data) {
							return data.contents.HOMEPAGE_MATCH_IS_ENABLED.value;
						}
					}
				};
			},
			submit() {
				const vm = this;

				vm.addModal('spinner');

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
					vm.scrollToError();
				} else {
					vm.updateContents();
				}
			},
			updateContents() {
				const vm = this;

				vm.getContentsToUpdate().then(contents => {
					const toCreate = [];
					const toUpdate = [];
					const toDelete = [];
					const filesToDelete = [];
					_.forEach(contents, (content, key) => {
						const original = _.find(vm.original, {key: key});
						const newValue = content.value;
						if (original) {
							if (newValue === '' || newValue === null) {
								toDelete.push(content);
								if (content.type === 'FILE') {
									filesToDelete.push(original.value);
								}
							} else if (!_.isEqual(newValue, original.value)) {
								toUpdate.push(content);
								if (content.type === 'FILE') {
									filesToDelete.push(original.value);
								}
							}
						} else if (!original && newValue !== '' && newValue !== null) {
							toCreate.push(content);
						}
					});

					let promise = Promise.resolve();
					if (toCreate.length) {
						toCreate.forEach(content => {
							promise = promise.then(() => {
								return vm.$request.post('contents', content);
							});
						});
					}

					if (toUpdate.length) {
						promise = promise.then(() => {
							return vm.$request.patch('contents', {
								contents: toUpdate.map(content => {
									return _.pick(content, ['key', 'sortOrder', 'type', 'uuid', 'value']);
								}),
							});
						});
					}

					if (toDelete.length) {
						promise = promise.then(() => {
							return vm.$request.delete('contents', {
								contents: toDelete
							});
						});
					}

					if (filesToDelete.length) {
						promise = promise.then(() => {
							return vm.$request.delete('files', {
								files: filesToDelete
							});
						});
					}

					return promise;
				}).then(() => {
					return vm.getSettingsToUpdate();
				}).then(settings => {
					let promise = Promise.resolve();
					const toUpdate = _.reject(settings, {value: ''});
					const toDelete = _.filter(settings, {value: ''});

					if (toUpdate.length) {
						promise = promise.then(() => {
							return vm.$request.patch('settings', {
								settings: toUpdate
							});
						});
					}

					if (toDelete.length) {
						promise = promise.then(() => {
							return vm.$request.delete('settings', {
								settings: toDelete
							});
						});
					}

					return promise;
				}).then(() => {
					vm.clearModals();
					vm.$router.push({name: 'pages-list'});
				}).catch(err => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});

			},
			getContentsToUpdate() {
				const vm = this;
				let promise = Promise.resolve();
				const contents = {};

				Object.keys(vm.formData.contents).forEach(key => {
					if (vm.formData.contents[key].value instanceof File) {
						promise = promise.then(() => {
							return vm.uploadFile(vm.formData.contents[key]).then(uploadedFile => {
								vm.$store.commit('generateCacheKey');
								contents[key] = _.cloneDeep(vm.formData.contents[key]);
								contents[key].value = uploadedFile && uploadedFile.hasOwnProperty('uuid') ? uploadedFile.uuid : '';
							});
						});
					} else {
						promise = promise.then(() => {
							const contentValue = _.isPlainObject(vm.formData.contents[key].value) && vm.formData.contents[key].value.hasOwnProperty('uuid') ? vm.formData.contents[key].value.uuid : vm.formData.contents[key].value;
							contents[key] = _.cloneDeep(vm.formData.contents[key]);
							contents[key].value = contentValue;
						});
					}
				});

				promise = promise.then(() => {
					return contents;
				});

				return promise;
			},
			getSettingsToUpdate() {
				const vm = this;
				return new Promise((resolve, reject) => {
					const settings = [];
					Object.keys(vm.formData.settings).forEach(key => {
						let value = vm.formData.settings[key];
						if (vm.formData.contents.HOMEPAGE_MATCH_IS_ENABLED.value === false) {
							value = '';
						}
						settings.push({
							key: key,
							value: value
						});
					});

					resolve(settings);
				});
			},
			uploadFile(fileValue) {
				const vm = this;
				let file = null;
				let promise = Promise.resolve();
				if (fileValue.value) {
					promise = promise.then(() => {
						return vm.$request.post('files', {
							content_type: fileValue.value.type,
							filename: fileValue.value.name
						});
					}).then(response => {
						file = response.data.file;
						const signedUrl = response.data.upload_url;

						const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers));
						let instance = axios.create();
						instance.defaults.headers.common['Content-Type'] = fileValue.value.type || 'application/octet-stream';
						instance.defaults.headers.put['Content-Type'] = fileValue.value.type || 'application/octet-stream';
						axios.defaults.headers = defaultHeaders;
						return instance.put(signedUrl, fileValue.value);
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
			'forms-select-nonprofit': ComponentSelectNonprofit,
		}
	};
</script>