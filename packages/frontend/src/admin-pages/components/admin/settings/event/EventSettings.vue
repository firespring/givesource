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
                        <h1 class="o-page-header-title">Event Settings</h1>
                    </div>
                </div>

                <div class="o-app-main-content">

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

                                <div class="c-form-item c-form-item--date c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.DATE_EVENT }">
                                    <div class="c-form-item__label">
                                        <label for="dateEvent" class="c-form-item-label-text">Event Date</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-datetime v-model="formData.DATE_EVENT" name="dateEvent" id="dateEvent"
                                                        :hasError="formErrors.hasOwnProperty('DATE_EVENT')"></forms-datetime>
                                        <div v-if="formErrors.DATE_EVENT" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.DATE_EVENT }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--url c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.EVENT_URL }">
                                    <div class="c-form-item__label">
                                        <label for="eventUrl" class="c-form-item-label-text">Event URL</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="u-control-icon u-control-icon--url">
                                            <input v-model="formData.EVENT_URL" type="url" name="eventUrl" id="eventUrl" maxlength="200" placeholder="https://"
                                                   :class="{ 'has-error': formErrors.EVENT_URL }">
                                        </div>
                                        <div v-if="formErrors.EVENT_URL" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EVENT_URL }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--tel" :class="{ 'c-form-item--has-error': formErrors.PHONE_NUMBER }">
                                    <div class="c-form-item__label">
                                        <label for="phoneNum" class="c-form-item-label-text">Contact Phone #</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="u-control-icon u-control-icon--tel">
                                            <input v-model="formData.PHONE_NUMBER" type="tel" name="phoneNum" id="phoneNum" :class="{ 'has-error': formErrors.PHONE_NUMBER }">
                                        </div>
                                        <div v-if="formErrors.PHONE_NUMBER" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.PHONE_NUMBER }}
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
					DATE_EVENT: '',
					DATE_REGISTRATIONS_END: '',
					DATE_REGISTRATIONS_START: '',
					EVENT_TITLE: '',
					EVENT_TIMEZONE: '',
					EVENT_URL: '',
					PHONE_NUMBER: '',
				},

				// Errors
				formErrors: {}

			};
		},
		computed: {
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
			},
			eventUrl: function () {
				return this.$store.getters.setting('PUBLIC_PAGES_CLOUDFRONT_URL');
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
						label: 'Donations start date',
					},
					DATE_DONATIONS_START: {
						label: 'Donations start date',
					},
					DATE_EVENT: {
						label: 'Event date',
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
					},
					EVENT_URL: {
						label: 'Event URL',
						presence: true,
					},
					PHONE_NUMBER: {
						label: 'Contact phone #',
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
					vue.clearModals();
					console.log(err);
				});
			}
		},
		components: {
			'forms-datetime': require('./../../../forms/Datetime.vue'),
			'forms-select-time-zone': require('./../../../forms/SelectTimeZone.vue')
		}
	};
</script>