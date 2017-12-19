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
    <div id="modal-settings-edit-contact-email-address" class="c-modal c-modal--sm" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">

                    <div class="c-modal-header">
                        <h1>Edit Contact Email Address</h1>
                    </div>

                    <div class="c-modal-content">
                        <div class="c-page-section">
                            <div class="c-page-section__main">
                                <fieldset class="c-page-section__fieldset" aria-labelledby="section-contact-email">
                                    <div class="c-form-item c-form-item--email c-form-item--required">
                                        <div class="c-form-item__control">
                                            <div class="u-control-icon u-control-icon--email has-floating-label has-floating-label--blank js-floating-label" v-floating-label>
                                                <input v-model="formData.CONTACT_EMAIL" type="email" name="contactEmail" id="contactEmail" v-auto-focus>
                                                <label for="contactEmail">Contact Email Address</label>
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
	module.exports = {
		data: function () {
			return {
				// Form Data
				formData: {
					CONTACT_EMAIL: this.data.CONTACT_EMAIL,
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
					CONTACT_EMAIL: null,
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
					CONTACT_EMAIL: {
						label: 'Contact email address',
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

				axios.patch(API_URL + 'settings', {
					settings: [
						{
							key: 'CONTACT_EMAIL',
							value: vue.formData.CONTACT_EMAIL
						},
					]
				}).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					}
					vue.bus.$emit('updateSetting', {
						key: 'CONTACT_EMAIL',
                        value: vue.formData.CONTACT_EMAIL
                    });
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			}
		}
	};
</script>