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

                <form v-on:submit.prevent="submit">
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
	import ComponentSelectNonprofitCategory from './../../../forms/SelectNonprofitCategory.vue';
	import ComponentSelectState from './../../../forms/SelectState.vue';

	export default {
		data() {
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
			};
		},
		computed: {
			isAdmin() {
				return this.isSuperAdminUser() || this.isAdminUser();
			}
		},
		props: [
			'nonprofitUuid'
		],
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(response => {
					vm.nonprofit = response.data;
					return vm.$request.get('settings/SENDER_EMAIL');
				}).then(response => {
					if (response.data && response.data.value) {
						vm.settings.SENDER_EMAIL = response.data.value;
					}
				});
			});
		},
		beforeRouteUpdate(to, from, next) {
			const vm = this;

			vm.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(response => {
				vm.nonprofit = response.data;
				return vm.$request.get('settings/SENDER_EMAIL');
			}).then(response => {
				if (response.data && response.data.value) {
					vm.settings.SENDER_EMAIL = response.data.value;
				}
				next();
			}).catch(() => {
				next();
			});
		},
		created() {
			this.addModal('spinner');
		},
		watch: {
			formData: {
				handler() {
					const vm = this;
					if (Object.keys(vm.formErrors).length) {
						vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
					}
				},
				deep: true
			},
			nonprofit: {
				handler() {
					const vm = this;

					vm.formData = vm.sync(vm.formData, vm.nonprofit);
					vm.loaded = true;
					vm.removeModal('spinner');
				},
				deep: true
			}
		},
		methods: {
			getConstraints() {
				return {};
			},
			submit() {
				const vm = this;

				vm.addModal('spinner');

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
				} else {
					vm.updateNonprofit();
				}
			},
			updateNonprofit() {
				const vm = this;

				const params = vm.getUpdatedParameters(vm.formData, vm.nonprofit);
				if (Object.keys(params).length === 0) {
					vm.clearModals();
					vm.$router.push({name: 'nonprofit-settings-list'});
					return;
				}

				vm.$request.patch('nonprofits/' + vm.nonprofitUuid, params).then(response => {
					vm.clearModals();
					if (response.data.errorMessage) {
						vm.apiError = vm.formatErrorMessageResponse(response);
						vm.scrollToError('.c-alert');
					} else {
						vm.$router.push({name: 'nonprofit-settings-list'});
					}
				}).catch(err => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});
			}
		},
		components: {
			'category-select': ComponentSelectNonprofitCategory,
			'state-select': ComponentSelectState,
		}
	};
</script>