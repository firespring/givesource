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
                                <button v-on:click.prevent="save" class="c-btn">Save &amp; Close</button>
                                <button v-on:click.prevent="cancel" class="c-btn c-btn--neutral c-btn--text">Cancel</button>
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

	export default {
		data() {
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
			};
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
		props: {
			zIndex: {
				type: [Number, String],
				default: 1000
			}
		},
		methods: {
			getConstraints() {
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
				};
			},
			cancel() {
				this.clearModals();
			},
			save() {
				const vm = this;

				vm.addModal('spinner');
				vm.errors = [];
				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.removeModal();
				} else {
					vm.changeUserPassword();
				}
			},
			changeUserPassword() {
				const vm = this;

				User.changePassword(vm.formData.currentPassword, vm.formData.password, err => {
					vm.removeModal();
					if (err) {
						vm.errors.push(User.formatCognitoErrorMessage(err));
					} else {
						vm.clearModals();
					}
				});
			}
		}
	};
</script>