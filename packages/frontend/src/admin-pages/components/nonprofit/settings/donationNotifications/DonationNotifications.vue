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
        <navigation :nonprofitUuid="nonprofitUuid"></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">
                <api-error v-model="apiError"></api-error>

                <div class="o-page-header" v-if="isAdmin">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofits-list' }">Nonprofits</router-link></span>
                            <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title" v-if="nonprofit.legalName">Manage {{ nonprofit.legalName }}'s Donation Notifications</h1>
                    </div>
                </div>

                <div class="o-page-header" v-else>
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Donation Notifications</h1>
                    </div>
                </div>

                <form v-on:submit="submit">
                    <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
                        <div class="c-page-section__main">

                            <div class="c-form-item c-form-item--radio">
                                <div class="c-form-item__label">
                                    <div class="c-form-item-label-text" id="radioDefault">How often do you want to receive donation notification emails?</div>
                                </div>
                                <div class="c-form-item__control">
                                    <ul class="c-input-list c-input-list--radio" aria-labelledby="radioDefault">
                                        <li>
                                            <input v-model="formData.receiveDonationNotifications" type="radio" name="notifications" id="notifications-1" :value="true">
                                            <label for="notifications-1">Send notifications for every donation</label>
                                        </li>
                                        <li>
                                            <input v-model="formData.receiveDonationNotifications" type="radio" name="notifications" id="notifications-2" :value="false">
                                            <label for="notifications-2">Don't send any donation notifications</label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="c-notes u-margin-top-thick" v-if="settings.SENDER_EMAIL">
                                These settings will apply to all of <router-link :to="{name: 'nonprofit-settings-admins-list'}">your donation page's admins</router-link>.
                                Donation notifications will be sent from {{settings.SENDER_EMAIL}}.
                                Add that email address to your whitelist so that notifications aren't marked as spam.
                            </div>
                            <div class="c-notes u-margin-top-thick" v-else>
                                These settings will apply to all of <router-link :to="{name: 'nonprofit-settings-admins-list'}">your donation page's admins</router-link>.
                            </div>
                        </div>
                    </section>

                    <footer class="c-form-actions">
                        <button type="submit" class="c-btn">Save Changes</button>
                    </footer>
                </form>

            </div>
        </main>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				nonprofit: {},
				loaded: false,

				formData: {
					receiveDonationNotifications: true,
				},

                settings: {
					SENDER_EMAIL: null,
                },

				// Errors
				formErrors: {},
				apiError: {},
			}
		},
		computed: {
			isAdmin: function () {
				return this.isSuperAdminUser() || this.isAdminUser();
			}
		},
		props: [
			'nonprofitUuid'
		],
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
					vue.nonprofit = response.data;
					return vue.$request.get('settings/SENDER_EMAIL');
				}).then(function (response) {
					if (response.data && response.data.value) {
						vue.settings.SENDER_EMAIL = response.data.value;
                    }
                });
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
				vue.nonprofit = response.data;
				return vue.$request.get('settings/SENDER_EMAIL');
			}).then(function (response) {
				if (response.data && response.data.value) {
					vue.settings.SENDER_EMAIL = response.data.value;
				}
				next();
			}).catch(function () {
				next();
			});
		},
		created: function () {
			this.addModal('spinner');
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
			nonprofit: {
				handler: function () {
					const vue = this;

					vue.formData = vue.sync(vue.formData, vue.nonprofit);
					vue.loaded = true;
					vue.removeModal('spinner');
				},
				deep: true
			}
		},
		methods: {
			getConstraints: function () {
				return {};
			},
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('spinner');

				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.updateNonprofit();
				}
			},
			updateNonprofit: function () {
				const vue = this;

				const params = vue.getUpdatedParameters(vue.formData, vue.nonprofit);
				if (Object.keys(params).length === 0) {
					vue.clearModals();
					vue.$router.push({name: 'nonprofit-settings-list'});
					return;
				}

				vue.$request.patch('nonprofits/' + vue.nonprofitUuid, params).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						vue.$router.push({name: 'nonprofit-settings-list'});
					}
				}).catch(function (err) {
					vue.clearModals();
					vue.apiError = err.response.data.errors;
				});
			}
		},
		components: {
			'category-select': require('./../../../forms/SelectNonprofitCategory.vue'),
			'state-select': require('./../../../forms/SelectState.vue')
		}
	};
</script>