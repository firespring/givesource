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
    <div class="c-page-section__main">
        <h4>Reset your password</h4>

        <form v-on:submit="submit">

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

            <div v-if="!hasEmail" class="c-form-item c-form-item--email c-form-item--required c-form-item--compact">
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

            <div v-if="!hasCode" class="c-form-item c-form-item--required c-form-item--compact">
                <div class="c-form-item__control">
                    <div class="has-floating-label js-floating-label" v-floating-label>
                        <input v-model="formData.code" type="text" name="code" id="code" :class="{ 'has-error': formErrors.code }" v-auto-focus>
                        <label for="code">Verification Code</label>
                    </div>
                    <div v-if="formErrors.code" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                        {{ formErrors.code }}
                    </div>
                </div>
            </div>

            <div class="c-form-item c-form-item--password c-form-item--required c-form-item--compact">
                <div class="c-form-item__control">
                    <div class="u-control-icon u-control-icon--password has-floating-label js-floating-label" v-floating-label>
                        <input v-model="formData.password" type="password" name="password" id="password" :class="{ 'has-error': formErrors.password }">
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
                <button type="submit" class="c-btn c-btn--good">Continue</button>
                <router-link :to="{ name: 'login' }" class="c-btn c-btn--text c-btn--neutral">Return to login</router-link>
            </footer>
        </form>

    </div>
</template>

<script>
	const User = require('../../../helpers/user');

	module.exports = {
		data: function () {
			return {

				formData: {
					email: '',
					code: '',
					password: '',
					passwordConfirm: ''
				},

				// Messages
				alert: true,

				// Errors
				errors: [],
				formErrors: {}
			}
		},
		props: [
			'cognitoUser'
		],
		computed: {
			hasCode: function () {
				const vue = this;
				return vue.$route.query.code !== undefined
			},
			hasEmail: function () {
				const vue = this;
				return vue.$route.query.email !== undefined
			},
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
				var vue = this;
				return {
					email: {
						label: 'Email address',
						presence: (!vue.hasEmail),
						email: true
					},
					code: {
						label: 'Verification code',
						presence: (!vue.hasCode)
					},
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

				vue.addModal('spinner');
				vue.alert = false;
				vue.errors = [];
				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.verify();
				}
			},
			verify: function () {
				const vue = this;

				const email = vue.hasEmail ? vue.$route.query.email : vue.formData.email;
				const code = vue.hasCode ? vue.$route.query.code : vue.formData.code;
				User.resetPassword(email, code, vue.formData.password, {
					onSuccess: function (data, cognitoUser) {
						vue.clearModals();
						vue.$router.push({name: 'login'});
					},
					onFailure: function (err) {
						vue.clearModals();
						vue.errors.push(User.formatCognitoErrorMessage(err));
					}
				});
			}
		}
	}
</script>