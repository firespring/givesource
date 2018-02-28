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
    module.exports = {
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

                vue.$request.patch('nonprofits/' + vue.data.nonprofit.uuid + '/status', {
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