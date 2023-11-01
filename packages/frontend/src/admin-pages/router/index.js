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

import * as User from './../helpers/user'
import * as Utils from './../helpers/utils'
import Component404 from './../components/errors/404.vue'
import ComponentAbout from './../components/admin/pages/About.vue'
import ComponentAddAgreement from './../components/admin/settings/agreements/AddAgreement.vue'
import ComponentAgreementsSettings from './../components/admin/settings/agreements/AgreementsSettings.vue'
import ComponentAnalytics from './../components/admin/settings/analytics/Analytics.vue'
import ComponentAppearance from './../components/admin/settings/appearance/Appearance.vue'
import ComponentCheckout from './../components/admin/pages/Checkout.vue'
import ComponentContactSettings from './../components/admin/settings/contact/ContactSettings.vue'
import ComponentContactUs from './../components/admin/pages/ContactUs.vue'
import ComponentCustomPagesAdd from '../components/admin/pages/custom/CustomPagesAdd.vue'
import ComponentCustomPagesEdit from '../components/admin/pages/custom/CustomPagesEdit.vue'
import ComponentDonationsAdd from './../components/admin/donations/DonationsAdd.vue'
import ComponentDonationsAddBulk from './../components/admin/donations/DonationsAddBulk.vue'
import ComponentDonationsList from './../components/admin/donations/DonationsList.vue'
import ComponentDonorReceipt from './../components/admin/donations/DonorReceipt.vue'
import ComponentEmailSettings from './../components/admin/settings/emails/EmailSettings.vue'
import ComponentEventSettings from './../components/admin/settings/event/EventSettings.vue'
import ComponentFAQ from './../components/admin/pages/FAQ.vue'
import ComponentForgotPassword from './../components/auth/forgotPassword/ForgotPassword.vue'
import ComponentForgotPasswordEmailSent from './../components/auth/forgotPassword/ForgotPasswordEmailSent.vue'
import ComponentForgotPasswordForm from './../components/auth/forgotPassword/ForgotPasswordForm.vue'
import ComponentForgotPasswordResetForm from './../components/auth/forgotPassword/ForgotPasswordResetForm.vue'
import ComponentHomepage from './../components/admin/pages/Homepage.vue'
import ComponentLogin from './../components/auth/login/Login.vue'
import ComponentLogout from './../components/auth/Logout.vue'
import ComponentManageAdmins from './../components/admin/settings/manageAdmins/ManageAdmins.vue'
import ComponentManageAdminsInvite from './../components/admin/settings/manageAdmins/ManageAdminsInvite.vue'
import ComponentNonprofitDonationNotifications from './../components/nonprofit/settings/donationNotifications/DonationNotifications.vue'
import ComponentNonprofitDonationsList from './../components/nonprofit/donations/DonationsList.vue'
import ComponentNonprofitManageAdmins from './../components/nonprofit/settings/manageAdmins/ManageAdmins.vue'
import ComponentNonprofitManageAdminsInvite from './../components/nonprofit/settings/manageAdmins/ManageAdminsInvite.vue'
import ComponentNonprofitManageOrganization from './../components/nonprofit/settings/manageOrganization/ManageOrganization.vue'
import ComponentNonprofitPhotosEdit from './../components/nonprofit/yourPage/media/PhotosEdit.vue'
import ComponentNonprofitRequestNameChange from './../components/nonprofit/settings/requestNameChange/RequestNameChange.vue'
import ComponentNonprofitsAdd from './../components/admin/nonprofits/NonprofitsAdd.vue'
import ComponentNonprofitSettingsList from './../components/nonprofit/settings/SettingsList.vue'
import ComponentNonprofitSocialSharing from './../components/nonprofit/settings/socialSharing/SocialSharing.vue'
import ComponentNonprofitsList from './../components/admin/nonprofits/NonprofitsList.vue'
import ComponentNonprofitVideosAdd from './../components/nonprofit/yourPage/media/VideosAdd.vue'
import ComponentNonprofitVideosEdit from './../components/nonprofit/yourPage/media/VideosEdit.vue'
import ComponentNonprofitYourPage from './../components/nonprofit/yourPage/YourPage.vue'
import ComponentPagesList from './../components/admin/pages/PagesList.vue'
import ComponentPaymentGatewaySettings from './../components/admin/settings/paymentGateway/PaymentGatewaySettings.vue'
import ComponentRegister from './../components/admin/pages/Register.vue'
import ComponentSeoSettings from './../components/admin/settings/seo/SeoSettings.vue'
import ComponentSettingsList from './../components/admin/settings/SettingsList.vue'
import ComponentSocialSharing from './../components/admin/settings/socialSharing/SocialSharing.vue'
import ComponentSponsorAdd from './../components/admin/sponsorTiers/sponsors/SponsorAdd.vue'
import ComponentSponsorEdit from './../components/admin/sponsorTiers/sponsors/SponsorEdit.vue'
import ComponentSponsorsList from './../components/admin/sponsorTiers/sponsors/SponsorsList.vue'
import ComponentSponsorTiersAdd from './../components/admin/sponsorTiers/SponsorsTiersAdd.vue'
import ComponentSponsorTiersEdit from './../components/admin/sponsorTiers/SponsorsTiersEdit.vue'
import ComponentSponsorTiersList from './../components/admin/sponsorTiers/SponsorsTiersList.vue'
import ComponentTerms from './../components/admin/pages/Terms.vue'
import ComponentToolkits from './../components/admin/pages/Toolkits.vue'
import ComponentUserAccount from './../components/account/UserAccount.vue'
import Request from './../helpers/request'
import store from './../store'
import { getCurrentInstance } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  hashbang: false,
  linkActiveClass: 'here',
  base: __dirname,
  scrollBehavior: function (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'homepage',
      props: true,
      beforeEnter: function (to, from, next) {
        if (User.isAuthenticated()) {
          if (router.app.user.groups.indexOf('SuperAdmin') > -1 || router.app.user.groups.indexOf('Admin') > -1) {
            next({ name: 'donations-list' })
          } else {
            next({
              name: 'nonprofit-donations-list',
              params: {
                nonprofitId: router.app.user.nonprofitId
              }
            })
          }
        } else {
          next()
        }
      }
    },
    {
      path: '/donations',
      name: 'donations-list',
      component: ComponentDonationsList,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/donations/add',
      name: 'donations-add',
      component: ComponentDonationsAdd,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/donations/add-bulk',
      name: 'donations-add-bulk',
      component: ComponentDonationsAddBulk,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/donations/receipt',
      name: 'donations-receipt',
      component: ComponentDonorReceipt,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      },
      beforeEnter (to, from, next) {
        if (store.state.receipt && store.state.donorEmail) {
          next()
        } else {
          if (from.name) {
            next({ name: from.name })
          } else {
            next({ name: 'homepage' })
          }
        }
      }
    },
    {
      path: '/nonprofits',
      name: 'nonprofits-list',
      component: ComponentNonprofitsList,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/nonprofits/add',
      name: 'add-nonprofit',
      component: ComponentNonprofitsAdd,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },

    // Admin - Pages
    {
      path: '/pages',
      name: 'pages-list',
      component: ComponentPagesList,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/pages/homepage',
      name: 'pages-homepage',
      component: ComponentHomepage,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/pages/checkout',
      name: 'pages-checkout',
      component: ComponentCheckout,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/pages/contact-us',
      name: 'pages-contact-us',
      component: ComponentContactUs,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/pages/register',
      name: 'pages-register',
      component: ComponentRegister,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/pages/about',
      name: 'pages-about',
      component: ComponentAbout,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/pages/faq',
      name: 'pages-faq',
      component: ComponentFAQ,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/pages/toolkits',
      name: 'pages-toolkits',
      component: ComponentToolkits,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/pages/terms',
      name: 'pages-terms',
      component: ComponentTerms,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/pages/custom',
      name: 'pages-custom-add',
      component: ComponentCustomPagesAdd,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/pages/custom/:pageId',
      name: 'pages-custom-edit',
      props: true,
      component: ComponentCustomPagesEdit,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },

    // Admin - Settings
    {
      path: '/settings',
      name: 'settings-list',
      component: ComponentSettingsList,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/settings/agreements',
      name: 'settings-agreements',
      component: ComponentAgreementsSettings,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/settings/agreements/add',
      name: 'settings-add-agreement',
      component: ComponentAddAgreement,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/settings/event',
      name: 'settings-event',
      component: ComponentEventSettings,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/settings/contact',
      name: 'settings-contact',
      component: ComponentContactSettings,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/settings/site-appearance',
      name: 'settings-site-appearance',
      component: ComponentAppearance,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/settings/emails',
      name: 'settings-emails',
      component: ComponentEmailSettings,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/settings/payment-gateway',
      name: 'settings-payment-gateway',
      component: ComponentPaymentGatewaySettings,
      meta: {
        allowedGroups: ['SuperAdmin']
      }
    },
    {
      path: '/settings/google-analytics',
      name: 'settings-analytics',
      component: ComponentAnalytics,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/settings/admins',
      name: 'settings-admins-list',
      component: ComponentManageAdmins,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/settings/admins/invite',
      name: 'settings-admins-invite',
      component: ComponentManageAdminsInvite,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/settings/social-sharing',
      name: 'settings-social-sharing',
      component: ComponentSocialSharing,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/settings/seo',
      name: 'settings-seo',
      component: ComponentSeoSettings,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },

    // Sponsors
    {
      path: '/sponsor-tiers',
      name: 'sponsor-tiers-list',
      component: ComponentSponsorTiersList,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/sponsor-tiers/add',
      name: 'sponsor-tiers-add',
      component: ComponentSponsorTiersAdd,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/sponsor-tiers/:sponsorTierId',
      name: 'sponsor-tiers-edit',
      props: true,
      component: ComponentSponsorTiersEdit,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/sponsor-tiers/:sponsorTierId/sponsors',
      name: 'sponsors-list',
      props: true,
      component: ComponentSponsorsList,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/sponsor-tiers/:sponsorTierId/add',
      name: 'sponsors-add',
      props: true,
      component: ComponentSponsorAdd,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },
    {
      path: '/sponsor-tiers/:sponsorTierId/sponsors/:sponsorId',
      name: 'sponsors-edit',
      props: true,
      component: ComponentSponsorEdit,
      meta: {
        allowedGroups: ['SuperAdmin', 'Admin']
      }
    },

    // Nonprofit - Donations
    {
      path: '/nonprofits/:nonprofitId/donations',
      name: 'nonprofit-donations-list',
      props: true,
      component: ComponentNonprofitDonationsList,
      meta: {
        nonprofitStatus: ['ACTIVE'],
        validateNonprofitId: true
      }
    },

    // Nonprofit - Settings
    {
      path: '/nonprofits/:nonprofitId/settings',
      name: 'nonprofit-settings-list',
      props: true,
      component: ComponentNonprofitSettingsList,
      meta: {
        nonprofitStatus: ['ACTIVE', 'PENDING'],
        validateNonprofitId: true
      }
    },
    {
      path: '/nonprofits/:nonprofitId/settings/manage-organization',
      name: 'nonprofit-settings-manage-organization',
      props: true,
      component: ComponentNonprofitManageOrganization,
      meta: {
        nonprofitStatus: ['ACTIVE', 'PENDING'],
        validateNonprofitId: true
      }
    },
    {
      path: '/nonprofits/:nonprofitId/settings/donation-notifications',
      name: 'nonprofit-settings-donation-notifications',
      props: true,
      component: ComponentNonprofitDonationNotifications,
      meta: {
        nonprofitStatus: ['ACTIVE', 'PENDING'],
        validateNonprofitId: true
      }
    },
    {
      path: '/nonprofits/:nonprofitId/settings/admins',
      name: 'nonprofit-settings-admins-list',
      props: true,
      component: ComponentNonprofitManageAdmins,
      meta: {
        nonprofitStatus: ['ACTIVE', 'PENDING'],
        validateNonprofitId: true
      }
    },
    {
      path: '/nonprofits/:nonprofitId/settings/admins/invite',
      name: 'nonprofit-settings-admins-invite',
      props: true,
      component: ComponentNonprofitManageAdminsInvite,
      meta: {
        nonprofitStatus: ['ACTIVE'],
        validateNonprofitId: true
      }
    },
    {
      path: '/nonprofits/:nonprofitId/settings/request-name-change',
      name: 'nonprofit-settings-request-name-change',
      props: true,
      component: ComponentNonprofitRequestNameChange,
      meta: {
        nonprofitStatus: ['ACTIVE'],
        validateNonprofitId: true
      }
    },
    {
      path: '/nonprofits/:nonprofitId/settings/social-sharing',
      name: 'nonprofit-settings-social-sharing',
      props: true,
      component: ComponentNonprofitSocialSharing,
      meta: {
        nonprofitStatus: ['ACTIVE'],
        validateNonprofitId: true
      }
    },

    // Nonprofit - Your Page
    {
      path: '/nonprofits/:nonprofitId/your-page',
      name: 'nonprofit-your-page',
      props: true,
      component: ComponentNonprofitYourPage,
      meta: { validateNonprofitId: true }
    },
    {
      path: '/nonprofits/:nonprofitId/your-page/media/videos/add',
      name: 'nonprofit-your-page-media-videos-add',
      props: true,
      component: ComponentNonprofitVideosAdd,
      meta: {
        nonprofitStatus: ['ACTIVE'],
        validateNonprofitId: true
      }
    },
    {
      path: '/nonprofits/:nonprofitId/your-page/media/videos/:slideId',
      name: 'nonprofit-your-page-media-videos-edit',
      props: true,
      component: ComponentNonprofitVideosEdit,
      meta: {
        nonprofitStatus: ['ACTIVE'],
        validateNonprofitId: true
      }
    },
    {
      path: '/nonprofits/:nonprofitId/your-page/media/photos/:slideId',
      name: 'nonprofit-your-page-media-photos-edit',
      props: true,
      component: ComponentNonprofitPhotosEdit,
      meta: {
        nonprofitStatus: ['ACTIVE'],
        validateNonprofitId: true
      }
    },

    // User Account
    {
      path: '/account',
      name: 'user-account',
      component: ComponentUserAccount
    },

    // Authentication
    {
      path: '/login',
      name: 'login',
      component: ComponentLogin,
      meta: { requiresAuth: false },
      beforeEnter: function (to, from, next) {
        if (User.isAuthenticated()) {
          if (to.query && to.query.redirect) {
            next(to.query.redirect)
          } else {
            next({ name: 'homepage' })
          }
        }
        next()
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: ComponentLogout
    },
    {
      path: '/forgot-password',
      component: ComponentForgotPassword,
      children: [
        {
          path: '/',
          name: 'forgot-password',
          component: ComponentForgotPasswordForm,
          meta: { requiresAuth: false },
          beforeEnter: function (to, from, next) {
            if (User.isAuthenticated()) {
              next({ name: 'homepage' })
            }
            next()
          }
        },
        {
          path: 'sent',
          name: 'forgot-password-request-sent',
          component: ComponentForgotPasswordEmailSent,
          meta: { requiresAuth: false },
          beforeEnter: function (to, from, next) {
            if (User.isAuthenticated()) {
              next({ name: 'homepage' })
            }
            next()
          }
        },
        {
          path: 'reset',
          name: 'forgot-password-reset',
          component: ComponentForgotPasswordResetForm,
          meta: { requiresAuth: false },
          beforeEnter: function (to, from, next) {
            if (User.isAuthenticated()) {
              next({ name: 'homepage' })
            }
            next()
          }
        }
      ]
    },

    // Error Pages
    {
      path: '/:catchAll(.*)',
      name: '404',
      component: Component404,
      meta: { requiresAuth: false }
    }
  ]
})

