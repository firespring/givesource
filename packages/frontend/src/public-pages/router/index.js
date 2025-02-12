/*
 * Copyright 2019 Firespring, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as Utils from './../helpers/utils'
import * as Settings from './../helpers/settings'
import Component404 from './../components/errors/404.vue'
import ComponentAbout from './../components/about/About.vue'
import ComponentCart from './../components/cart/Cart.vue'
import ComponentCartResponse from './../components/cart/response/CartResponse.vue'
import ComponentContact from './../components/contact/Contact.vue'
import ComponentContactResponse from './../components/contact/response/ContactResponse.vue'
import ComponentCustomPage from './../components/pages/CustomPage.vue'
import ComponentFAQ from './../components/faq/FAQ.vue'
import ComponentHomepage from './../components/homepage/Homepage.vue'
import ComponentLeaderboard from './../components/leaderboard/Leaderboard.vue'
import ComponentNonprofit from './../components/nonprofits/Nonprofit.vue'
import ComponentRegister from './../components/register/Register.vue'
import ComponentRegisterResponse from './../components/register/response/RegisterResponse.vue'
import ComponentSearchResults from './../components/search/SearchResults.vue'
import ComponentSitemap from './../components/sitemap/Sitemap.vue'
import ComponentTermsOfService from './../components/terms/TermsOfService.vue'
import ComponentToolkits from './../components/toolkits/Toolkits.vue'
import store from './../store'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  hashbang: false,
  linkActiveClass: 'here',
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return { selector: to.hash }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: ComponentHomepage,
      meta: {
        title: 'Home',
        inSitemap: true
      }
    },
    {
      path: '/index',
      redirect: '/',
      meta: { inSitemap: false }
    },
    {
      path: '/index.html',
      redirect: '/',
      meta: { inSitemap: false }
    },
    {
      path: '/about',
      name: 'about',
      component: ComponentAbout,
      meta: {
        title: 'About',
        inSitemap: true },
      beforeEnter (to, from, next) {
        if (!store.getters.booleanSetting('PAGE_ABOUT_ENABLED')) {
          next({ name: '404' })
        } else {
          next()
        }
      }
    },
    {
      path: '/toolkits',
      name: 'toolkits',
      component: ComponentToolkits,
      meta: {
        title: 'Toolkits',
        inSitemap: true },
      beforeEnter (to, from, next) {
        if (!store.getters.booleanSetting('PAGE_TOOLKIT_ENABLED')) {
          next({ name: '404' })
        } else {
          next()
        }
      }
    },
    {
      path: '/faq',
      name: 'faq',
      component: ComponentFAQ,
      meta: {
        title: 'FAQ',
        inSitemap: true },
      beforeEnter (to, from, next) {
        if (!store.getters.booleanSetting('PAGE_FAQ_ENABLED')) {
          next({ name: '404' })
        } else {
          next()
        }
      }
    },
    {
      path: '/cart',
      name: 'cart',
      component: ComponentCart,
      meta: { inSitemap: true }
    },
    {
      path: '/cart/thank-you',
      name: 'cart-response',
      component: ComponentCartResponse,
      meta: { inSitemap: false }
    },
    {
      path: '/contact',
      name: 'contact',
      component: ComponentContact,
      meta: { inSitemap: true }
    },
    {
      path: '/contact/thank-you',
      name: 'contact-response',
      component: ComponentContactResponse,
      meta: { inSitemap: false }
    },
    {
      path: '/terms',
      name: 'terms',
      component: ComponentTermsOfService,
      meta: { inSitemap: true },
      beforeEnter (to, from, next) {
        if (!store.getters.booleanSetting('PAGE_TERMS_ENABLED')) {
          next({ name: '404' })
        } else {
          next()
        }
      }
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: ComponentLeaderboard,
      meta: { inSitemap: true },
      beforeEnter (to, from, next) {
        if (!Settings.isDuringEvent() && !Settings.isAfterEvent()) {
          next({ name: '404' })
        } else {
          next()
        }
      }
    },
    {
      path: '/search',
      name: 'search-results',
      component: ComponentSearchResults,
      meta: { inSitemap: false }
    },
    {
      path: '/register',
      name: 'register',
      component: ComponentRegister,
      meta: { inSitemap: true }
    },
    {
      path: '/register/thank-you',
      name: 'register-response',
      component: ComponentRegisterResponse,
      meta: { inSitemap: false }
    },
    {
      path: '/nonprofits/:slug',
      name: 'nonprofit-landing-page',
      props: true,
      meta: {
        nonprofit: null
      },
      component: ComponentNonprofit,
      beforeEnter (to, from, next) {
        axios.get(API_URL + 'nonprofits/pages/' + to.params.slug).then(response => {
          if (Object.keys(response.data).length) {
            to.meta.nonprofit = response.data
            next()
          } else {
            next({ name: '404' })
          }
        }).catch(() => {
          next({ name: '404' })
        })
      }
    },
    {
      path: '/sitemap',
      name: 'sitemap',
      component: ComponentSitemap,
      meta: { inSitemap: true }
    },

    // Custom Pages
    {
      path: '/:catchAll(.*)',
      name: 'custom-page',
      meta: {
        page: null
      },
      component: ComponentCustomPage,
      beforeEnter (to, from, next) {
        const pages = store.getters.pages
        const slug = to.path

        pages.forEach((page) => {
          if (slug === '/' + page.slug) {
            to.meta.page = page
          }
        })

        if (to.meta.page && to.meta.page.enabled) {
          to.meta.inSitemap = true
          next()
        } else {
          to.meta.inSitemap = false
          next({ name: '404' })
        }
      }
    },

    // Error Pages
    {
      path: '/:catchAll(.*)',
      name: '404',
      component: Component404
    }
  ]
})

/**
 * Load custom pages middleware
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 */
const loadCustomPages = (to, from, next) => {
  let promise = Promise.resolve()
  const setting = store.getters.setting('CUSTOM_PAGES') || ''
  const uuids = setting.split('|')

  if (uuids.length) {
    const pages = []
    const contentKeys = []
    const settingKeys = []

    const contentList = [
      'CUSTOM_PAGE_SLUG',
      'CUSTOM_PAGE_TITLE',
      'CUSTOM_PAGE_TEXT'
    ]

    const settingList = [
      'CUSTOM_PAGE_ENABLED'
    ]

    uuids.forEach((uuid) => {
      const identifier = uuid.toUpperCase().replace(/-/g, '_')
      contentList.forEach((key) => {
        contentKeys.push(key + '_' + identifier)
      })
      settingList.forEach((key) => {
        settingKeys.push(key + '_' + identifier)
      })
    })

    let contents = []
    let settings = []

    promise = promise.then(() => {
      return axios.get(API_URL + 'contents' + Utils.generateQueryString({
        keys: contentKeys
      }))
    }).then((response) => {
      contents = response.data

      return axios.get(API_URL + 'settings' + Utils.generateQueryString({
        keys: settingKeys
      }))
    }).then((response) => {
      settings = response.data
    }).then(() => {
      uuids.forEach((uuid) => {
        const page = {
          enabled: false,
          identifier: uuid.toUpperCase().replace(/-/g, '_'),
          slug: null,
          text: null,
          title: null,
          uuid: uuid
        }

        contents.forEach((content) => {
          if (content.key.indexOf(page.identifier) > -1) {
            Object.keys(page).forEach((key) => {
              if (content.key.indexOf(key.toUpperCase()) > -1) {
                page[key] = content.value
              }
            })
          }
        })

        settings.forEach((setting) => {
          if (setting.key.indexOf(page.identifier) > -1) {
            Object.keys(page).forEach((key) => {
              if (setting.key.indexOf(key.toUpperCase()) > -1) {
                page[key] = setting.value
              }
            })
          }
        })

        pages.push(page)
      })

      store.commit('pages', pages)
    })
  }

  promise.then(() => {
    next()
  }).catch(err => {
    console.log(err)
    next(false)
  })
}

