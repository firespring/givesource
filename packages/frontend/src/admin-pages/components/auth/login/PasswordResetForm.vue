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
	module.exports = {
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
		components: {
			'authorizing': require('../AuthorizingSpinner.vue'),
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
		}
	}
</script>