/**
 * Update app settings
 *
 * @return {Promise}
 */
const updateSettings = function () {
  const settings = [
    'EVENT_URL',
    'UPLOADS_CLOUD_FRONT_URL',
    'USER_POOL_CLIENT_ID',
    'USER_POOL_ID'
  ]

  return axios.get('/settings.json').then(function (response) {
    window.API_URL = response.data.API_URL
    store.commit('settings', { API_URL: response.data.API_URL })
  }).then(function () {
    return axios.get(API_URL + 'settings' + Utils.generateQueryString({
      keys: settings
    })).then(function (response) {
      if (response.data.length) {
        response.data.forEach(function (setting) {
          const set = {}
          set[setting.key] = setting.value
          store.commit('settings', set)
        })
      }
    })
  }).then(function () {
    store.commit('updated')
  })
}

/**
 * Load app settings
 *
 * @return {Promise}
 */
const loadSettings = function () {
  const date = new Date()
  date.setMinutes(date.getMinutes() - 1)

  const lastUpdated = store.getters.updated
  if (lastUpdated === 0 || lastUpdated <= date.getTime()) {
    return updateSettings()
  } else {
    window.API_URL = store.getters.setting('API_URL')
    return Promise.resolve()
  }
}

/**
 * Load authenticated user
 *
 * @return {Promise}
 */
