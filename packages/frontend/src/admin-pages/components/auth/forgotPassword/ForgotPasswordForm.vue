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
    <div class="c-page-section__main">
        <h4>Reset your password</h4>

        <form v-on:submit.prevent="submit">

            <div class="c-alert c-alert--bad c-alert--shadow u-flex u-justify-center" v-if="errors.length">
                <div class="c-alert__body u-flex u-justify-between">
                    <div class="c-alert__icon">
                        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                    </div>
                    <div class="c-alert__text">
                        <p v-for="error in errors">
                            {{ error }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="c-form-item c-form-item--email c-form-item--required c-form-item--compact">
                <div class="c-form-item__control">
                    <div class="u-control-icon u-control-icon--email has-floating-label js-floating-label" v-floating-label>
                        <input v-model="formData.email" type="email" name="email" id="email" :class="{ 'has-error': formErrors.email }" v-auto-focus>
                        <label for="email">Email Address</label>
                    </div>
                    <div v-if="formErrors.email" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                        {{ formErrors.email }}
                    </div>
                </div>
            </div>

            <footer class="c-form-actions c-form-actions--compact">
                <button type="submit" class="c-btn c-btn--good">Continue</button>
                <router-link :to="{ name: 'login' }" class="c-btn c-btn--text c-btn--neutral">Return to login</router-link>
            </footer>
        </form>

    </div>
</template>

<script>
	const User = require('../../../helpers/user');

	export default {
		data() {
			return {

				// Form Data
				formData: {
					email: ''
				},

				// Errors
				errors: [],
				formErrors: {}
			}
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
			}
		},
		methods: {
			getConstraints() {
				return {
					email: {
						label: 'Email address',
						presence: true,
						email: true
					}
				}
			},
			submit() {
				const vm = this;

				vm.addModal('spinner');
				vm.errors = [];
				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
				} else {
					vm.forgotPassword();
				}
			},
			forgotPassword() {
				const vm = this;

				User.forgotPassword(vm.formData.email, {
					onSuccess(data, cognitoUser) {
						vm.clearModals();
						vm.$router.push({'name': 'forgot-password-request-sent'});
					},
					onFailure(err) {
						vm.clearModals();
						vm.$router.push({'name': 'forgot-password-request-sent'});
					}
				});
			}
		}
	}
</script>