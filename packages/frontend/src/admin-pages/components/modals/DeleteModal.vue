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
    <div id="modal-confirm-delete" class="c-modal c-modal--warning c-modal--sm" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <!-- BEGIN modal-dialog -->
            <div class="c-modal-dialog">
                <!-- BEGIN modal-dialog__contents -->
                <div class="c-modal-dialog__contents">
                    <!-- BEGIN modal-header -->
                    <div class="c-modal-header">
                        <h1>{{modalTitle}}</h1>
                    </div>
                    <!-- END modal-header -->

                    <!-- BEGIN modal-content -->
                    <div class="c-modal-content">
                        <div class="c-page-section">
                            <div class="c-page-section__main">
                                <p>
                                    {{modalText}}
                                </p>
                            </div>
                        </div>

                        <div class="c-modal-footer">
                            <div class="c-modal-footer__actions">
                                <button v-on:click="remove" type="button" class="c-btn c-btn--bad js-modal-close">Yes, Delete Them</button>
                                <button v-on:click="cancel" type="button" class="c-btn c-btn--neutral c-btn--text js-modal-close">No, Keep Them</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END modal-dialog__contents -->
            </div>
            <!-- END modal-dialog -->
        </div>
        <!-- END modal__contents -->
    </div>
</template>
<script>
    module.exports = {
        data: function () {
            return {
                modalTitle: this.data.modalTitle,
                modalText: this.data.modalText,
                callBack: this.data.callBack
            }
        },
        props: {
            zIndex: {
                type: [Number, String],
                default: 1000
            },
            data: {
                type: Object,
                default: {
                    modalTitle: 'Delete Confirmation',
                    modalText: 'Are you sure you want to delete item(s)?',
                    callBack: String
                }
            }
        },
        methods: {
            cancel: function () {
                const vue = this;
                vue.clearModals();
            },

            remove: function () {
                const vue = this;
                vue.bus.$emit('deleteUserAdmin');
                vue.clearModals();
            }
        }
    }
</script>