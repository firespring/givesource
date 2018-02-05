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
                        <h1 class="o-page-header-title">Payment Gateway Settings</h1>
                    </div>
                </div>

                <div class="o-app-main-content">
                    <api-error v-model="apiError"></api-error>
                    <form v-on:submit="submit">

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">PaymentSpring Keys</h2>
                                    <div class="c-notes c-notes--below">
                                        If you don't know your PaymentSpring keys, <a href="https://manage.paymentspring.com/" target="_blank" rel="noreferrer noopener">log into your PaymentSpring account</a>
                                        to get them.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--radio" :class="{ 'c-form-item--has-error': formErrors.PAYMENT_SPRING_LIVE_MODE }">
                                    <div class="c-form-item__label">
                                        <div class="c-form-item-label-text" id="processRealCC">Are you ready to accept real credit cards?</div>
                                    </div>
                                    <div class="c-form-item__control">
                                        <ul class="c-input-list c-input-list--radio c-input-list--inline has-sub-options--show" aria-labelledby="processRealCC">
                                            <li class="has-sub-options has-sub-options--show">
                                                <input v-model="formData.PAYMENT_SPRING_LIVE_MODE" type="radio" name="processRealCC" id="processRealCC-1" :value="true">
                                                <label for="processRealCC-1">Yes</label>
                                            </li>
                                            <li class="has-sub-options">
                                                <input v-model="formData.PAYMENT_SPRING_LIVE_MODE" type="radio" name="processRealCC" id="processRealCC-0" :value="false">
                                                <label for="processRealCC-0">No</label>
                                            </li>
                                        </ul>

                                        <div v-if="formErrors.PAYMENT_SPRING_LIVE_MODE" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.PAYMENT_SPRING_LIVE_MODE }}
                                        </div>

                                        <div class="sub-options-inline-wrapper sub-options-inline-wrapper--show">

                                            <div class="sub-options-inline" :class="{'sub-options-inline--show': formData.PAYMENT_SPRING_LIVE_MODE}">
                                                <div class="c-alert c-alert--expand c-alert--info u-flex u-justify-center">
                                                    <div class="c-alert__body">
                                                        <div class="c-alert__text">
                                                            <p>
                                                                You must enter these API keys to process real credit cards. Otherwise, you can only process test credit cards.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="c-form-item c-form-item--text c-form-item--required"
                                                     :class="{ 'c-form-item--has-error': formErrors.PAYMENT_SPRING_API_KEY }">
                                                    <div class="c-form-item__label">
                                                        <label for="key" class="c-form-item-label-text">API Key</label>
                                                    </div>
                                                    <div class="c-form-item__control">
                                                        <input v-model="formData.PAYMENT_SPRING_API_KEY" type="text" name="key" id="key" maxlength="200"
                                                               :class="{ 'has-error': formErrors.PAYMENT_SPRING_API_KEY }">
                                                        <div v-if="formErrors.PAYMENT_SPRING_API_KEY" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                                            {{ formErrors.PAYMENT_SPRING_API_KEY }}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="c-form-item c-form-item--text c-form-item--required"
                                                     :class="{ 'c-form-item--has-error': formErrors.PAYMENT_SPRING_PUBLIC_API_KEY }">
                                                    <div class="c-form-item__label">
                                                        <label for="keyPublic" class="c-form-item-label-text">Public API Key</label>
                                                    </div>
                                                    <div class="c-form-item__control">
                                                        <input v-model="formData.PAYMENT_SPRING_PUBLIC_API_KEY" type="text" name="keyPublic" id="keyPublic" maxlength="200"
                                                               :class="{ 'has-error': formErrors.PAYMENT_SPRING_PUBLIC_API_KEY }">
                                                        <div v-if="formErrors.PAYMENT_SPRING_PUBLIC_API_KEY" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                                            {{ formErrors.PAYMENT_SPRING_PUBLIC_API_KEY }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="sub-options-inline" :class="{'sub-options-inline--show': !formData.PAYMENT_SPRING_LIVE_MODE}">
                                                <div class="c-alert c-alert--expand c-alert--info u-flex u-justify-center">
                                                    <div class="c-alert__body">
                                                        <div class="c-alert__text">
                                                            <p>
                                                                These API keys are for testing purposes only. They will not accept real credit cards.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="c-form-item c-form-item--text c-form-item--required"
                                                     :class="{ 'c-form-item--has-error': formErrors.PAYMENT_SPRING_TEST_API_KEY }">
                                                    <div class="c-form-item__label">
                                                        <label for="testKey" class="c-form-item-label-text">Test API Key</label>
                                                    </div>
                                                    <div class="c-form-item__control">
                                                        <input v-model="formData.PAYMENT_SPRING_TEST_API_KEY" type="text" name="testKey" id="testKey" maxlength="200"
                                                               :class="{ 'has-error': formErrors.PAYMENT_SPRING_TEST_API_KEY }">
                                                        <div v-if="formErrors.PAYMENT_SPRING_TEST_API_KEY" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                                            {{ formErrors.PAYMENT_SPRING_TEST_API_KEY }}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="c-form-item c-form-item--text c-form-item--required"
                                                     :class="{ 'c-form-item--has-error': formErrors.PAYMENT_SPRING_TEST_PUBLIC_API_KEY }">
                                                    <div class="c-form-item__label">
                                                        <label for="testKeyPublic" class="c-form-item-label-text">Test Public API Key</label>
                                                    </div>
                                                    <div class="c-form-item__control">
                                                        <input v-model="formData.PAYMENT_SPRING_TEST_PUBLIC_API_KEY" type="text" name="testKeyPublic" id="testKeyPublic"
                                                               maxlength="200" :class="{ 'has-error': formErrors.PAYMENT_SPRING_TEST_PUBLIC_API_KEY }">
                                                        <div v-if="formErrors.PAYMENT_SPRING_TEST_PUBLIC_API_KEY" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                                            {{ formErrors.PAYMENT_SPRING_TEST_PUBLIC_API_KEY }}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
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
	import * as Utils from './../../../../helpers/utils';

	module.exports = {
		data: function () {
			return {
				settings: [],

				// Form Data
				formData: {
					PAYMENT_SPRING_API_KEY: '',
					PAYMENT_SPRING_PUBLIC_API_KEY: '',
					PAYMENT_SPRING_TEST_API_KEY: '',
					PAYMENT_SPRING_TEST_PUBLIC_API_KEY: '',
					PAYMENT_SPRING_LIVE_MODE: false,
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
								vue.formData[key] = setting.value;
							}
						});
					}
				},
				deep: true
			}
		},
		methods: {
			getConstraints: function () {
				const vue = this;

				return {
					PAYMENT_SPRING_API_KEY: {
						label: 'API key',
						presence: vue.formData.PAYMENT_SPRING_LIVE_MODE,
					},
					PAYMENT_SPRING_PUBLIC_API_KEY: {
						label: 'Public API key',
						presence: vue.formData.PAYMENT_SPRING_LIVE_MODE,
					},
					PAYMENT_SPRING_TEST_API_KEY: {
						label: 'Test API key',
						presence: !vue.formData.PAYMENT_SPRING_LIVE_MODE,
					},
					PAYMENT_SPRING_TEST_PUBLIC_API_KEY: {
						label: 'Test public API key',
						presence: !vue.formData.PAYMENT_SPRING_LIVE_MODE,
					},
					PAYMENT_SPRING_LIVE_MODE: {
						label: 'This field',
						presence: true,
					},
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

				const settings = [];
				Object.keys(vue.formData).forEach(function (key) {
					settings.push({
						key: key,
						value: vue.formData[key]
					})
				});

				const toUpdate = _.reject(settings, {value: ''});
				const toDelete = _.filter(settings, {value: ''});

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
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						vue.$router.push({name: 'settings-list'});
					}
				}).catch(function (err) {
					vue.clearModals();
                    vue.apiError = err.response.data.errors;
				});
			}
		}
	};
</script>