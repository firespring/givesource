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
    <div class="c-page-section__main" v-if="displayAuthorizing">
        <authorizing></authorizing>
    </div>
    <div class="c-page-section__main" v-else>
        <h4>Log in with your account info.</h4>


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

        <form v-on:submit.prevent="submit">
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

            <div class="c-form-item c-form-item--password c-form-item--required c-form-item--compact">
                <div class="c-form-item__control">
                    <div class="u-control-icon u-control-icon--password has-floating-label js-floating-label" v-floating-label>
                        <input v-model="formData.password" type="password" name="password" id="password" :class="{ 'has-error': formErrors.password }">
                        <label for="password">Password</label>
                    </div>
                    <div v-if="formErrors.password" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                        {{ formErrors.password }}
                    </div>
                    <div class="c-notes c-notes--below">
                        <router-link :to="{ name: 'forgot-password' }">Forget your password?</router-link>
                        <br>
                    </div>
                </div>
            </div>

            <footer class="c-form-actions c-form-actions--compact">
                <button type="submit" class="c-btn c-btn--good">Log In</button>
            </footer>
        </form>
    </div>
</template>

<script>
	import ComponentAuthorizingSpinner from './../AuthorizingSpinner.vue';

	const User = require('../../../helpers/user');

	export default {
		data() {
			return {
				displayAuthorizing: false,

				// Form Data
				formData: {
					email: '',
					password: '',
				},

				// Errors
				errors: [],
				formErrors: {}
			};
		},
		beforeMount() {
			const vm = this;
			vm.loginWithQueryParams();
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
					},
					password: {
						presence: true
					}
				};
			},
			submit() {
				const vm = this;

				vm.toggleAuthorizing(true);
				vm.errors = [];
				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.toggleAuthorizing(false);
				} else {
					vm.login();
				}
			},
			loginWithQueryParams() {
				const vm = this;
				if (vm.$route.query.id && vm.$route.query.token) {
					vm.toggleAuthorizing(true);
					vm.login(vm.$route.query.id, vm.$route.query.token);
				}
			},
			login(id, token) {
				const vm = this;
				const username = id ? id : vm.formData.email;
				const password = token ? token : vm.formData.password;

				User.login(username, password, {
					onSuccess() {
						if (vm.$route.query.redirect) {
							vm.$router.push({path: decodeURIComponent(vm.$route.query.redirect)});
						} else {
							vm.$router.push({name: 'homepage'});
						}
					},
					onFailure(err) {
						vm.toggleAuthorizing(false);
						vm.errors.push('Incorrect username or password.');
					},
					mfaRequired(codeDeliveryDetails, cognitoUser) {
						vm.toggleAuthorizing(false);
						vm.$emit('setCognitoUser', cognitoUser);
						// TODO: handle mfa
						// vm.cognitoUser.sendMFACode(mfaCode, this);
					},
					newPasswordRequired(userAttributes, requiredAttributes, cognitoUser) {
						vm.toggleAuthorizing(false);
						vm.$emit('setCognitoUser', cognitoUser);
						vm.$emit('setUserAttributes', userAttributes);
						vm.$emit('setMainComponent', 'password-reset-form');
					}
				});
			},
			toggleAuthorizing(toggle) {
				const vm = this;

				if (toggle) {
					vm.displayAuthorizing = true;
					vm.$emit('setDisplayHeader', false);
					vm.$emit('setDisplayLinks', false);
				} else {
					vm.displayAuthorizing = false;
					vm.$emit('setDisplayHeader', true);
					vm.$emit('setDisplayLinks', true);
				}
			}
		},
		components: {
			'authorizing': ComponentAuthorizingSpinner,
		}
	};
</script>