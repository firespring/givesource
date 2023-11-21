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
  <div class="o-app">
    <navigation />
    <main class="o-app__main o-app__main--compact">
      <div class="o-app_main-content o-app_main-content--md">
        <div class="o-app-main-content">
          <api-error v-model="apiError" />

          <div class="o-page-header">
            <div class="o-page-header__text">
              <nav class="o-page-header-nav c-breadcrumb">
                <span><router-link :to="{name: 'pages-list'}">Pages</router-link></span>
              </nav>
              <h1 class="o-page-header-title">
                FAQ
              </h1>
            </div>
          </div>

          <section class="c-page-section c-page-section--border c-page-section--shadow">
            <header class="c-page-section__header">
              <div class="c-page-section-header-text">
                <h2
                  id="section-segmented"
                  class="c-page-section-title"
                >
                  Questions &amp; Answers
                </h2>
                <div class="c-notes c-notes--below">
                  Manage your list of frequently asked questions and their answers.
                </div>
              </div>
            </header>

            <div class="c-page-section__main">
              <faq-list-table
                :contents="contents"
                @has-error="hasError"
              />

              <div class="c-table-footer">
                <div class="c-table-footer__actions">
                  <a
                    href="#"
                    role="button"
                    class="c-btn c-btn--good c-btn--icon c-btn--sm"
                    @click="addQuestion"
                  >
                    <i
                      class="fa fa-plus-circle"
                      aria-hidden="true"
                    />Add Question
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ComponentFAQListTable from './faq/FAQListTable.vue'

export default {
  components: {
    'faq-list-table': ComponentFAQListTable
  },
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      vue.$request.get('contents', {
        keys: ['FAQ_LIST']
      }).then(function (response) {
        response.data.sort(function (a, b) {
          return a.sortOrder - b.sortOrder
        })
        vue.contents = response.data
        vue.loaded = true
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    vue.loaded = false
    vue.$request.get('contents', {
      keys: ['FAQ_LIST']
    }).then(function (response) {
      response.data.sort(function (a, b) {
        return a.sortOrder - b.sortOrder
      })
      vue.contents = response.data
      vue.loaded = true
      next()
    }).catch(function () {
      next()
    })
  },
  data: function () {
    return {
      contents: [],
      loaded: false,
      apiError: {}
    }
  },
  created: function () {
    const vue = this

    vue.emitter.on('addFAQList', function (data) {
      vue.contents.push(data)
    })

    vue.emitter.on('deleteFAQList', function (data) {
      vue.contents = _.reject(vue.contents, { id: data.id })
    })

    vue.emitter.on('updateFAQList', function (data) {
      const index = _.findIndex(vue.contents, { id: data.id })
      vue.contents[index > -1 ? index : vue.contents.length] = data
    })
  },
  beforeUnmount: function () {
    const vue = this

    vue.emitter.off('addFAQList')
    vue.emitter.off('deleteFAQList')
    vue.emitter.off('updateFAQList')
  },
  methods: {
    addQuestion: function (event) {
      event.preventDefault()
      const vue = this

      vue.addModal('pages-faq-add-question-modal')
    },
    hasError: function (err) {
      const vue = this
      vue.apiError = err.response.data.errors
    }
  }
}
</script>
