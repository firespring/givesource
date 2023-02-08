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
  <div
    id="modal-confirm-delete"
    class="c-modal c-modal--warning c-modal--sm"
    :style="{ 'z-index': zIndex, display: 'block' }"
  >
    <div class="c-modal__contents">
      <!-- BEGIN modal-dialog -->
      <div class="c-modal-dialog">
        <!-- BEGIN modal-dialog__contents -->
        <div class="c-modal-dialog__contents">
          <!-- BEGIN modal-header -->
          <div class="c-modal-header">
            <h1>{{ modalTitle }}</h1>
          </div>
          <!-- END modal-header -->

          <!-- BEGIN modal-content -->
          <div class="c-modal-content">
            <div class="c-page-section">
              <div class="c-page-section__main">
                <p>
                  {{ modalText }}
                </p>
              </div>
            </div>

            <div class="c-modal-footer">
              <div class="c-modal-footer__actions">
                <button
                  type="button"
                  class="c-btn c-btn--bad js-modal-close"
                  @click="remove"
                >
                  Yes, Delete Them
                </button>
                <button
                  type="button"
                  class="c-btn c-btn--neutral c-btn--text js-modal-close"
                  @click="cancel"
                >
                  No, Keep Them
                </button>
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
export default {
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
        callback: String
      }
    }
  },
  data: function () {
    return {
      modalTitle: this.data.modalTitle,
      modalText: this.data.modalText,
      callback: this.data.callback
    }
  },
  methods: {
    cancel: function () {
      const vue = this
      vue.clearModals()
    },
    remove: function () {
      const vue = this
      vue.clearModals()
      vue.bus.$emit(vue.callback)
    }
  }
}
</script>
