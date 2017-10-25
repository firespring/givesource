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
                        </nav>
                        <h1 class="o-page-header-title" v-if="nonprofit.legalName">{{ nonprofit.legalName }}'s Thank You Message</h1>
                    </div>
                </div>

                <div class="o-page-header" v-else>
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                        <span>
                            <router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link>
                        </span>
                        </nav>
                        <h1 class="o-page-header-title">Thank You Message</h1>
                    </div>
                </div>

                <div class="o-app-main-content">
                    <form v-on:submit="submit">
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--rich-text">
                                    <div class="c-form-item__label">
                                        <label for="thankYouMessage" class="c-form-item-label-text">Custom Thank You Message</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="c-notes c-notes--above">
                                            This message will be emailed to your donors after they've successfully made a donation to your organization.
                                        </div>
                                        <textarea v-model="formData.thankYouMessage" name="thankYouMessage" id="thankYouMessage" class="lg"></textarea>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Save Changes</button>
                            <router-link :to="{ name: 'nonprofit-settings-list' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                        </footer>
                    </form>
                </div>
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
					thankYouMessage: ''
                },

				// Errors
                formErrors: {},
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
		watch: {
			formData: {
				handler: function () {
					const vue = this;
					if (Object.keys(vue.formErrors).length) {
						vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
					}
				},
				deep: true
			}
		},
        methods: {
	        getConstraints: function () {
		        return {
			        thankYouMessage: {
				        presence: false,
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
					vue.updateThankYouMessage();
				}
            },
            updateThankYouMessage: function () {
	        	const vue = this;

	        	vue.clearModals();
	        	vue.$router.push({ name: 'nonprofit-settings-list' });
            }
        }
	};
</script>