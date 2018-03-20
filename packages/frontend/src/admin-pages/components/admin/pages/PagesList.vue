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
                    <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                        <header class="c-page-section__header">
                            <div class="c-page-section-header-text">
                                <h2 class="c-page-section-title" id="section-select-menus">Manage the pages that appear on your event site</h2>
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

                        </div>
                    </section>
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
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('settings', {
					keys: Object.keys(vue.formData)
				}).then(function (response) {
					vue.settings = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.$request.get('settings', {
				keys: Object.keys(vue.formData)
			}).then(function (response) {
				vue.settings = response.data;
				next();
			}).catch(function () {
				next();
			});
		},
		watch: {
			settings: {
				handler: function () {
					const vue = this;
					if (vue.settings.length) {
						Object.keys(vue.formData).forEach(function (key) {
							const setting = _.find(vue.settings, {key: key});
							if (setting) {
								vue.formData[key] = setting.value;
							}
						});
					}
				},
				deep: true
			}
		},
		methods: {
			settingUpdateInProgress: function (key) {
				if (!this.isSettingUpdating(key)) {
					this.updating.push(key);
				}
			},
			settingUpdateFinished: function (key) {
				this.updating = this.updating.filter(function (k) {
					return k !== key;
				});
			},
			isSettingUpdating: function (key) {
				return this.updating.indexOf(key) > -1;
			},
			getPageUrl: function (relativeLink) {
				return this.formData.EVENT_URL + relativeLink;
			},
			updateSetting: function (key) {
				const vue = this;

				if (vue.isSettingUpdating(key)) {
					return;
				}

				vue.settingUpdateInProgress(key);

				vue.updating.push(key);
				if (_.find(vue.settings, {key: key})) {
					vue.$request.patch('settings/' + key, {
						value: vue.formData[key]
					}).then(function () {
						vue.settingUpdateFinished(key);
					}).catch(function (err) {
                        vue.apiError = err.response.data.errors;
						vue.settingUpdateFinished(key);
					});
				} else {
					vue.$request.post('settings', {
						key: key,
						value: vue.formData[key]
					}).then(function (response) {
						vue.settings.push(response.data);
						vue.settingUpdateFinished(key);
					}).catch(function (err) {
                        vue.apiError = err.response.data.errors;
						vue.settingUpdateFinished(key);
					});
				}
			},
		}
	};
</script>