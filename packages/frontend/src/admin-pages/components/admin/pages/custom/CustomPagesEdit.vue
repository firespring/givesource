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
                Edit Page
              </h1>
            </div>
          </div>

          <form @submit.prevent="submit">
            <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
              <header class="c-page-section__header">
                <div class="c-page-section-header-text">
                  <h2 class="c-page-section-title">
                    Page Info
                  </h2>
                </div>
                <div class="c-page-section-header-actions">
                  <a
                    href="#"
                    role="button"
                    class="c-btn c-btn--xs c-btn--flat c-btn--text c-btn--icon"
                    @click.prevent="deletePage"
                  >
                    <i
                      class="fa fa-trash"
                      aria-hidden="true"
                    />Delete Page
                  </a>
                </div>
              </header>

              <div class="c-page-section__main">
                <div
                  class="c-form-item c-form-item--text c-form-item--required"
                  :class="{ 'c-form-item--has-error': formErrors['PAGE_TITLE.value'] }"
                >
                  <div class="c-form-item__label">
                    <label
                      for="pageTitle"
                      class="c-form-item-label-text"
                    >Page Title</label>
                  </div>
                  <div class="c-form-item__control">
                    <input
                      id="pageTitle"
                      v-model="formData.PAGE_TITLE.value"
                      v-auto-focus
                      type="text"
                      name="pageTitle"
                      :class="{ 'has-error': formErrors['PAGE_TITLE.value'] }"
                    >
                    <div
                      v-if="formErrors['PAGE_TITLE.value']"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors['PAGE_TITLE.value'] }}
                    </div>

                    <div
                      v-if="isEditingSlug"
                      class="c-notes c-notes--below u-flex u-items-center"
                    >
                      <div class="u-margin-right-xs">
                        <strong>Page URL:</strong> {{ pageLink }}
                      </div>
                      <div class="u-margin-right-xs">
                        <input
                          id="slug"
                          v-model="formData.PAGE_SLUG.value"
                          type="text"
                          name="slug"
                          class="xs"
                          @change="slugMask"
                        >
                      </div>
                      <div>
                        <a
                          href="#"
                          role="button"
                          class="c-btn c-btn--xs c-btn--text"
                          @click.prevent="cancelEditSlug"
                        >Cancel</a>
                      </div>
                    </div>
                    <div
                      v-else
                      class="c-notes c-notes--below u-flex u-items-center"
                    >
                      <div class="u-margin-right-xs">
                        <strong>Page URL:</strong> {{ pageLink }}{{ formData.PAGE_SLUG.value }}
                      </div>
                      <div>
                        <a
                          href="#"
                          role="button"
                          class="c-btn c-btn--xs c-btn--flat"
                          @click.prevent="editSlug"
                        >Edit</a>
                      </div>
                    </div>

                    <div
                      v-if="formErrors['PAGE_SLUG.value']"
                      class="c-notes c-notes--below c-notes--bad c-form-control-error"
                    >
                      {{ formErrors['PAGE_SLUG.value'] }}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
              <header class="c-page-section__header">
                <div class="c-page-section-header-text">
                  <h2 class="c-page-section-title">
                    Page Text
                  </h2>
                </div>
              </header>

              <div class="c-page-section__main">
                <div class="c-form-item c-form-item--rich-text">
                  <div class="c-form-item__control">
                    <forms-ckeditor
                      id="pageText"
                      v-model="formData.PAGE_TEXT.value"
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
import { getContentKeys, getSettingKeys } from './../../../../helpers/content'
import ComponentCKEditor from './../../../forms/Ckeditor.vue'
import Request from './../../../../helpers/request'

const slug = require('slug')

/**
   * Pre-loaded data
   *
   * @param {String} id
   * @returns {Promise}
   */
const fetchData = (id) => {
  const request = new Request()
  const contentKeys = getContentKeys(id)
  const settingKeys = getSettingKeys(id)
  settingKeys.push('CUSTOM_PAGES')

  let settings = []
  return request.get('settings', {
    keys: settingKeys
  }).then((response) => {
    settings = response.data
    return request.get('contents', {
      keys: contentKeys
    })
  }).then((response) => {
    return {
      contents: response.data,
      settings: settings
    }
  })
}

