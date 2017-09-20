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

	module.exports = {
		data: function () {
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
					}
				}
			},
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('spinner');
				vue.errors = [];
				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.forgotPassword();
				}
			},
			forgotPassword: function () {
				const vue = this;

				User.forgotPassword(vue.formData.email, {
					onSuccess: function (data, cognitoUser) {
						vue.clearModals();
						vue.$emit('setCognitoUser', cognitoUser);
						vue.$emit('setMainComponent', 'forgot-password-verify-form');
					},
					onFailure: function (err) {
						vue.clearModals();
						vue.errors.push(err.message);
					}
				});
			}
		}
	}
</script>