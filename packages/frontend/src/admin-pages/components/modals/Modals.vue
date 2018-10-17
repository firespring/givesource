<!--
  ~ Copyright 2018 Firespring, Inc.
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
    <div v-if="modals.length">
        <div v-for="(modal, index) in modals" class="c-modal-overlay" :style="{'z-index': calculateOverlayZIndex(index), display: 'block' }"></div>
        <component v-for="(modal, index) in modals" :is="modal" :key="index" :zIndex="calculateModalZIndex(index)" :data="data[modal]"></component>
    </div>
</template>

<script>
	import ComponentContactEmailModal from './../admin/settings/contact/ContactEmailModal.vue';
	import ComponentContactPhoneModal from './../admin/settings/contact/ContactPhoneModal.vue';
	import ComponentDeleteModal from './DeleteModal.vue';
	import ComponentErrorModal from './ErrorModal.vue';
	import ComponentFAQAddQuestionModal from './../admin/pages/faq/AddQuestionModal.vue';
	import ComponentFAQDeleteQuestionModal from './../admin/pages/faq/DeleteQuestionModal.vue';
	import ComponentFAQEditQuestionModal from './../admin/pages/faq/EditQuestionModal.vue';
	import ComponentModalSpinner from './ModalSpinner.vue';
	import ComponentPhotoEditorModal from './photoEditor/PhotoEditorModal.vue';
	import ComponentResendVerifyEmailModal from './../admin/settings/contact/ResendVerifyEmailModal.vue';
	import ComponentRevokeNonprofitModal from './../admin/nonprofits/RevokeNonprofitModal.vue';
	import ComponentSenderEmailModal from './../admin/settings/contact/SenderEmailModal.vue';
	import ComponentToolkitAddResourceModal from './../admin/pages/toolkit/AddResourceModal.vue';
	import ComponentToolkitDeleteResourceModal from './../admin/pages/toolkit/DeleteResourceModal.vue';
	import ComponentToolkitEditResourceModal from './../admin/pages/toolkit/EditResourceModal.vue';
	import ComponentUserAccountInfoModal from './../account/UserAccountInfoModal.vue';
	import ComponentUserAccountPasswordModal from './../account/UserAccountPasswordModal.vue';

	export default {
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
			'spinner': ComponentModalSpinner,
			'account-edit-info': ComponentUserAccountInfoModal,
			'account-edit-password': ComponentUserAccountPasswordModal,
			'confirm-delete': ComponentDeleteModal,
			'error': ComponentErrorModal,
			'nonprofits-revoke': ComponentRevokeNonprofitModal,
			'photo-editor': ComponentPhotoEditorModal,
			'pages-faq-add-question-modal': ComponentFAQAddQuestionModal,
			'pages-faq-delete-question-modal': ComponentFAQDeleteQuestionModal,
			'pages-faq-edit-question-modal': ComponentFAQEditQuestionModal,
			'pages-toolkit-add-resource-modal': ComponentToolkitAddResourceModal,
			'pages-toolkit-delete-resource-modal': ComponentToolkitDeleteResourceModal,
			'pages-toolkit-edit-resource-modal': ComponentToolkitEditResourceModal,
			'settings-edit-contact-email': ComponentContactEmailModal,
			'settings-edit-contact-phone': ComponentContactPhoneModal,
			'settings-edit-sender-email': ComponentSenderEmailModal,
			'settings-resend-verify-email': ComponentResendVerifyEmailModal,
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