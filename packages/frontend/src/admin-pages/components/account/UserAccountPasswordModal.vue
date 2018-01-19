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
    <div id="modal-account-edit-password" class="c-modal c-modal--sm" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">

                    <div class="c-modal-header">
                        <h1>Edit Your Password</h1>
                    </div>

                    <div class="c-modal-content">
                        <div class="c-page-section">
                            <div class="c-page-section__main">

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

                                <fieldset class="c-page-section__fieldset" aria-labelledby="section-password">

                                    <div class="c-form-item c-form-item--password c-form-item--required">
                                        <div class="c-form-item__control">
                                            <div class="u-control-icon u-control-icon--password has-floating-label has-floating-label--blank js-floating-label" v-floating-label>
                                                <input v-model="formData.currentPassword" type="password" name="currentPassword" id="currentPassword"
                                                       :class="{ 'has-error': formErrors.currentPassword }" v-auto-focus>
                                                <label for="currentPassword">Current Password</label>
                                            </div>
                                        </div>
                                        <div v-if="formErrors.currentPassword" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                            {{ formErrors.currentPassword }}
                                        </div>
                                        <div class="c-notes c-notes--below">
                                            Please enter your current password.
                                        </div>
                                    </div>

                                    <div class="c-form-item c-form-item--password c-form-item--required">
                                        <div class="c-form-item__control">
                                            <div class="u-control-icon u-control-icon--password has-floating-label has-floating-label--blank js-floating-label" v-floating-label>
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

                                    <div class="c-form-item c-form-item--password c-form-item--required">
                                        <div class="c-form-item__control">
                                            <div class="u-control-icon u-control-icon--password has-floating-label has-floating-label--blank js-floating-label" v-floating-label>
                                                <input v-model="formData.passwordConfirm" type="password" name="passwordConfirm" id="passwordConfirm"
                                                       :class="{ 'has-error': formErrors.passwordConfirm }">
                                                <label for="passwordConfirm">Confirm Password</label>
                                            </div>
                                            <div v-if="formErrors.passwordConfirm" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                                {{ formErrors.passwordConfirm }}
                                            </div>
                                        </div>
                                    </div>

                                </fieldset>
                            </div>
                        </div>

                        <div class="c-modal-footer">
                            <div class="c-modal-footer__actions">
                                <button v-on:click="save" class="c-btn">Save &amp; Close</button>
                                <button v-on:click="cancel" class="c-btn c-btn--neutral c-btn--text">Cancel</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	const User = require('../../helpers/user');

	module.exports = {
		data: function () {
			return {

				// Form Data
				formData: {
					currentPassword: '',
					password: '',
					passwordConfirm: '',
				},

				// Errors
				errors: [],
				formErrors: {},
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
		props: {
			zIndex: {
				type: [Number, String],
				default: 1000
			}
		},
		methods: {
			getConstraints: function () {
				return {
					currentPassword: {
						presence: true,
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
			cancel: function () {
				this.clearModals();
			},
			save: function () {
				const vue = this;

				vue.addModal('spinner');
				vue.errors = [];
				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.removeModal();
				} else {
					vue.changeUserPassword();
				}
			},
			changeUserPassword: function () {
				const vue = this;

				User.changePassword(vue.formData.currentPassword, vue.formData.password, function (err) {
					vue.removeModal();
					if (err) {
						vue.errors.push(vue.formatCognitoErrorMessage(err));
					} else {
						vue.clearModals();
					}
				});
			},
			formatCognitoErrorMessage: function (err) {
				// Make Cognito error message consistent with the Cognito errors that are returned in other areas.
				if (err.name === 'InvalidParameterException' && err.message.includes('Member must have length')) {
					return 'Password does not conform to policy: Password not long enough';
				}
				return err.message;
			}
		}
	};
</script>