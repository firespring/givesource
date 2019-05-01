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
        <navigation></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">
                <api-error v-model="apiError"></api-error>

                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
                            <span><router-link :to="{ name: 'settings-admins-list' }">Manage Admins</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Invite Admins</h1>
                    </div>
                </div>

                <form v-on:submit.prevent="submit">
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
                        <router-link :to="{ name: 'settings-admins-list' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                    </footer>
                </form>

            </div>
        </main>
    </div>
</template>

<script>
	export default {
		data() {
			return {
				// Form Data
				formData: {
					emailAddresses: '',
				},

				// Errors
				formErrors: {},
                apiError: {},
			}
		},
		methods: {
			getConstraints() {
				return {
					emailAddresses: {
						label: 'Email addresses',
						presence: true,
					}
				}
			},
			submit() {
				const vm = this;

				vm.addModal('spinner');
				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
				} else {
					vm.inviteAdmins();
				}
			},
			inviteAdmins() {
				const vm = this;

				vm.$request.post('users', {
					email_addresses: vm.formData.emailAddresses
				}).then(response => {
					vm.clearModals();
					if (response.data.errorMessage) {
						vm.apiError = vm.formatErrorMessageResponse(response);
						vm.scrollToError('.c-alert');
                    } else {
						vm.$router.push({name: 'settings-admins-list'});
					}
				}).catch(err => {
                    vm.removeModal('spinner');
                    vm.apiError = err.response.data.errors;
                });
			}
		}
	};
</script>