export default {
  components: {
    'forms-ckeditor': ComponentCKEditor
  },
  beforeRouteEnter (to, from, next) {
    fetchData(to.params.pageId).then((data) => {
      next((vm) => {
        vm.contents = data.contents
        vm.settings = data.settings
        vm.loaded = true
      })
    })
  },
  props: {
    pageId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      contents: [],
      isEditingSlug: false,
      loaded: false,
      settings: [],

      formData: {
        PAGE_TITLE: {
          key: 'CUSTOM_PAGE_TITLE',
          type: 'TEXT',
          value: '',
          id: 0
        },
        PAGE_SLUG: {
          key: 'CUSTOM_PAGE_SLUG',
          type: 'TEXT',
          value: '',
          id: 0
        },
        PAGE_TEXT: {
          key: 'CUSTOM_PAGE_TEXT',
          type: 'RICH_TEXT',
          value: '',
          id: 0
        }
      },

      // errors
      formErrors: {},
      apiError: {}
    }
  },
  computed: {
    pageLink () {
      return this.$store.getters.setting('EVENT_URL') + '/'
    }
  },
  watch: {
    formData: {
      handler () {
        const vm = this
        if (Object.keys(vm.formErrors).length) {
          vm.formErrors = vm.validate(vm.formData, vm.getConstraints())
        }

        if (!vm.isEditingSlug) {
          vm.formData.PAGE_SLUG.value = vm.formData.PAGE_SLUG.value !== vm.formData.PAGE_TITLE.value ? slug(vm.formData.PAGE_SLUG.value, { lower: true }) : slug(vm.formData.PAGE_TITLE.value, { lower: true })
        }
      },
      deep: true
    },
    contents: {
      handler () {
        const vm = this
        if (vm.contents.length) {
          Object.keys(vm.formData).forEach((key) => {
            vm.contents.forEach((content) => {
              if (content.key.includes(key)) {
                const localContent = _.cloneDeep(content)
                localContent.key = key
                vm.formData[key] = localContent
              }
            })
          })
        }
      },
      deep: true
    }
  },
  created () {
    const vm = this

    vm.emitter.on('deletePage', () => {
      vm.$router.push({ name: 'pages-list' })
    })
  },
  beforeUnmount () {
    const vm = this

    vm.emitter.off('deletePage')
  },
  methods: {
    getConstraints () {
      return {
        'PAGE_TITLE.value': {
          label: 'Page Title',
          presence: true
        },
        'PAGE_SLUG.value': {
          label: 'Page URL',
          presence: true,
          exclusion: [
            'about',
            'cart',
            'contact',
            'faq',
            'index',
            'leaderboard',
            'nonprofits',
            'register',
            'search',
            'terms',
            'toolkits'
          ]
        }
      }
    },
    submit () {
      const vm = this

      vm.addModal('spinner')

      vm.formErrors = vm.validate(vm.formData, vm.getConstraints())
      if (Object.keys(vm.formErrors).length) {
        vm.clearModals()
        vm.scrollToError()
      } else {
        vm.updatePage()
      }
    },
    updatePage () {
      const vm = this

      Object.keys(vm.formData).forEach((key) => {
        vm.contents.forEach((content) => {
          if (content.key.includes(key)) {
            content.value = vm.formData[key].value
          }
        })
      })

      vm.$request.patch('contents', {
        contents: vm.contents
      }).then(() => {
        vm.clearModals()
        vm.$router.push({ name: 'pages-list' })
      }).catch((err) => {
        vm.clearModals()
        vm.apiError = err.response.data.errors
      })
    },
    deletePage () {
      const vm = this

      vm.addModal('pages-custom-delete-modal', {
        contents: vm.contents,
        settings: vm.settings,
        pageId: vm.pageId
      })
    },
    editSlug () {
      this.isEditingSlug = true
    },
    cancelEditSlug () {
      const vm = this

      const identifier = vm.pageId.toUpperCase().replace(/-/g, '_')
      const content = _.find(vm.contents, { key: 'CUSTOM_PAGE_SLUG_' + identifier })

      vm.formData.PAGE_SLUG.value = content.value
      vm.isEditingSlug = false
    },
    slugMask (event) {
      this.formData.PAGE_SLUG.value = slug(event.target.value, { lower: true })
    },
    hasError (err) {
      this.apiError = err.response.data.errors
    }
  }
}
</script>
