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
                <div class="o-app-main-content">

                    <div class="o-page-header">
                        <div class="o-page-header__text">
                            <nav class="o-page-header-nav c-breadcrumb">
                                <span><router-link :to="{name: 'pages-list'}">Pages</router-link></span>
                            </nav>
                            <h1 class="o-page-header-title">Home</h1>
                        </div>
                    </div>

                    <form v-on:submit="submit">

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
                                        <input v-model="formData.HOMEPAGE_TITLE.value" type="text" name="homepageTitle" id="homepageTitle">
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--file c-form-item--file-picker">
                                    <div class="c-form-item__label">
                                        <label for="homepageSpotlight" class="c-form-item-label-text">Homepage Spotlight Image</label>
                                    </div>
                                    <forms-image-upload v-model="formData.HOMEPAGE_SPOTLIGHT.value" name="homepageSpotlight" id="homepageSpotlight"></forms-image-upload>
                                    <div class="c-notes c-notes--below u-width-100p">
                                        This image will appear in your homepage's masthead. If you've uploaded a masthead background, this spotlight image will appear on top of it.
                                    </div>
                                    <div v-if="formErrors['HOMEPAGE_SPOTLIGHT.value']" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors['HOMEPAGE_SPOTLIGHT.value'] }}
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
                                        <forms-ckeditor v-model="formData.HOMEPAGE_MASTHEAD_TEXT.value" :loaded="loaded" :basic="true" id="headerText"></forms-ckeditor>
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
                                        <forms-ckeditor v-model="formData.HOMEPAGE_MAIN_TEXT.value" :loaded="loaded" :basic="true" id="mainText"></forms-ckeditor>
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
                                        <input v-model="formData.HOMEPAGE_REGISTER_BUTTON.value" type="text" name="nonprofitRegistrationButtonLabel"
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
                                        <forms-ckeditor v-model="formData.HOMEPAGE_REGISTER_DETAILS.value" :loaded="loaded" :basic="true"
                                                        id="nonprofitDetailsText"></forms-ckeditor>
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
                                                <input v-model="formData.HOMEPAGE_MATCH_IS_ENABLED.value" type="checkbox" name="enableMatchFunds"
                                                       id="enableMatchFunds-1">
                                                <label for="enableMatchFunds-1">Enable Match Funds for all Participating Nonprofits</label>

                                                <div class="sub-options">

                                                    <div class="c-form-item c-form-item--text">
                                                        <div class="c-form-item__label">
                                                            <label for="matchFundButtonLabel" class="c-form-item-label-text">Match Fund Button Label</label>
                                                            <div class="c-notes">
                                                                Defaults to "Love Them All" if left blank.
                                                            </div>
                                                        </div>
                                                        <div class="c-form-item__control">
                                                            <input v-model="formData.HOMEPAGE_MATCH_BUTTON.value" type="text" name="matchFundButtonLabel" id="matchFundButtonLabel">
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
                                                            <input v-model="formData.HOMEPAGE_MATCH_DETAILS.value" type="text" name="matchFundDetails" id="matchFundDetails">
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
                                        <forms-ckeditor v-model="formData.HOMEPAGE_POST_EVENT_TEXT.value" :loaded="loaded" :basic="true" id="postEventDetailsText"></forms-ckeditor>
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
	module.exports = {
		data: function () {
			return {
				contents: [],
				original: [],
				loaded: false,

				// Form Data
				formData: {
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

				// Errors
				formErrors: {},
			};
		},
		computed: {
			showMatchFundOptions: function () {
				return this.formData.HOMEPAGE_MATCH_IS_ENABLED.value;
			},
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('contents', {
					keys: Object.keys(vue.formData)
				}).then(function (response) {
					vue.contents = response.data;
					vue.original = JSON.parse(JSON.stringify(response.data));
					vue.loaded = true;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.loaded = false;
			vue.$request.get('contents', {
				keys: Object.keys(vue.formData)
			}).then(function (response) {
				vue.contents = response.data;
				vue.original = JSON.parse(JSON.stringify(response.data));
				vue.loaded = true;
				next();
			}).catch(function () {
				next();
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
			contents: {
				handler: function () {
					const vue = this;
					if (vue.contents.length) {
						Object.keys(vue.formData).forEach(function (key) {
							const content = _.clone(_.find(vue.contents, {key: key}));
							if (content) {
								if (content.type === 'FILE') {
									vue.$request.get('files/' + content.value).then(function (response) {
										vue.formData[key] = content;
										vue.formData[key].value = response.data;
									}).catch(function () {
										content.value = null;
										vue.formData[key] = content;
										vue.formData[key].value = null;
									});
								} else {
									vue.formData[key] = content;
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
					'HOMEPAGE_SPOTLIGHT.value': {
						label: 'Homepage Spotlight Image',
						presence: false,
						image: true
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
					vue.scrollToError();
				} else {
					vue.updateContents();
				}
			},
			updateContents: function () {
				const vue = this;

				vue.getContentsToUpdate().then(function (contents) {

					const toCreate = [];
					const toUpdate = [];
					const toDelete = [];
					const filesToDelete = [];
					_.forEach(contents, function (content, key) {
						const original = _.find(vue.original, {key: key});
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
						toCreate.forEach(function (content) {
							promise = promise.then(function () {
								return vue.$request.post('contents', content);
							});
						});
					}

					if (toUpdate.length) {
						promise = promise.then(function () {
							return vue.$request.patch('contents', {
								contents: toUpdate.map(function (content) {
									return _.pick(content, ['key', 'sortOrder', 'type', 'uuid', 'value']);
								}),
							});
						});
					}

					if (toDelete.length) {
						promise = promise.then(function () {
							return vue.$request.delete('contents', {
								contents: toDelete
							});
						});
					}

					if (filesToDelete.length) {
						promise = promise.then(function () {
							return vue.$request.delete('files', {
								files: filesToDelete
							});
						});
					}

					promise.then(function () {
						vue.clearModals();
						vue.$router.push({name: 'pages-list'});
					}).catch(function (err) {
						vue.clearModals();
						console.log(err);
					});

				});

			},
			getContentsToUpdate: function () {
				const vue = this;
				let promise = Promise.resolve();
				const contents = {};
				Object.keys(vue.formData).forEach(function (key) {
					if (vue.formData[key].value instanceof File) {
						promise = promise.then(function () {
							return vue.uploadFile(key).then(function (uploadedFile) {
								contents[key] = _.cloneDeep(vue.formData[key]);
								contents[key].value = uploadedFile && uploadedFile.hasOwnProperty('uuid') ? uploadedFile.uuid : '';
							});
						});
					} else {
						promise = promise.then(function () {
							const contentValue = _.isPlainObject(vue.formData[key].value) && vue.formData[key].value.hasOwnProperty('uuid') ? vue.formData[key].value.uuid : vue.formData[key].value;
							contents[key] = _.cloneDeep(vue.formData[key]);
							contents[key].value = contentValue;
						});
					}
				});

				promise = promise.then(function () {
					return contents;
				});

				return promise;
			},
			uploadFile: function (key) {
				const vue = this;
				let file = null;
				let promise = Promise.resolve();
				if (vue.formData[key].value) {
					promise = promise.then(function () {
						return vue.$request.post('files', {
							content_type: vue.formData[key].value.type,
							filename: vue.formData[key].value.name
						});
					}).then(function (response) {
						file = response.data.file;
						const signedUrl = response.data.upload_url;

						const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers));
						let instance = axios.create();
						instance.defaults.headers.common['Content-Type'] = vue.formData[key].value.type || 'application/octet-stream';
						instance.defaults.headers.put['Content-Type'] = vue.formData[key].value.type || 'application/octet-stream';
						axios.defaults.headers = defaultHeaders;
						return instance.put(signedUrl, vue.formData[key].value);
					}).then(function () {
						return file;
					});
				}
				return promise;
			},
		},
		components: {
			'forms-ckeditor': require('./../../forms/Ckeditor.vue'),
			'forms-image-upload': require('./../../forms/ImageUpload.vue')
		}
	};
</script>