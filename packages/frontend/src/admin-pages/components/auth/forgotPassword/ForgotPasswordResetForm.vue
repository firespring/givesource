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

	export default {
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