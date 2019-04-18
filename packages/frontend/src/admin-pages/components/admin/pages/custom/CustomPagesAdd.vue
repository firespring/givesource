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
                <div class="o-app-main-content">
                    <api-error v-model="apiError"></api-error>

                    <div class="o-page-header">
                        <div class="o-page-header__text">
                            <nav class="o-page-header-nav c-breadcrumb">
                                <span><router-link :to="{name: 'pages-list'}">Pages</router-link></span>
                            </nav>
                            <h1 class="o-page-header-title">Add Page</h1>
                        </div>
                    </div>

                    <form v-on:submit.prevent="submit">

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Page Info</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--text c-form-item--required" :class="{ 'c-form-item--has-error': formErrors['PAGE_TITLE.value'] }">
                                    <div class="c-form-item__label">
                                        <label for="pageTitle" class="c-form-item-label-text">Page Title</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input v-model="formData.PAGE_TITLE.value" type="text" name="pageTitle" id="pageTitle"
                                               :class="{ 'has-error': formErrors['PAGE_TITLE.value'] }" v-auto-focus>
                                        <div v-if="formErrors['PAGE_TITLE.value']" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors['PAGE_TITLE.value'] }}
                                        </div>

                                        <div class="c-notes c-notes--below u-flex u-items-center" v-if="isEditingSlug">
                                            <div class="u-margin-right-xs">
                                                <strong>Page URL:</strong> {{ pageLink }}
                                            </div>
                                            <div class="u-margin-right-xs">
                                                <input v-model="formData.PAGE_SLUG.value" type="text" name="slug" id="slug" class="xs" v-on:change="slugMask">
                                            </div>
                                            <div>
                                                <a v-on:click.prevent="cancelEditSlug" href="#" role="button" class="c-btn c-btn--xs c-btn--text">Cancel</a>
                                            </div>
                                        </div>
                                        <div class="c-notes c-notes--below u-flex u-items-center" v-else>
                                            <div class="u-margin-right-xs">
                                                <strong>Page URL:</strong> {{ pageLink }}{{ formData.PAGE_SLUG.value }}
                                            </div>
                                            <div>
                                                <a v-on:click.prevent="editSlug" href="#" role="button" class="c-btn c-btn--xs c-btn--flat">Edit</a>
                                            </div>
                                        </div>

                                        <div v-if="formErrors['PAGE_SLUG.value']" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors['PAGE_SLUG.value'] }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Page Text</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--rich-text">
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.PAGE_TEXT.value" :loaded="loaded" id="pageText" type="advanced"></forms-ckeditor>
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
	import ComponentCKEditor from './../../../forms/Ckeditor.vue';
	import Request from './../../../../helpers/request';

	const slug = require('slug');
	const uuid = require('node-uuid');

	/**
	 * Pre-loaded data
	 *
	 * @returns {Promise}
	 */
	const fetchData = () => {
		const request = new Request();

		return request.get('settings', {
			keys: ['CUSTOM_PAGES']
		}).then((response) => {
			return {
				settings: response.data
			};
		});
	};

	export default {
		data() {
			return {
				isEditingSlug: false,
				loaded: false,
				settings: [],

				formData: {
					PAGE_TITLE: {
						key: 'CUSTOM_PAGE_TITLE',
						type: 'TEXT',
						value: ''
					},
					PAGE_SLUG: {
						key: 'CUSTOM_PAGE_SLUG',
						type: 'TEXT',
						value: ''
					},
					PAGE_TEXT: {
						key: 'CUSTOM_PAGE_TEXT',
						type: 'RICH_TEXT',
						value: ''
					}
				},

				// errors
				formErrors: {},
				apiError: {}
			};
		},
		computed: {
			pageLink() {
				return this.$store.getters.setting('EVENT_URL') + '/';
			}
		},
		beforeRouteEnter(to, from, next) {
			fetchData().then((data) => {
				next((vm) => {
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
					if (!vm.isEditingSlug) {
						vm.formData.PAGE_SLUG.value = slug(vm.formData.PAGE_TITLE.value, {lower: true});
					}
				},
				deep: true
			}
		},
		methods: {
			getConstraints() {
				return {
					'PAGE_TITLE.value': {
						label: 'Page Title',
						presence: true,
					},
					'PAGE_SLUG.value': {
						label: 'Page URL',
						presence: true,
						exclusion: [
							'about',
							'cart',
							'contact',
							'faq',
							'index',
							'leaderboard',
							'nonprofits',
							'register',
							'search',
							'terms',
							'toolkits',
						]
					},
				};
			},
			submit() {
				const vm = this;

				vm.addModal('spinner');

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (vm.settings.length && vm.settings[0].value.split('|').length >= 3) {
					vm.clearModals();
					vm.apiError = {
						message: 'Custom page limit exceeded. Cannot add new page.'
					}
				} else if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
					vm.scrollToError();
				} else {
					vm.addPage();
				}
			},
			addPage() {
				const vm = this;

				const created = [];
				const identifier = uuid.v4();

				Object.keys(vm.formData).forEach((key) => {
					const content = vm.formData[key];
					content.key = content.key + '_' + identifier.toUpperCase().replace(/-/g, '_');
					created.push(content);
				});

				let promise = Promise.resolve();
				created.forEach((content) => {
					promise = promise.then(() => {
						return vm.$request.post('contents', content);
					});
				});

				if (created.length) {
					promise = promise.then(() => {
						let setting = {};
						if (vm.settings.length) {
							setting = vm.settings[0];
						}
						setting.key = setting.key || 'CUSTOM_PAGES';
						setting.value = setting.value ? setting.value + '|' + identifier : identifier;

						return vm.$request.patch('settings', {
							settings: [setting]
						});
					});
				}

				promise.then(() => {
					vm.clearModals();
					vm.$router.push({name: 'pages-list'});
				}).catch((err) => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});
			},
			editSlug() {
				this.isEditingSlug = true;
			},
			cancelEditSlug() {
				this.formData.PAGE_SLUG.value = '';
				this.isEditingSlug = false;
			},
			slugMask(event) {
				this.formData.PAGE_SLUG.value = slug(event.target.value, {lower: true});
			},
			hasError(err) {
				this.apiError = err.response.data.errors;
			},
		},
		components: {
			'forms-ckeditor': ComponentCKEditor,
		}
	};
</script>