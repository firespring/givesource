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
    id="modal-faq-add"
    class="c-modal c-modal--warning"
    :style="{ 'z-index': zIndex, display: 'block' }"
  >
    <div class="c-modal__contents">
      <div class="c-modal-dialog">
        <div class="c-modal-dialog__contents">
          <div class="c-modal-header">
            <h1>Add FAQ Question & Answer</h1>
          </div>

          <div class="c-modal-content">
            <div class="c-page-section">
              <div class="c-page-section__main">
                <api-error v-model="apiError" />

                <div class="c-form-item c-form-item--text c-form-item--required">
                  <div class="c-form-item__label">
                    <label
                      for="questionText"
                      class="c-form-item-label-text"
                    >Question</label>
                  </div>
                  <div class="c-form-item__control">
                    <input
                      id="questionText"
                      v-model="formData.FAQ_LIST_ITEM_QUESTION.value"
                      v-auto-focus
                      type="text"
                      name="questionText"
                      :class="{'has-error': formErrors['FAQ_LIST_ITEM_QUESTION.value']}"
                    >
                    <div
                      v-if="formErrors['FAQ_LIST_ITEM_QUESTION.value']"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors['FAQ_LIST_ITEM_QUESTION.value'] }}
                    </div>
                  </div>
                </div>

                <div class="c-form-item c-form-item--rich-text c-form-item--required">
                  <div class="c-form-item__label">
                    <label
                      for="questionAnswer"
                      class="c-form-item-label-text"
                    >Answer</label>
                  </div>
                  <div class="c-form-item__control">
                    <forms-ckeditor
                      id="questionAnswer"
                      v-model="formData.FAQ_LIST_ITEM_ANSWER.value"
                      type="advanced"
                      :has-error="formErrors['FAQ_LIST_ITEM_ANSWER.value']"
                    />
                    <div
                      v-if="formErrors['FAQ_LIST_ITEM_ANSWER.value']"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors['FAQ_LIST_ITEM_ANSWER.value'] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="c-modal-footer">
              <div class="c-modal-footer__actions">
                <button
                  type="button"
                  class="c-btn"
                  @click="save"
                >
                  Save &amp; Close
                </button>
                <button
                  type="button"
                  class="c-btn c-btn--neutral c-btn--text"
                  @click="cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentCKEditor from './../../../forms/Ckeditor.vue'

export default {
  components: {
    'forms-ckeditor': ComponentCKEditor
  },
  props: {
    zIndex: {
      type: [Number, String],
      default: 1000
    },
    data: {
      type: Object,
      default: {}
    }
  },
  data: function () {
    return {
      // Form Data
      formData: {
        FAQ_LIST_ITEM_QUESTION: {
          key: 'FAQ_LIST_ITEM_QUESTION',
          type: 'TEXT',
          value: '',
          id: 0
        },
        FAQ_LIST_ITEM_ANSWER: {
          key: 'FAQ_LIST_ITEM_ANSWER',
          type: 'RICH_TEXT',
          value: '',
          id: 0
        }
      },

      // Errors
      formErrors: {},
      apiError: {}
    }
  },
  watch: {
    formData: {
      handler: function () {
        const vue = this
        if (Object.keys(vue.formErrors).length) {
          vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
        }
      },
      deep: true
    }
  },
  methods: {
    getConstraints: function () {
      return {
        'FAQ_LIST_ITEM_QUESTION.value': {
          label: 'Question',
          presence: true
        },
        'FAQ_LIST_ITEM_ANSWER.value': {
          label: 'Answer',
          presence: true
        }
      }
    },
    cancel: function () {
      this.clearModals()
    },
    save: function () {
      const vue = this

      vue.addModal('spinner')
      vue.formErrors = vue.validate(vue.formData, vue.getConstraints())
      if (Object.keys(vue.formErrors).length) {
        vue.removeModal()
      } else {
        vue.saveContents()
      }
    },
    saveContents: function () {
      const vue = this

      let faqListContent = {}
      vue.$request.post('contents', {
        key: 'FAQ_LIST',
        type: 'COLLECTION'
      }).then(function (response) {
        faqListContent = response.data[0]
        return vue.$request.patch('contents', {
          contents: Object.keys(vue.formData).map(function (key) {
            const content = vue.formData[key]
            content.parentId = faqListContent.id
            return content
          })
        })
      }).then(function () {
        faqListContent.value = Object.keys(vue.formData).map(function (key) {
          return vue.formData[key]
        })
        vue.bus.$emit('addFAQList', faqListContent)
        vue.clearModals()
      }).catch(function (err) {
        vue.removeModal('spinner')
        vue.apiError = err.response.data.errors
      })
    }
  }
}
</script>
