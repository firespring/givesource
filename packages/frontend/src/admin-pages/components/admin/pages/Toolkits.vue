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
                Toolkits
              </h1>
            </div>
          </div>

          <form @submit="submit">
            <section class="c-page-section c-page-section--border c-page-section--shadow">
              <header class="c-page-section__header">
                <div class="c-page-section-header-text">
                  <h2 class="c-page-section-title">
                    Leading Text
                  </h2>
                  <div class="c-notes c-notes--below">
                    Add leading text to the toolkits page.
                  </div>
                </div>
              </header>

              <div class="c-page-section__main">
                <div class="c-form-item c-form-item--rich-text">
                  <div class="c-form-item__control">
                    <forms-ckeditor
                      id="additionalTextAbove"
                      v-model="formData.TOOLKIT_LEADING_TEXT.value"
                      :loaded="loaded"
                      type="advanced"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section class="c-page-section c-page-section--border c-page-section--shadow">
              <header class="c-page-section__header">
                <div class="c-page-section-header-text">
                  <h2
                    id="section-segmented"
                    class="c-page-section-title"
                  >
                    Resource List
                  </h2>
                  <div class="c-notes c-notes--below">
                    Manage your list of event resources (e.g., downloadable files and useful links)
                  </div>
                </div>
              </header>

              <div class="c-page-section__main">
                <toolkit-list-table
                  :contents="resourceContents"
                  @has-error="hasError"
                />

                <div class="c-table-footer">
                  <div class="c-table-footer__actions">
                    <a
                      href="#"
                      role="button"
                      class="c-btn c-btn--good c-btn--icon c-btn--sm"
                      @click="addResource"
                    >
                      <i
                        class="fa fa-plus-circle"
                        aria-hidden="true"
                      />Add Resource
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section class="c-page-section c-page-section--border c-page-section--shadow">
              <header class="c-page-section__header">
                <div class="c-page-section-header-text">
                  <h2 class="c-page-section-title">
                    Additional Text
                  </h2>
                  <div class="c-notes c-notes--below">
                    Add additional information about your event that people might find useful, such as event contacts (names, emails, phone numbers) and links to social media.
                  </div>
                </div>
              </header>

              <div class="c-page-section__main">
                <div class="c-form-item c-form-item--rich-text">
                  <div class="c-form-item__control">
                    <forms-ckeditor
                      id="additionalText"
                      v-model="formData.TOOLKIT_ADDITIONAL_TEXT.value"
                      :loaded="loaded"
                      type="advanced"
                    />
                  </div>
                </div>
              </div>
            </section>

            <footer class="c-form-actions">
              <button
                type="submit"
                class="c-btn"
              >
                Save Changes
              </button>
              <router-link
                :to="{name: 'pages-list'}"
                class="c-btn c-btn--neutral c-btn--text"
              >
                Cancel
              </router-link>
            </footer>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ComponentCKEditor from './../../forms/Ckeditor.vue'
import ComponentToolkitListTable from './toolkit/ToolkitListTable.vue'

export default {
  components: {
    'forms-ckeditor': ComponentCKEditor,
    'toolkit-list-table': ComponentToolkitListTable
  },
  beforeRouteEnter: function (to, from, next) {
    next(function (vue) {
      vue.$request.get('contents', {
        keys: ['TOOLKIT_RESOURCE_LIST', 'TOOLKIT_LEADING_TEXT', 'TOOLKIT_ADDITIONAL_TEXT']
      }).then(function (response) {
        response.data.sort(function (a, b) {
          return a.sortOrder - b.sortOrder
        })
        vue.contents = response.data
        vue.original = JSON.parse(JSON.stringify(response.data))
        vue.loaded = true
      }).catch(function (err) {
        vue.apiError = err.response.data.errors
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    const vue = this

    vue.loaded = false
    vue.$request.get('contents', {
      keys: ['TOOLKIT_RESOURCE_LIST', 'TOOLKIT_LEADING_TEXT', 'TOOLKIT_ADDITIONAL_TEXT']
    }).then(function (response) {
      response.data.sort(function (a, b) {
        return a.sortOrder - b.sortOrder
      })
      vue.contents = response.data
      vue.original = JSON.parse(JSON.stringify(response.data))
      vue.loaded = true
      next()
    }).catch(function (err) {
      vue.apiError = err.response.data.errors
      next()
    })
  },
  data: function () {
    return {
      contents: [],
      original: [],
      loaded: false,

      // Form Data
      formData: {
        TOOLKIT_ADDITIONAL_TEXT: {
          key: 'TOOLKIT_ADDITIONAL_TEXT',
          type: 'RICH_TEXT',
          value: '',
          id: 0
        },
        TOOLKIT_LEADING_TEXT: {
          key: 'TOOLKIT_LEADING_TEXT',
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
  computed: {
    resourceContents: function () {
      return _.filter(this.contents, { key: 'TOOLKIT_RESOURCE_LIST' })
    }
  },
  watch: {
    contents: {
      handler: function () {
        const vue = this
        if (vue.contents.length) {
          Object.keys(vue.formData).forEach(function (key) {
            const content = _.find(vue.contents, { key: key })
            if (content) {
              vue.formData[key] = content
            }
          })
        }
      },
      deep: true
    }
  },
  created: function () {
    const vue = this

    vue.bus.$on('addToolkitResourceList', function (data) {
      vue.contents.push(data)
    })

    vue.bus.$on('deleteToolkitResourceList', function (data) {
      vue.contents = _.reject(vue.contents, { id: data.id })
    })

    vue.bus.$on('updateToolkitResourceList', function (data) {
      const index = _.findIndex(vue.contents, { id: data.id })
      vue.contents[index > -1 ? index : vue.contents.length] = data
    })
  },
  beforeDestroy: function () {
    const vue = this

    vue.bus.$off('addToolkitResourceList')
    vue.bus.$off('deleteToolkitResourceList')
    vue.bus.$off('updateToolkitResourceList')
  },
  methods: {
    submit: function (event) {
      event.preventDefault()
      const vue = this

      vue.addModal('spinner')
      vue.updateContents()
    },
    updateContents: function () {
      const vue = this

      const created = []
      const changed = _.differenceWith(vue.contents, vue.original, _.isEqual)
      const toUpdate = _.reject(changed, { value: '' })
      const toDelete = _.filter(changed, { value: '' })
      Object.keys(vue.formData).forEach(function (key) {
        if (!_.find(vue.original, { key: key }) && vue.formData[key].value !== '') {
          created.push(vue.formData[key])
        }
      })

      let promise = Promise.resolve()
      if (created.length) {
        created.forEach(function (content) {
          promise = promise.then(function () {
            return vue.$request.post('contents', content)
          })
        })
      }

      if (toUpdate.length) {
        promise = promise.then(function () {
          return vue.$request.patch('contents', {
            contents: toUpdate.map(function (content) {
              return _.pick(content, ['key', 'sortOrder', 'type', 'id', 'value'])
            })
          })
        })
      }

      if (toDelete.length) {
        promise = promise.then(function () {
          return vue.$request.delete('contents', {
            contents: toDelete
          })
        })
      }

      promise.then(function () {
        vue.clearModals()
        vue.$router.push({ name: 'pages-list' })
      }).catch(function (err) {
        vue.clearModals()
        vue.apiError = err.response.data.errors
      })
    },
    addResource: function (event) {
      event.preventDefault()
      const vue = this

      vue.addModal('pages-toolkit-add-resource-modal')
    },
    hasError: function (err) {
      const vue = this
      vue.apiError = err.response.data.errors
    }
  }
}
</script>