/**
 * Update app settings
 *
 * @return {Promise}
 */
const updateSettings = () => {
  const settings = {
    ADMIN_URL: null,
    CONTACT_PHONE: null,
    CUSTOM_PAGES: null,
    DATE_DONATIONS_END: null,
    DATE_DONATIONS_START: null,
    DATE_EVENT_END: null,
    DATE_EVENT_START: null,
    DATE_REGISTRATIONS_END: null,
    DATE_REGISTRATIONS_START: null,
    EVENT_LOGO: null,
    EVENT_TIMEZONE: null,
    EVENT_TITLE: null,
    FAVICON: null,
    FOUNDATION_LOGO: null,
    FOUNDATION_URL: null,
    GOOGLE_ANALYTICS_TRACKING_ID: null,
    MASTHEAD_IMAGE: null,
    PAGE_ABOUT_ENABLED: null,
    PAGE_FAQ_ENABLED: null,
    PAGE_TERMS_ENABLED: null,
    PAGE_TOOLKIT_ENABLED: null,
    PAYMENT_GATEWAY_TRANSACTION_FEE_FLAT_RATE: null,
    PAYMENT_GATEWAY_TRANSACTION_FEE_PERCENTAGE: null,
    RECAPTCHA_KEY: null,
    SEO_DESCRIPTION: null,
    SOCIAL_SHARING_DESCRIPTION: null,
    UPLOADS_CLOUD_FRONT_URL: null
  }

  const files = {
    EVENT_LOGO: null,
    FAVICON: null,
    FOUNDATION_LOGO: null,
    MASTHEAD_IMAGE: null
  }

  return axios.get('/settings.json').then(response => {
    if (response.data && response.data.API_URL) {
      window.API_URL = response.data.API_URL
      store.commit('settings', { API_URL: response.data.API_URL })
      return axios.get(response.data.API_URL + 'settings' + Utils.generateQueryString({
        keys: Object.keys(settings)
      }))
    }
    return Promise.reject(new Error('Unable to retrieve api url.'))
  }).then(response => {
    if (response.data) {
      response.data.forEach(setting => {
        if (settings.hasOwnProperty(setting.key)) {
          settings[setting.key] = setting.value
        }
      })
    }

    Object.keys(files).forEach(key => {
      if (settings.hasOwnProperty(key) && settings[key]) {
        files[key] = settings[key]
      }
    })

    const values = Object.keys(files).map(key => files[key])
    if (_.compact(values).length) {
      return axios.get(API_URL + 'files' + Utils.generateQueryString({
        fileIds: _.compact(values)
      }))
    }

    return Promise.resolve({})
  }).then(response => {
    if (response.data) {
      response.data.forEach(file => {
        Object.keys(files).forEach(key => {
          if (parseInt(files[key]) === parseInt(file.id)) {
            settings[key] = settings.UPLOADS_CLOUD_FRONT_URL + '/' + file.path
          }
        })
      })
    }

    store.commit('settings', settings)
    store.commit('updated')
  })
}

let initialSettingsLoaded = false

/**
 * Load settings, fetch updated settings every minute.
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 */
const loadSettings = (to, from, next) => {
  const date = new Date()
  const lastUpdated = store.getters.updated
  date.setMinutes(date.getMinutes() - 1)

  let promise = Promise.resolve()
  if (!initialSettingsLoaded || lastUpdated === 0 || lastUpdated <= date.getTime()) {
    const initialApiUrl = store.getters.setting('API_URL')
    promise = updateSettings()
    if (!initialSettingsLoaded) {
      promise.then(() => {
        const currentApiUrl = store.getters.setting('API_URL')
        if (initialApiUrl !== currentApiUrl) {
          if (!initialApiUrl) {
            // clearCartItems or just refresh nonprofits at cart page ?
            // store.commit('clearCartItems')
          } else {
            store.commit('clearCartItems')
          }
        }
      })
      initialSettingsLoaded = true
    }
  } else {
    window.API_URL = store.getters.setting('API_URL')
  }

  promise.then(() => {
    next()
  }).catch(err => {
    console.log(err)
    next(false)
  })
}

/**
 * Route Middleware
 */
router.beforeEach(loadSettings)
router.beforeEach(loadCustomPages)

export default router