const loadUser = function () {
  const request = new Request()
  const Vue = getCurrentInstance()
  return request.get('user-profile').then(function (response) {
    Vue.prototype.user = response.data
  })
}

/**
 * Authentication middleware
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 */
const authMiddleware = function (to, from, next) {
  const requiresAuth = to.meta.hasOwnProperty('requiresAuth') ? to.meta.requiresAuth : true
  if (requiresAuth && !User.isAuthenticated()) {
    User.refreshSession(function (err) {
      if (err) {
        const params = { path: '/login' }
        if (to.fullPath !== '/logout') {
          params.query = { redirect: to.fullPath }
        }
        next(params)
      } else {
        next()
      }
    })
  } else {
    next()
  }
}

/**
 * Validate nonprofit status
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 * @return {Promise}
 */
const nonprofitStatusMiddleware = function (to, from, next) {
  if (User.isAuthenticated() && to.meta.hasOwnProperty('nonprofitStatus') && to.params.hasOwnProperty('nonprofitId')) {
    const request = new Request()
    return request.get('nonprofits/' + to.params.nonprofitId).then(function (response) {
      const nonprofit = response.data
      const allowed = (to.meta.nonprofitStatus instanceof Array) ? to.meta.nonprofitStatus : [to.meta.nonprofitStatus]
      if (_.intersection(allowed, [nonprofit.status]).length === 0) {
        next({ name: '404' })
      } else {
        next()
      }
    })
  } else {
    next()
  }
}

