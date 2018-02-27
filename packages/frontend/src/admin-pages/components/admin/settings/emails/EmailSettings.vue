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
                        <h1 class="o-page-header-title">Emails</h1>
                    </div>
                </div>

                <div class="o-app-main-content">

                    <!-- BEGIN form -->
                    <form v-on:submit="submit">

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Donation Receipt</h2>
                                    <div class="c-notes c-notes--below">
                                        The donation receipt email is sent to donors.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--textarea">
                                    <div class="c-form-item__label">
                                        <label for="donationReceiptTextBefore" class="c-form-item-label-text">Text Before Donations List</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.EMAILS_DONATION_RECEIPT_BEFORE_LIST" :loaded="loaded" id="donationReceiptTextBefore"></forms-ckeditor>
                                        <div class="c-notes c-notes--below">
                                            This text will appear above the list of donations that the receipt is for.
                                        </div>
                                        <div v-if="formErrors.EMAILS_DONATION_RECEIPT_BEFORE_LIST" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EMAILS_DONATION_RECEIPT_BEFORE_LIST }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--textarea">
                                    <div class="c-form-item__label">
                                        <label for="donationReceiptTextAfter" class="c-form-item-label-text">Text After Donations List</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.EMAILS_DONATION_RECEIPT_AFTER_LIST" :loaded="loaded" id="donationReceiptTextAfter"></forms-ckeditor>
                                        <div class="c-notes c-notes--below">
                                            This text will appear below the list of donations that the receipt is for.
                                        </div>
                                        <div v-if="formErrors.EMAILS_DONATION_RECEIPT_AFTER_LIST" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EMAILS_DONATION_RECEIPT_AFTER_LIST }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">User Registration - Pending</h2>
                                    <div class="c-notes c-notes--below">
                                        The user registration pending email is sent to nonprofits when they register for an account.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--textarea">
                                    <div class="c-form-item__label">
                                        <label for="userRegistrationPending" class="c-form-item-label-text">Additional Message</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.EMAILS_USER_REGISTRATION_PENDING" :loaded="loaded" id="userRegistrationPending"></forms-ckeditor>
                                        <div class="c-notes c-notes--below">
                                            This text will appear after a brief thank-you message.
                                        </div>
                                        <div v-if="formErrors.EMAILS_USER_REGISTRATION_PENDING" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EMAILS_USER_REGISTRATION_PENDING }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">User Registration - Activated</h2>
                                    <div class="c-notes c-notes--below">
                                        The user registration activated email is sent to nonprofits when they have been approved.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--textarea">
                                    <div class="c-form-item__label">
                                        <label for="userRegistrationActivated" class="c-form-item-label-text">Additional Message</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.EMAILS_USER_REGISTRATION_ACTIVATED" :loaded="loaded" id="userRegistrationActivated"></forms-ckeditor>
                                        <div class="c-notes c-notes--below">
                                            This text will appear after the button to verify the user's account.
                                        </div>
                                        <div v-if="formErrors.EMAILS_USER_REGISTRATION_ACTIVATED" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EMAILS_USER_REGISTRATION_ACTIVATED }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Save Changes</button>
                            <a href="index.php" class="c-btn c-btn--neutral c-btn--text">Cancel</a>
                        </footer>
                    </form>

                </div>
            </div>
        </main>
    </div>
</template>

<script>
	import Request from './../../../../helpers/request';

	module.exports = {
		data: function () {
			return {
				settings: [],
                loaded: false,

				// Form Data
				formData: {
					EMAILS_DONATION_RECEIPT_AFTER_LIST: '',
					EMAILS_DONATION_RECEIPT_BEFORE_LIST: '',
					EMAILS_USER_REGISTRATION_ACTIVATED: '',
					EMAILS_USER_REGISTRATION_PENDING: '',
				},

				// Errors
				formErrors: {}
			};
		},
		beforeRouteEnter: function (to, from, next) {
			const fetchData = function () {
				const request = new Request();
				let settings = null;
				let promise = Promise.resolve();

				promise = promise.then(function () {
					return request.get('settings', {
						keys: [
							'EMAILS_DONATION_RECEIPT_AFTER_LIST',
							'EMAILS_DONATION_RECEIPT_BEFORE_LIST',
							'EMAILS_USER_REGISTRATION_ACTIVATED',
                            'EMAILS_USER_REGISTRATION_PENDING',
                        ]
					}).then(function (response) {
						settings = response.data;
					});
				});

				promise = promise.then(function () {
					return {
						settings: settings
					};
				});

				return promise;
			};

			fetchData().then(function (data) {
				next(function (vue) {
					vue.settings = data.settings;
					vue.loaded = true;
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
				return {
					EMAILS_DONATION_RECEIPT_AFTER_LIST: {
						label: 'Text after donation list',
						presence: false
					},
					EMAILS_DONATION_RECEIPT_BEFORE_LIST: {
						label: 'Text before donation list',
						presence: false
					},
					EMAILS_USER_REGISTRATION_ACTIVATED: {
						label: 'Registration activated additional text',
						presence: false
					},
					EMAILS_USER_REGISTRATION_PENDING: {
						label: 'Registration pending additional text',
						presence: false
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
					vue.scrollToError();
				} else {
					vue.updateSettings();
				}
			},
			updateSettings: function () {
				const vue = this;

				vue.getSettingsToUpdate().then(function (settings) {
					let promise = Promise.resolve();
					const toUpdate = _.reject(settings, {value: ''});
					const toDelete = _.filter(settings, {value: ''});

					if (toUpdate.length) {
						promise = promise.then(function () {
							return vue.$request.patch('settings', {
								settings: toUpdate
							});
						});
					}

					if (toDelete.length) {
						promise = promise.then(function () {
							return vue.$request.delete('settings', {
								settings: toDelete
							});
						})
					}

					return promise;

				}).then(function () {
					vue.clearModals();
					vue.$router.push({name: 'settings-list'});
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});

			},
			getSettingsToUpdate: function () {
				const vue = this;
				return new Promise(function (resolve, reject) {
					const settings = [];
					Object.keys(vue.formData).forEach(function (key) {
						settings.push({
							key: key,
							value: vue.formData[key]
						});
					});
					resolve(settings);
				});
			}
		},
        components: {
	        'forms-ckeditor': require('./../../../forms/Ckeditor.vue')
        }
	};
</script>