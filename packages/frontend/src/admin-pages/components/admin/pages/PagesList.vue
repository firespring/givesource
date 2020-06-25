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
                    <paymentspring-keys-banner/>
                    <api-error v-model="apiError"></api-error>

                    <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                        <header class="c-page-section__header">
                            <div class="c-page-section-header-text">
                                <h2 class="c-page-section-title" id="section-select-menus">Manage the pages that appear on your event site</h2>
                            </div>

                            <div class="c-page-section-header-actions" v-if="canAddPages">
                                <router-link :to="{ name: 'pages-custom-add' }" role="button" class="c-btn c-btn--xs c-btn--flat c-btn--text c-btn--icon">
                                    <i class="fa fa-plus" aria-hidden="true"></i>Add Page
                                </router-link>
                            </div>
                        </header>

                        <div class="c-page-section__main">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-homepage'}">Home</router-link>
                                        </strong> — <a :href="getPageUrl('')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        Manage the content displayed on your event's homepage. This page is required and can't be disabled.
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-checkout'}">Donation Checkout</router-link>
                                        </strong> — <a :href="getPageUrl('/cart')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/cart') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        Manage the content that's displayed on your donation checkout page. This page is required and can't be disabled.
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-contact-us'}">Contact Us</router-link>
                                        </strong> — <a :href="getPageUrl('/contact')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/contact') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        This page provides site visitors with a contact form so they can easily contact you. This page is required and can't be disabled.
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-register'}">Register</router-link>
                                        </strong> — <a :href="getPageUrl('/register')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/register') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        This page provides nonprofit visitors with a registration form. This page is required and can't be disabled.
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-about'}">About</router-link>
                                        </strong> — <a :href="getPageUrl('/about')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/about') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        Use this page to describe what your event is about, how it got started, and other important info.
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                    <div class="c-form-item__control">
                                        <div class="c-switch-control">
                                            <div>
                                                <input v-model="formData.PAGE_ABOUT_ENABLED" v-on:change="updateSetting('PAGE_ABOUT_ENABLED')" type="checkbox"
                                                       name="pageAbout" id="pageAbout" :disabled="isSettingUpdating('PAGE_ABOUT_ENABLED')">
                                                <label for="pageAbout" class="c-switch-lever"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-toolkits'}">Toolkits</router-link>
                                        </strong> — <a :href="getPageUrl('/toolkits')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/toolkits') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        Use this page to provide participating nonprofits with useful tools, images, and information to make their campaign more successful.
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                    <div class="c-form-item__control">
                                        <div class="c-switch-control">
                                            <div>
                                                <input v-model="formData.PAGE_TOOLKIT_ENABLED" v-on:change="updateSetting('PAGE_TOOLKIT_ENABLED')" type="checkbox"
                                                       name="pageToolkit" id="pageToolkit" :disabled="isSettingUpdating('PAGE_TOOLKIT_ENABLED')">
                                                <label for="pageToolkit" class="c-switch-lever"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-faq'}">FAQ</router-link>
                                        </strong> — <a :href="getPageUrl('/faq')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/faq') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        Use this page to answer all of your potential donors' questions.
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                    <div class="c-form-item__control">
                                        <div class="c-switch-control">
                                            <div>
                                                <input v-model="formData.PAGE_FAQ_ENABLED" v-on:change="updateSetting('PAGE_FAQ_ENABLED')" type="checkbox" name="pageFaq"
                                                       id="pageFaq" :disabled="isSettingUpdating('PAGE_FAQ_ENABLED')">
                                                <label for="pageFaq" class="c-switch-lever"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-terms'}">Terms</router-link>
                                        </strong> — <a :href="getPageUrl('/terms')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/terms') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        Use this page to provide information about the terms of your fundraising, such as privacy and refund policies.
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                    <div class="c-form-item__control">
                                        <div class="c-switch-control">
                                            <div>
                                                <input v-model="formData.PAGE_TERMS_ENABLED" v-on:change="updateSetting('PAGE_TERMS_ENABLED')" type="checkbox" name="pageTerms"
                                                       id="pageTerms" :disabled="isSettingUpdating('PAGE_TERMS_ENABLED')">
                                                <label for="pageTerms" class="c-switch-lever"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <template v-for="content in custom">
                                <hr class="expand">

                                <div class="c-form-item-grid">
                                    <div class="c-form-item c-form-item--text">
                                        <div>
                                            <strong>
                                                <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                                <router-link :to="{name: 'pages-custom-edit', params: { pageUuid: content.uuid } }">{{ content.title }}</router-link>
                                            </strong> — <a :href="getPageUrl('/' + content.slug)" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/' + content.slug) }}</a>
                                        </div>
                                    </div>

                                    <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                        <div class="c-form-item__control">
                                            <div class="c-switch-control">
                                                <div>
                                                    <input v-model="content.enabled" v-on:change="updateCustomSettingEnabled(content)" type="checkbox"
                                                           :name="content.uuid" :id="content.uuid" :disabled="content.updating">
                                                    <label :for="content.uuid" class="c-switch-lever"></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>

                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
	import {getContentKeys, getSettingKeys} from './../../../helpers/content';
	import Request from './../../../helpers/request';

	/**
	 * Pre-loaded data
	 *
	 * @returns {Promise}
	 */
	const fetchData = () => {
		const request = new Request();
		let settings = [];

		return request.get('settings', {
			keys: [
				'CUSTOM_PAGES',
				'EVENT_URL',
				'PAGE_ABOUT_ENABLED',
				'PAGE_FAQ_ENABLED',
				'PAGE_TERMS_ENABLED',
				'PAGE_TOOLKIT_ENABLED',
			]
		}).then((response) => {
			settings = response.hasOwnProperty('data') ? response.data : [];

			const keys = getSettingKeys(settings);
			if (keys.length) {
				return request.get('settings', {
					keys: keys
				});
			} else {
				return Promise.resolve({});
			}
		}).then((response) => {
			if (response.hasOwnProperty('data')) {
				response.data.forEach((setting) => {
					settings.push(setting);
				});
			}

			const keys = getContentKeys(settings);
			if (keys.length) {
				return request.get('contents', {
					keys: keys
				});
			} else {
				return Promise.resolve({});
			}
		}).then((response) => {
			let contents = response.hasOwnProperty('data') ? response.data : [];
			return {
				contents: contents,
				settings: settings
			}
		}).catch((e) => {
			console.log(e);
		});
	};

	export default {
		data() {
			return {
				canAddPages: false,
				contents: [],
				custom: [],
				settings: [],
				updating: [],

				// Form Data
				formData: {
					PAGE_ABOUT_ENABLED: false,
					PAGE_FAQ_ENABLED: false,
					PAGE_TERMS_ENABLED: false,
					PAGE_TOOLKIT_ENABLED: false,
					EVENT_URL: '',
				},

				// Errors
				formErrors: {},
				apiError: {},
			};
		},
		beforeRouteEnter(to, from, next) {
			fetchData().then((data) => {
				next((vm) => {
					vm.contents = data.contents;
					vm.settings = data.settings;

					const setting = _.find(vm.settings, {key: 'CUSTOM_PAGES'});
					const uuids = (typeof setting === 'object' && setting.hasOwnProperty('value')) ? setting.value.split('|') : [];

					if (uuids.length < 3) {
						vm.canAddPages = true;
					}

					uuids.forEach((uuid) => {
						const content = {
							enabled: false,
							identifier: uuid.toUpperCase().replace(/-/g, '_'),
							slug: null,
							text: null,
							title: null,
							updating: false,
							uuid: uuid,
						};
						vm.contents.forEach((c) => {
							if (c.key.includes(content.identifier)) {
								Object.keys(content).forEach((key) => {
									if (c.key.includes(key.toUpperCase())) {
										content[key] = c.value;
									}
								});
							}
						});
						const setting = _.find(vm.settings, {key: 'CUSTOM_PAGE_ENABLED_' + content.identifier});
						if (typeof setting === 'object' && setting.hasOwnProperty('value')) {
							content.enabled = setting.value;
						}
						vm.custom.push(content);
					});
				});
			});
		},
		watch: {
			settings: {
				handler() {
					const vm = this;
					if (vm.settings.length) {
						Object.keys(vm.formData).forEach((key) => {
							const setting = _.find(vm.settings, {key: key});
							if (setting) {
								vm.formData[key] = setting.value;
							}
						});
					}
				},
				deep: true
			}
		},
		methods: {
			settingUpdateInProgress(key) {
				if (!this.isSettingUpdating(key)) {
					this.updating.push(key);
				}
			},
			settingUpdateFinished(key) {
				this.updating = this.updating.filter((k) => {
					return k !== key;
				});
			},
			isSettingUpdating(key) {
				return this.updating.indexOf(key) > -1;
			},
			getPageUrl(relativeLink) {
				return this.formData.EVENT_URL + relativeLink;
			},
			updateSetting(key) {
				const vm = this;

				if (vm.isSettingUpdating(key)) {
					return;
				}

				vm.settingUpdateInProgress(key);

				vm.updating.push(key);
				if (_.find(vm.settings, {key: key})) {
					vm.$request.patch('settings/' + key, {
						value: vm.formData[key]
					}).then(() => {
						vm.settingUpdateFinished(key);
					}).catch((err) => {
						vm.apiError = err.response.data.errors;
						vm.settingUpdateFinished(key);
					});
				} else {
					vm.$request.post('settings', {
						key: key,
						value: vm.formData[key]
					}).then((response) => {
						vm.settings.push(response.data);
						vm.settingUpdateFinished(key);
					}).catch((err) => {
						vm.apiError = err.response.data.errors;
						vm.settingUpdateFinished(key);
					});
				}
			},
			updateCustomSettingEnabled(content) {
				const vm = this;

				if (content.updating) {
					return;
				}

				content.updating = true;

				const key = 'CUSTOM_PAGE_ENABLED_' + content.identifier;
				const setting = _.find(vm.settings, {key: key});
				if (setting) {
					vm.$request.patch('settings/' + key, {
						value: content.enabled
					}).then(() => {
						content.updating = false;
					}).catch((err) => {
						vm.apiError = err.response.data.errors;
						content.updating = false;
					});
				} else {
					vm.$request.post('settings', {
						key: key,
						value: content.enabled
					}).then((response) => {
						vm.settings.push(response.data);
						content.updating = false;
					}).catch((err) => {
						vm.apiError = err.response.data.errors;
						content.updating = false;
					});
				}

			}
		}
	};
</script>