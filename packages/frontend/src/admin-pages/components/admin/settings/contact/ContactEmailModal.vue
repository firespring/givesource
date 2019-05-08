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
    <div id="modal-settings-edit-sender-email-address" class="c-modal c-modal--sm" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">

                    <div class="c-modal-header">
                        <h1>Edit Contact Email Address</h1>
                    </div>

                    <div class="c-modal-content">
                        <div class="c-page-section">
                            <div class="c-page-section__main">
                                <api-error v-model="apiError"></api-error>
                                <fieldset class="c-page-section__fieldset" aria-labelledby="section-sender-email">
                                    <div class="u-control-icon u-control-icon--email has-floating-label has-floating-label--blank js-floating-label" v-floating-label>
                                        <input v-model="formData.CONTACT_EMAIL" type="email" name="contactEmail" id="contactEmail"
                                               :class="{ 'has-error': formErrors.CONTACT_EMAIL }" v-auto-focus>
                                        <label for="contactEmail">Contact Email Address</label>
                                    </div>
                                    <div v-if="formErrors.CONTACT_EMAIL" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.CONTACT_EMAIL }}
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        An email will be sent to this address with a verification link. You will not be able to send any messages from this address until that link
                                        has been clicked.
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
	export default {
		data() {
			return {
				// Form Data
				formData: {
					CONTACT_EMAIL: this.data.CONTACT_EMAIL,
				},

				// Errors
				formErrors: {},
				apiError: {},
			};
		},
		props: {
			zIndex: {
				type: [Number, String],
				default: 1000
			},
			data: {
				type: Object,
				default: () => {
					return {
						CONTACT_EMAIL: null
					};
				}
			}
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
					CONTACT_EMAIL: {
						label: 'Contact email address',
						presence: true,
						email: true,
					}
				};
			},
			cancel() {
				this.clearModals();
			},
			save() {
				const vm = this;

				vm.addModal('spinner');
				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.removeModal();
				} else {
					vm.updateSetting();
				}
			},
			updateSetting() {
				const vm = this;

				const params = vm.getUpdatedParameters(vm.formData, vm.data);
				if (Object.keys(params).length === 0) {
					vm.clearModals();
					return;
				}

				vm.$request.get('settings/email').then(response => {
					const setting = _.find(response.data, {email: vm.formData.CONTACT_EMAIL});
					if (!setting || (setting && !setting.verified)) {
						return vm.$request.post('settings/email/verify', {
							email: vm.formData.CONTACT_EMAIL
						});
					} else {
						return Promise.resolve();
					}
				}).then(() => {
					return vm.$request.patch('settings', {
						settings: [
							{
								key: 'CONTACT_EMAIL',
								value: vm.formData.CONTACT_EMAIL
							},
						]
					});
				}).then(response => {
					vm.clearModals();
					if (response.data.errorMessage) {
						vm.apiError = vm.formatErrorMessageResponse(response);
						vm.scrollToError('.c-alert');
					}
					vm.bus.$emit('updateSetting', {
						key: 'CONTACT_EMAIL',
						value: vm.formData.CONTACT_EMAIL
					});
				}).catch(err => {
					vm.removeModal('spinner');
					vm.apiError = err.response.data.errors;
				});
			}
		}
	};
</script>