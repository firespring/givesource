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
    <div id="modal-confirm-nonprofit-revoke" class="c-modal c-modal--warning c-modal--sm" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">

                    <div class="c-modal-header">
                        <h1>Do you want to revoke this Nonprofit? This can't be undone.</h1>
                    </div>

                    <div class="c-modal-content">
                        <api-error v-model="apiError"></api-error>
                        <div class="c-page-section">
                            <div class="c-page-section__main">
                                <p>
                                    Revoking a nonprofit's access will remove their access to the admin area and remove their donation page from the website.
                                </p>
                            </div>
                        </div>

                        <div class="c-modal-footer">
                            <div class="c-modal-footer__actions">
                                <button v-on:click="revokeNonprofit" type="button" class="c-btn c-btn--bad js-modal-close">Revoke Them</button>
                                <button v-on:click="cancel" type="button" class="c-btn c-btn--neutral c-btn--text js-modal-close">Cancel</button>
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
        data: function () {
            return {
                apiError: {}
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
                    nonprofit: {}
                }
            }
        },
        methods: {
            cancel: function () {
                this.clearModals();
            },
            revokeNonprofit: function () {
                const vue = this;

                vue.addModal('spinner');

                vue.$request.patch('nonprofits/' + vue.data.nonprofit.id + '/status', {
                    status: 'REVOKED'
                }).then(function () {
                    vue.clearModals();
                    vue.bus.$emit('revokeNonprofit', vue.data.nonprofit.uuid);
                }).catch(function (err) {
                    vue.apiError = err.response.data.errors;
                    vue.removeModal('spinner');
                });

            },
        }
    };
</script>