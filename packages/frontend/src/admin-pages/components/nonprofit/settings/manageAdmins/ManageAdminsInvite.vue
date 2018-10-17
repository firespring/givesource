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
                            <span v-if="nonprofit.legalName"><router-link :to="{ name: 'nonprofit-settings-admins-list' }">Manage {{ nonprofit.legalName }}'s Admin Users</router-link></span>
                            <span v-else><router-link :to="{ name: 'nonprofit-settings-admins-list' }">Manage Admin Users</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title" v-if="nonprofit.legalName">Invite {{ nonprofit.legalName }}'s Admin Users</h1>
                    </div>
                </div>

                <div class="o-page-header" v-else>
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                            <span><router-link :to="{ name: 'nonprofit-settings-admins-list' }">Manage Admins</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Invite Admins</h1>
                    </div>
                </div>

                <form v-on:submit="submit">
                    <section class="c-page-section c-page-section--border c-page-section--shadow">

                        <header class="c-page-section__header">
                            <div class="c-page-section-header-text">
                                <h2 class="c-page-section-title" id="section-segmented">Admins</h2>
                            </div>
                        </header>

                        <div class="c-page-section__main">
                            <div class="c-form-item c-form-item--textarea c-form-item--required">
                                <div class="c-form-item__label">
                                    <label for="emailAddresses" class="c-form-item-label-text">Enter email addresses of individuals you want to invite</label>
                                    <div class="c-notes">
                                        Separate individual email addresses with commas. Recipients who don't have Giving Day accounts will be asked to create one during the invitation process.
                                    </div>
                                </div>
                                <div class="c-form-item__control">
                                    <textarea v-model="formData.emailAddresses" name="emailAddresses" id="emailAddresses"
                                              :class="{ 'has-error': formErrors.emailAddresses }"></textarea>
                                    <div v-if="formErrors.emailAddresses" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                        {{ formErrors.emailAddresses }}
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        <strong>Note:</strong>
                                        Admins will have full administrative access to all aspects of your account and donation page. Only invite individuals that you trust.
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    <footer class="c-form-actions">
                        <button type="submit" class="c-btn">Send Invites</button>
                        <router-link :to="{ name: 'nonprofit-settings-admins-list' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                    </footer>
                </form>

            </div>
        </main>
    </div>
</template>

<script>
	export default {
		data: function () {
			return {
				nonprofit: {},

				// Form Data
				formData: {
					emailAddresses: '',
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
				}).catch(function(err){
                    vue.apiError = err.response.data.errors;
                });
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
				vue.nonprofit = response.data;
				next();
			}).catch(function (err) {
                vue.apiError = err.response.data.errors;
                next();
			});
		},
		methods: {
			getConstraints: function () {
				return {
					emailAddresses: {
						label: 'Email addresses',
						presence: true,
					}
				}
			},
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('spinner');
				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.inviteNonprofitAdmins();
				}
			},
			inviteNonprofitAdmins: function () {
				const vue = this;

				vue.$request.post('nonprofits/' + vue.nonprofitUuid + '/users', {
					email_addresses: vue.formData.emailAddresses
				}).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						vue.$router.push({name: 'nonprofit-settings-admins-list'});
					}
				}).catch(function (err) {
					vue.clearModals();
                    vue.apiError = err.response.data.errors;
				});
			}
		}
	};
</script>