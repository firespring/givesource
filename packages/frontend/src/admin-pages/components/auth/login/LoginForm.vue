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

        <form v-on:submit="submit">
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
	const User = require('../../../helpers/user');

	module.exports = {
		data: function () {
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
			}
		},
		components: {
			'authorizing': require('../AuthorizingSpinner.vue'),
		},
		beforeMount: function () {
			const vue = this;

			vue.loginWithQueryParams();
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
					email: {
						label: 'Email address',
						presence: true,
						email: true
					},
					password: {
						presence: true
					}
				}
			},
			submit: function (event) {
				const vue = this;
				event.preventDefault();

				vue.toggleAuthorizing(true);
				vue.errors = [];
				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.toggleAuthorizing(false);
				} else {
					vue.login();
				}
			},
			loginWithQueryParams: function () {
				const vue = this;
				if (vue.$route.query.id && vue.$route.query.token) {
					vue.toggleAuthorizing(true);
					vue.login(vue.$route.query.id, vue.$route.query.token);
				}
			},
			login: function (id, token) {
				const vue = this;
				const username = id ? id : vue.formData.email;
				const password = token ? token : vue.formData.password;

				User.login(username, password, {
					onSuccess: function () {
						if (vue.$route.query.redirect) {
							vue.$router.push({path: decodeURIComponent(vue.$route.query.redirect)});
						} else {
							vue.$router.push({name: 'homepage'});
						}
					},
					onFailure: function (err) {
						vue.toggleAuthorizing(false);
						vue.errors.push('Incorrect username or password.');
					},
					mfaRequired: function (codeDeliveryDetails, cognitoUser) {
						vue.toggleAuthorizing(false);
						vue.$emit('setCognitoUser', cognitoUser);
						// TODO: handle mfa
						// vue.cognitoUser.sendMFACode(mfaCode, this);
					},
					newPasswordRequired: function (userAttributes, requiredAttributes, cognitoUser) {
						vue.toggleAuthorizing(false);
						vue.$emit('setCognitoUser', cognitoUser);
						vue.$emit('setUserAttributes', userAttributes);
						vue.$emit('setMainComponent', 'password-reset-form');
					}
				});
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
			}
		}
	};
</script>