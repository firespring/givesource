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
    <div v-if="modals.length">
        <div v-for="(modal, index) in modals" class="c-modal-overlay" :style="{'z-index': calculateOverlayZIndex(index), display: 'block' }"></div>
        <component v-for="(modal, index) in modals" :is="modal" :key="index" :zIndex="calculateModalZIndex(index)" :data="data[modal]"></component>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				modals: [],
				data: {}
			}
		},
		created: function () {
			const vue = this;

			/**
			 * Add a modal to the top of the stack
			 *
			 * @param {String} modal
			 */
			vue.bus.$on('addModal', function (modal, data) {
				vue.modals.push(modal);
				vue.data[modal] = data || null;
			});

			/**
			 * Remove the top-most modal from the stack
			 */
			vue.bus.$on('removeModal', function (modal) {
				if (vue.modals.indexOf(modal) > -1) {
					vue.modals.splice(vue.modals.indexOf(modal), 1);
				} else if (vue.modals.length) {
					vue.modals = vue.modals.slice(0, -1);
				}
			});

			/**
			 * Replace the top-most modal
			 */
			vue.bus.$on('replaceModal', function (modal, data) {
				if (vue.modals.length > 0) {
					vue.modals[vue.modals.length - 1] = modal;
					vue.data[modal] = data || null;
				} else {
					vue.modals.push(modal);
					vue.data[modal] = data || null;
				}
			});

			/**
			 * Clear all modals from the stack
			 */
			vue.bus.$on('clearModals', function () {
				vue.modals = [];
				vue.data = {};
			});
		},
		methods: {
			calculateOverlayZIndex: function (index) {
				return 999 + (index * 1000);
			},
			calculateModalZIndex: function (index) {
				return this.calculateOverlayZIndex(index) + 1;
			}
		},
		components: {
			'spinner': require('./ModalSpinner.vue'),
			'account-edit-info': require('../account/UserAccountInfoModal.vue'),
			'account-edit-password': require('../account/UserAccountPasswordModal.vue'),
			'nonprofits-revoke': require('./../admin/nonprofits/RevokeNonprofitModal.vue'),
			'photo-editor': require('./photoEditor/PhotoEditorModal.vue'),
			'pages-faq-add-question-modal': require('./../admin/pages/faq/AddQuestionModal.vue'),
			'pages-faq-delete-question-modal': require('./../admin/pages/faq/DeleteQuestionModal.vue'),
			'pages-faq-edit-question-modal': require('./../admin/pages/faq/EditQuestionModal.vue'),
			'pages-toolkit-add-resource-modal': require('./../admin/pages/toolkit/AddResourceModal.vue'),
			'pages-toolkit-delete-resource-modal': require('./../admin/pages/toolkit/DeleteResourceModal.vue'),
			'pages-toolkit-edit-resource-modal': require('./../admin/pages/toolkit/EditResourceModal.vue'),
			'settings-edit-contact-email': require('./../admin/settings/contact/ContactEmailModal.vue'),
			'settings-edit-contact-phone': require('./../admin/settings/contact/ContactPhoneModal.vue'),
			'settings-edit-sender-email': require('./../admin/settings/contact/SenderEmailModal.vue'),
			'settings-resend-verify-email': require('./../admin/settings/contact/ResendVerifyEmailModal.vue'),
		}
	};
</script>

<style>
    .c-modal-overlay {
        height: 100%;
        width: 100%;
        position: fixed;
        left: 0px;
        top: 0px;
        opacity: 0.95;
    }
</style>