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
                        <h1 class="o-page-header-title">Event Settings</h1>
                    </div>
                </div>

                <div class="o-app-main-content">
                    <api-error v-model="apiError"></api-error>

                    <form v-on:submit="submit">
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Giving Day Event Info</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--text c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.EVENT_TITLE }">
                                    <div class="c-form-item__label">
                                        <label for="eventTitle" class="c-form-item-label-text">Event Title</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input v-model="formData.EVENT_TITLE" type="text" name="eventTitle" id="eventTitle" maxlength="200"
                                               :class="{ 'has-error': formErrors.EVENT_TITLE }" v-auto-focus>
                                        <div v-if="formErrors.EVENT_TITLE" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EVENT_TITLE }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--date c-form-item--date-range c-form-item--required"
                                     :class="{ 'c-form-item--has-error': formErrors.DATE_EVENT_START || formErrors.DATE_EVENT_END }">
                                    <div class="c-form-item__label">
                                        <label for="dateEventStart" class="c-form-item-label-text">Event Date</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="c-form-control-grid u-items-center">
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.DATE_EVENT_START" name="dateEventStart" id="dateEventStart" placeholder="Start"
                                                                :maxDate="dateEventMaxDate" :hasError="formErrors.hasOwnProperty('DATE_EVENT_START')"></forms-datetime>
                                            </div>
                                            <div class="c-form-control-grid__separator">
                                                to
                                            </div>
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.DATE_EVENT_END" name="dateEventEnd" id="dateEventEnd" placeholder="End"
                                                                :minDate="dateEventMinDate" :hasError="formErrors.hasOwnProperty('DATE_EVENT_END')"></forms-datetime>
                                            </div>
                                        </div>

                                        <div v-if="formErrors.DATE_EVENT_START || formErrors.DATE_EVENT_END" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            Please enter a valid event date range.
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--combobox c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.EVENT_TIMEZONE }">
                                    <div class="c-form-item__label">
                                        <label for="eventTimezone" class="c-form-item-label-text">Time Zone</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-select-time-zone v-model="formData.EVENT_TIMEZONE" id="eventTimezone" name="eventTimezone"
                                                                :hasError="formErrors.hasOwnProperty('EVENT_TIMEZONE')"></forms-select-time-zone>
                                        <div v-if="formErrors.EVENT_TIMEZONE" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EVENT_TIMEZONE }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Giving Day Event Stages</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--date c-form-item--date-range">
                                    <div class="c-form-item__label">
                                        <label for="dateRegistrationsStart" class="c-form-item-label-text">When do you accept nonprofit registrations?</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="c-form-control-grid u-items-center">
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.DATE_REGISTRATIONS_START" name="dateRegistrationsStart" id="dateRegistrationsStart"
                                                                placeholder="Start" :maxDate="dateRegistrationsMaxDate"></forms-datetime>
                                            </div>
                                            <div class="c-form-control-grid__separator">
                                                to
                                            </div>
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.DATE_REGISTRATIONS_END" name="dateRegistrationsEnd" id="dateRegistrationsEnd"
                                                                placeholder="End" :minDate="dateRegistrationsMinDate"></forms-datetime>
                                            </div>
                                        </div>
                                        <div class="c-notes c-notes--below">
                                            During this time range, nonprofits in your community can register to create their own landing pages. If no range is specified, then nonprofits can start registering 30 days before your event's start date up until the date of your event.
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--date c-form-item--date-range">
                                    <div class="c-form-item__label">
                                        <label for="dateAcceptDonationsStart" class="c-form-item-label-text">When do you accept donations?</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="c-form-control-grid u-items-center">
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.DATE_DONATIONS_START" name="dateAcceptDonationsStart" id="dateAcceptDonationsStart"
                                                                placeholder="Start" :maxDate="dateAcceptDonationsMaxDate"></forms-datetime>
                                            </div>
                                            <div class="c-form-control-grid__separator">
                                                to
                                            </div>
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.DATE_DONATIONS_END" name="dateAcceptDonationsEnd" id="dateAcceptDonationsEnd"
                                                                placeholder="End" :minDate="dateAcceptDonationsMinDate"></forms-datetime>
                                            </div>
                                        </div>
                                        <div class="c-notes c-notes--below">
                                            During this time range, visitors to your site can make donations to any registered and verified nonprofits. If no range is specified, then donations will only be accepted on the actual date your event.
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
					DATE_DONATIONS_END: '',
					DATE_DONATIONS_START: '',
					DATE_EVENT_END: '',
					DATE_EVENT_START: '',
					DATE_REGISTRATIONS_END: '',
					DATE_REGISTRATIONS_START: '',
					EVENT_TITLE: '',
					EVENT_TIMEZONE: ''
				},

				// Errors
				formErrors: {},
				apiError: {},

			};
		},
		computed: {
			dateEventMinDate: function () {
				return this.formData.DATE_EVENT_START ? this.formData.DATE_EVENT_START : false;
			},
			dateEventMaxDate: function () {
				return this.formData.DATE_EVENT_END ? this.formData.DATE_EVENT_END : false;
			},
			dateRegistrationsMinDate: function () {
				return this.formData.DATE_REGISTRATIONS_START ? this.formData.DATE_REGISTRATIONS_START : false;
			},
			dateRegistrationsMaxDate: function () {
				return this.formData.DATE_REGISTRATIONS_END ? this.formData.DATE_REGISTRATIONS_END : false;
			},
			dateAcceptDonationsMinDate: function () {
				return this.formData.DATE_DONATIONS_START ? this.formData.DATE_DONATIONS_START : false;
			},
			dateAcceptDonationsMaxDate: function () {
				return this.formData.DATE_DONATIONS_END ? this.formData.DATE_DONATIONS_END : false;
			}
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
				return {
					DATE_DONATIONS_END: {
						label: 'Donations end date',
					},
					DATE_DONATIONS_START: {
						label: 'Donations start date',
					},
					DATE_EVENT_END: {
						label: 'Event end date',
						presence: true,
					},
					DATE_EVENT_START: {
						label: 'Event start date',
						presence: true,
					},
					DATE_REGISTRATIONS_END: {
						label: 'Nonprofit registrations end date',
					},
					DATE_REGISTRATIONS_START: {
						label: 'Nonprofit registrations start date',
					},
					EVENT_TITLE: {
						label: 'Event title',
						presence: true,
					},
					EVENT_TIMEZONE: {
						label: 'Event timezone',
						presence: true,
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

				const settings = [];
				Object.keys(vue.formData).forEach(function (key) {
					settings.push({
						key: key,
						value: vue.formData[key]
					});
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
					vue.removeModal('spinner');
					vue.apiError = err.response.data.errors;
				});
			}
		},
		components: {
			'forms-datetime': require('./../../../forms/Datetime.vue'),
			'forms-select-time-zone': require('./../../../forms/SelectTimeZone.vue')
		}
	};
</script>