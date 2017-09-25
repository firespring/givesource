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
        <navigation :nonprofitUuid="nonprofitUuid"></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">

                <div class="o-page-header" v-if="isAdmin">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofits-list' }">Nonprofits</router-link></span>
                            <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                            <span><router-link :to="{ name: 'nonprofit-settings-admins-list' }">Manage Admin Users</router-link></span>
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
                                    <textarea v-model="formData.emailAddresses" name="emailAddresses" id="emailAddresses" style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 100px;"  :class="{ 'has-error': formErrors.emailAddresses }"></textarea>
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
                        <router-link :to="{ name: 'list-admins' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
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

				// Form Data
				formData: {
					emailAddresses: '',
				},

				// Errors
				formErrors: {}
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
			next(function (vm) {
				axios.get(API_URL + '/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
					vm.nonprofit = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + '/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
				vue.nonprofit = response.data;
			}).then(function () {
				next();
			}).catch(function () {
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

				axios.post(API_URL + 'nonprofits/' + vue.nonprofitUuid + '/users', {
					email_addresses: vue.formData.emailAddresses,
					user_pool_id: USER_POOL_ID
				}).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						vue.$router.push({name: 'list-admins'});
					}
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			}
		}
	};
</script>