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
  <div v-if="modals.length">
    <div
      v-for="(modal, index) in modals"
      class="c-modal-overlay"
      :class="overlayClass(modal)"
      :style="{'z-index': calculateOverlayZIndex(index), display: 'block' }"
    />
    <component
      :is="modal"
      v-for="(modal, index) in modals"
      :key="index"
      :z-index="calculateModalZIndex(index)"
      :data="data[modal]"
    />
  </div>
</template>

<script>
import ComponentContactEmailModal from './../admin/settings/contact/ContactEmailModal.vue'
import ComponentContactPhoneModal from './../admin/settings/contact/ContactPhoneModal.vue'
import ComponentCustomPagesDeleteModal from './../admin/pages/custom/CustomPagesDeleteModal.vue'
import ComponentDeleteModal from './DeleteModal.vue'
import ComponentDonorReceiptModal from './../admin/donations/DonorReceiptModal.vue'
import ComponentDonorReceiptEmailModal from './../admin/donations/DonorReceiptEmailModal.vue'
import ComponentErrorModal from './ErrorModal.vue'
import ComponentFAQAddQuestionModal from './../admin/pages/faq/AddQuestionModal.vue'
import ComponentFAQDeleteQuestionModal from './../admin/pages/faq/DeleteQuestionModal.vue'
import ComponentFAQEditQuestionModal from './../admin/pages/faq/EditQuestionModal.vue'
import ComponentModalSpinner from './ModalSpinner.vue'
import ComponentPhotoEditorModal from './photoEditor/PhotoEditorModal.vue'
import ComponentResendVerifyEmailModal from './../admin/settings/contact/ResendVerifyEmailModal.vue'
import ComponentRevokeNonprofitModal from './../admin/nonprofits/RevokeNonprofitModal.vue'
import ComponentSenderEmailModal from './../admin/settings/contact/SenderEmailModal.vue'
import ComponentToolkitAddResourceModal from './../admin/pages/toolkit/AddResourceModal.vue'
import ComponentToolkitDeleteResourceModal from './../admin/pages/toolkit/DeleteResourceModal.vue'
import ComponentToolkitEditResourceModal from './../admin/pages/toolkit/EditResourceModal.vue'
import ComponentUserAccountInfoModal from './../account/UserAccountInfoModal.vue'
import ComponentUserAccountPasswordModal from './../account/UserAccountPasswordModal.vue'

export default {
  components: {
    spinner: ComponentModalSpinner,
    'account-edit-info': ComponentUserAccountInfoModal,
    'account-edit-password': ComponentUserAccountPasswordModal,
    'confirm-delete': ComponentDeleteModal,
    error: ComponentErrorModal,
    'donor-receipt-modal': ComponentDonorReceiptModal,
    'donor-receipt-email-modal': ComponentDonorReceiptEmailModal,
    'nonprofits-revoke': ComponentRevokeNonprofitModal,
    'photo-editor': ComponentPhotoEditorModal,
    'pages-custom-delete-modal': ComponentCustomPagesDeleteModal,
    'pages-faq-add-question-modal': ComponentFAQAddQuestionModal,
    'pages-faq-delete-question-modal': ComponentFAQDeleteQuestionModal,
    'pages-faq-edit-question-modal': ComponentFAQEditQuestionModal,
    'pages-toolkit-add-resource-modal': ComponentToolkitAddResourceModal,
    'pages-toolkit-delete-resource-modal': ComponentToolkitDeleteResourceModal,
    'pages-toolkit-edit-resource-modal': ComponentToolkitEditResourceModal,
    'settings-edit-contact-email': ComponentContactEmailModal,
    'settings-edit-contact-phone': ComponentContactPhoneModal,
    'settings-edit-sender-email': ComponentSenderEmailModal,
    'settings-resend-verify-email': ComponentResendVerifyEmailModal
  },
  data: function () {
    return {
      modals: [],
      data: {}
    }
  },
  created: function () {
    const vue = this

    /**
       * Add a modal to the top of the stack
       *
       * @param {String} modal
       */
    vue.emitter.on('addModal', function (options) {
      vue.modals.push(options.modal)
      vue.data[options.modal] = options.data || null
    })

    /**
       * Remove the top-most modal from the stack
       */
    vue.emitter.on('removeModal', function (options) {
      if (vue.modals.indexOf(options.modal) > -1) {
        vue.modals.splice(vue.modals.indexOf(options.modal), 1)
      } else if (vue.modals.length) {
        vue.modals = vue.modals.slice(0, -1)
      }
    })

    /**
       * Replace the top-most modal
       */
    vue.emitter.on('replaceModal', function (options) {
      if (vue.modals.length > 0) {
        vue.modals[vue.modals.length - 1] = options.modal
        vue.data[options.modal] = options.data || null
      } else {
        vue.modals.push(options.modal)
        vue.data[options.modal] = options.data || null
      }
    })

    /**
       * Clear all modals from the stack
       */
    vue.emitter.on('clearModals', function () {
      vue.modals = []
      vue.data = {}
    })
  },
  methods: {
    calculateOverlayZIndex: function (index) {
      return 999 + (index * 1000)
    },
    calculateModalZIndex: function (index) {
      return this.calculateOverlayZIndex(index) + 1
    },
    overlayClass: function (modal) {
      const vue = this
      return vue.data[modal] ? vue.data[modal].overlayClass : null
    }
  }
}
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
