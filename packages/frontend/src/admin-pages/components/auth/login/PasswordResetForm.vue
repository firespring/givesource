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
        <h4>You'll be automatically logged in after saving your new password.</h4>

        <div class="c-alert c-alert--bad c-alert--shadow u-flex u-justify-center" v-if="errors.length">
            <div class="c-alert__body u-flex u-justify-between">
                <div class="c-alert__icon">
                    <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                </div>
                <div class="c-alert__text" v-for="error in errors">
                    <p>
                        {{ error }}
                    </p>
                </div>
            </div>
        </div>

        <form v-on:submit.prevent="submit" novalidate="">

            <div class="c-form-item c-form-item--password c-form-item--required c-form-item--compact">
                <div class="c-form-item__control">
                    <div class="u-control-icon u-control-icon--password has-floating-label js-floating-label" v-floating-label>
                        <input v-model="formData.password" type="password" name="password" id="password" :class="{ 'has-error': formErrors.password }" v-auto-focus>
                        <label for="password">New Password</label>
                    </div>
                    <div v-if="formErrors.password" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                        {{ formErrors.password }}
                    </div>
                    <div class="c-notes c-notes--below">
                        Your password must be at least 8 characters long and contain a combination of numbers and upper and lower case letters.
                    </div>
                </div>
            </div>

            <div class="c-form-item c-form-item--password c-form-item--required c-form-item--compact">
                <div class="c-form-item__control">
                    <div class="u-control-icon u-control-icon--password has-floating-label js-floating-label" v-floating-label>
                        <input v-model="formData.passwordConfirm" type="password" name="passwordConfirm" id="passwordConfirm" :class="{ 'has-error': formErrors.passwordConfirm }">
                        <label for="passwordConfirm">Confirm Password</label>
                    </div>
                    <div v-if="formErrors.passwordConfirm" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                        {{ formErrors.passwordConfirm }}
                    </div>
                </div>
            </div>

            <footer class="c-form-actions c-form-actions--compact">
                <button type="submit" class="c-btn c-btn--good">Save Password &amp; Log In</button>
            </footer>

        </form>
    </div>
</template>

<script>
	import ComponentAuthorizingSpinner from './../AuthorizingSpinner.vue';

	export default {
		data() {
			return {
				displayAuthorizing: false,

				// Form Data
				formData: {
					password: '',
					passwordConfirm: ''
				},

				// Errors
				errors: [],
				formErrors: {}
			};
		},
		props: [
			'cognitoUser',
			'userAttributes'
		],
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
					password: {
						presence: true,
					},
					passwordConfirm: {
						label: 'Password confirmation',
						presence: true,
						equality: 'password'
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
					vm.resetPassword();
				}
			},
			resetPassword() {
				const vm = this;

				if (vm.cognitoUser) {
					delete vm.userAttributes['email_verified'];
					vm.cognitoUser.completeNewPasswordChallenge(vm.formData.password, vm.userAttributes, {
						onSuccess() {
							vm.$request.patch('users/' + vm.cognitoUser.username, {isVerified: true}).then(() => {
								vm.redirectToIntendedUri();
							}).catch(err => {
								console.log(err);
								vm.toggleAuthorizing(false);
							});
						},
						onFailure(err) {
							vm.toggleAuthorizing(false);
							vm.errors.push(err.message);
						},
						mfaRequired(codeDeliveryDetails) {
							vm.toggleAuthorizing(false);
							// TODO: handle mfa
							// vm.cognitoUser.sendMFACode(mfaCode, this);
						}
					});
				}
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
			},
			redirectToIntendedUri() {
				const vm = this;

				if (vm.$route.query.redirect) {
					vm.$router.push(vm.$route.query.redirect);
				} else {
					vm.$router.push('/');
				}
			}
		},
		components: {
			'authorizing': ComponentAuthorizingSpinner,
		}
	}
</script>