/**
 * Validate nonprofit middleware
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 */
const nonprofitMiddleware = function (to, from, next) {
  if (User.isAuthenticated() && to.meta.hasOwnProperty('validateNonprofitId') && to.params.hasOwnProperty('nonprofitId')) {
    if (_.intersection(router.app.user.groups, ['SuperAdmin', 'Admin']).length === 0 && parseInt(router.app.user.nonprofitId) !== parseInt(to.params.nonprofitId)) {
      next({ name: '404' })
    } else {
      next()
    }
  } else {
    next()
  }
}

/**
 * Groups middleware
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 */
const groupsMiddleware = function (to, from, next) {
  if (User.isAuthenticated() && to.meta.hasOwnProperty('allowedGroups') && _.intersection(router.app.user.groups, to.meta.allowedGroups).length === 0) {
    next({ name: '404' })
  } else {
    next()
  }
}

/**
 * Load user middleware
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 */
const loadUserMiddleware = function (to, from, next) {
  if (User.isAuthenticated()) {
    loadUser().then(function () {
      next()
    }).catch(function (err) {
      console.log(err)
      next(false)
    })
  } else {
    next()
  }
}

/**
 * Load settings middleware
 *
 * @param {{}} to
 * @param {{}} from
 * @param {function} next
 */
const loadSettingsMiddleware = function (to, from, next) {
  loadSettings().then(function () {
    next()
  }).catch(function (err) {
    console.log(err)
    next(false)
  })
}

/**
 * Route Middleware
 */
router.beforeEach(loadSettingsMiddleware)
router.beforeEach(authMiddleware)
router.beforeEach(loadUserMiddleware)
router.beforeEach(nonprofitStatusMiddleware)
router.beforeEach(nonprofitMiddleware)
router.beforeEach(groupsMiddleware)

export default router
