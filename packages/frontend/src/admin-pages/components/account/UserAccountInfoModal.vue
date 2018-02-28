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
    <div id="modal-account-edit-your-info" class="c-modal" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">

                    <div class="c-modal-header">
                        <h1>Edit Your Info</h1>
                    </div>

                    <div class="c-modal-content">
                        <api-error v-model="apiError"></api-error>
                        <div class="c-page-section">
                            <div class="c-page-section__main">
                                <fieldset class="c-page-section__fieldset" aria-labelledby="section-your-info">
                                    <div class="c-form-item c-form-item--text c-form-item--required">
                                        <div class="c-form-item__control">
                                            <div class="c-form-control-grid">
                                                <div class="c-form-control-grid__item">
                                                    <div class="has-floating-label has-floating-label--blank js-floating-label has-floating-label--float" v-floating-label>
                                                        <input v-model="formData.firstName" type="text" name="nameFirst" id="nameFirst"
                                                               :class="{ 'has-error': formErrors.firstName }" v-auto-focus>
                                                        <label for="nameFirst" style="">First Name</label>
                                                    </div>
                                                    <div v-if="formErrors.firstName" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                                        {{ formErrors.firstName }}
                                                    </div>
                                                </div>
                                                <div class="c-form-control-grid__item">
                                                    <div class="has-floating-label has-floating-label--blank js-floating-label has-floating-label--float" v-floating-label>
                                                        <input v-model="formData.lastName" type="text" name="nameLast" id="nameLast" :class="{ 'has-error': formErrors.lastName }">
                                                        <label for="nameLast" style="">Last Name</label>
                                                    </div>
                                                    <div v-if="formErrors.lastName" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                                        {{ formErrors.lastName }}
                                                    </div>
                                                </div>
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
                    firstName: this.user.firstName,
                    lastName: this.user.lastName
                },

                // Errors
                formErrors: {},
                apiError: {}
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
                    firstName: {
                        presence: true,
                    },
                    lastName: {
                        presence: true,
                    }
                }
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
                    vue.updateUser();
                }
            },
            updateUser: function () {
                const vue = this;

                const params = vue.getUpdatedParameters(vue.formData, vue.user);
                if (Object.keys(params).length === 0) {
                    vue.clearModals();
                    return;
                }

                vue.$request.patch('users/' + vue.user.uuid, params).then(function (response) {
                    vue.removeModal();
                    if (response.data.errorMessage) {
                        console.log(response.data);
                    } else {
                        vue.clearModals();
                        vue.bus.$emit('userAccountUpdateInfo', response.data);
                    }
                }).catch(function (err) {
                    vue.removeModal();
                    vue.apiError = err.response.data.errors;
                });
            }
        }
    };
</script>