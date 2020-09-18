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

        <form v-on:submit="submit" novalidate="">

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
                        Your password must be at least 8 characters long with a combination of numbers, uppercase letters, and lowercase letters.
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
		data: function () {
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
			}
		},
		props: [
			'cognitoUser',
			'userAttributes'
		],
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
					password: {
						presence: true,
					},
					passwordConfirm: {
						label: 'Password confirmation',
						presence: true,
						equality: 'password'
					}
				}
			},
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.toggleAuthorizing(true);
				vue.errors = [];
				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.toggleAuthorizing(false);
				} else {
					vue.resetPassword();
				}
			},
			resetPassword: function () {
				const vue = this;

				if (vue.cognitoUser) {
					delete vue.userAttributes['email_verified'];
					vue.cognitoUser.completeNewPasswordChallenge(vue.formData.password, vue.userAttributes, {
						onSuccess: function () {
							vue.$request.patch('users/' + vue.cognitoUser.username, {isVerified: true}).then(function () {
								vue.redirectToIntendedUri();
							}).catch(function (err) {
								console.log(err);
								vue.toggleAuthorizing(false);
							});
						},
						onFailure: function (err) {
							vue.toggleAuthorizing(false);
							vue.errors.push(err.message);
						},
						mfaRequired: function (codeDeliveryDetails) {
							vue.toggleAuthorizing(false);
							// TODO: handle mfa
							// vue.cognitoUser.sendMFACode(mfaCode, this);
						}
					});
				}
			},
			toggleAuthorizing: function (toggle) {
				const vue = this;

				if (toggle) {
					vue.displayAuthorizing = true;
					vue.$emit('setDisplayHeader', false);
					vue.$emit('setDisplayLinks', false);
				} else {
					vue.displayAuthorizing = false;
					vue.$emit('setDisplayHeader', true);
					vue.$emit('setDisplayLinks', true);
				}
			},
			redirectToIntendedUri: function () {
				const vue = this;

				if (vue.$route.query.redirect) {
					vue.$router.push(vue.$route.query.redirect);
				} else {
					vue.$router.push('/');
				}
			}
		},
		components: {
			'authorizing': ComponentAuthorizingSpinner,
		}
	}
</script>