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
                                <fieldset class="c-page-section__fieldset" aria-labelledby="section-sender-email">
                                    <div class="u-control-icon u-control-icon--email has-floating-label has-floating-label--blank js-floating-label" v-floating-label>
                                        <input v-model="formData.SENDER_EMAIL" type="email" name="senderEmail" id="senderEmail" v-auto-focus>
                                        <label for="senderEmail">Sender Email Address</label>
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
	module.exports = {
		data: function () {
			return {
				// Form Data
				formData: {
					SENDER_EMAIL: this.data.SENDER_EMAIL,
				},

				// Errors
				formErrors: {}
			};
		},
		props: {
			zIndex: {
				type: [Number, String],
				default: 1000
			},
			data: {
				type: Object,
				default: {
					SENDER_EMAIL: null
				}
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
					SENDER_EMAIL: {
						label: 'Sender email address',
						presence: true,
						email: true,
					}
				};
			},
			cancel: function () {
				this.clearModals();
			},
			save: function () {
				const vue = this;

				vue.addModal('spinner');
				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.removeModal();
				} else {
					vue.updateSetting();
				}
			},
			updateSetting: function () {
				const vue = this;

				const params = vue.getUpdatedParameters(vue.formData, vue.data);
				if (Object.keys(params).length === 0) {
					vue.clearModals();
					return;
				}

				axios.get(API_URL + 'settings/email').then(function (response) {
					const setting = _.find(response.data, {email: vue.formData.SENDER_EMAIL});
					if (!setting || (setting && !setting.verified)) {
						return axios.post(API_URL + 'settings/email/verify', {
							email: vue.formData.SENDER_EMAIL
						});
					} else {
						return Promise.resolve();
					}
				}).then(function () {
					return axios.patch(API_URL + 'settings', {
						settings: [
							{
								key: 'SENDER_EMAIL',
								value: vue.formData.SENDER_EMAIL
							},
						]
					});
				}).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					}
					vue.bus.$emit('updateSetting', {
						key: 'SENDER_EMAIL',
						value: vue.formData.SENDER_EMAIL
					});
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			}
		}
	};
</script>