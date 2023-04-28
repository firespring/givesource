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
  <tr>
    <td class="icon">
      <div class="c-drag-handle ui-sortable-handle" />
    </td>
    <td class="u-width-100p">
      <strong><a
        href="#"
        @click="editQuestion"
      >{{ question }}</a></strong>
      <div
        v-shave="40"
        class="c-notes c-notes--below c-notes--clipped"
        v-html="answer"
      />
    </td>
    <td class="icon">
      <a
        href="#"
        role="button"
        class="icon icon--bad"
        @click="deleteQuestion"
      ><i
        class="fa fa-minus-circle"
        aria-hidden="true"
      /></a>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    question: function () {
      if (this.content.hasOwnProperty('value')) {
        const question = _.find(this.content.value, { key: 'FAQ_LIST_ITEM_QUESTION' })
        if (question) {
          return question.value
        }
      }
      return null
    },
    answer: function () {
      if (this.content.hasOwnProperty('value')) {
        const answer = _.find(this.content.value, { key: 'FAQ_LIST_ITEM_ANSWER' })
        if (answer) {
          return answer.value
        }
      }
      return null
    }
  },
  methods: {
    editQuestion: function (event) {
      event.preventDefault()
      const vue = this

      vue.addModal('pages-faq-edit-question-modal', { content: vue.content })
    },
    deleteQuestion: function (event) {
      event.preventDefault()
      const vue = this

      vue.addModal('pages-faq-delete-question-modal', { content: vue.content })
    }
  }
}
</script>
