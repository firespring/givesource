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
  <div class="o-menubar">
    <div class="o-menubar__primary">
      <div class="o-branding">
        <router-link
          :to="logoLink"
          class="u-flex u-items-center"
        >
          <div class="o-branding__logo">
            <img
              alt="Givesource Logo"
              src="/assets/img/logo-givesource.png"
              class="logo"
            >
          </div>
        </router-link>
      </div>

      <div class="o-user">
        <div
          ref="oMenubarPopupParent"
          class="o-user__current o-menubar-popup-parent"
          @mouseout="closeMenu"
          @mouseover="cancelCloseMenu"
        >
          <a
            href="#"
            class="js-user-popup-toggle has-tooltip"
            title="Manage Your Account"
            @click="toggleMenu"
          >
            <v-gravatar
              :email="email"
              :size="150"
              default-img="mm"
              :alt="gravatarAlt"
              class="o-user__avatar"
            />
          </a>
          <div
            ref="oMenubarPopup"
            class="o-menubar-popup o-menubar-popup--current-user"
          >
            <div
              v-if="firstName"
              class="o-menubar-popup__header o-current-user"
            >
              <div class="o-current-user-info">
                <div class="account-user-name">
                  <strong>{{ firstName }} {{ lastName }}</strong>
                </div>
              </div>
            </div>

            <nav class="o-menubar-popup__nav">
              <ul>
                <li>
                  <router-link :to="{name: 'user-account'}">
                    <i
                      class="fa fa-fw fa-user"
                      aria-hidden="true"
                    />Your Account
                  </router-link>
                </li>
              </ul>
              <ul>
                <li>
                  <router-link :to="{ name: 'logout' }">
                    <i
                      class="fa fa-fw fa-sign-out"
                      aria-hidden="true"
                    />Sign Out
                  </router-link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <component
      :is="isAdmin ? 'navigation-admin' : 'navigation-nonprofit'"
      :nonprofit-id="nonprofitId"
    />
  </div>
</template>

<script>
import ComponentNavigationAdmin from './NavigationAdmin.vue'
import ComponentNavigationNonprofits from './NavigationNonprofits.vue'

export default {
  components: {
    'navigation-admin': ComponentNavigationAdmin,
    'navigation-nonprofit': ComponentNavigationNonprofits
  },
  props: {
    nonprofitId: { type: [String, Number], default: null }
  },
  data: function () {
    return {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      gravatarAlt: this.user.firstName && this.user.lastName ? this.user.firstName + ' ' + this.user.lastName : 'Avatar',
      navigationComponent: 'navigation-nonprofit',

      displayingMenu: false,
      timer: null
    }
  },
  computed: {
    isAdmin: function () {
      return this.isSuperAdminUser() || this.isAdminUser()
    },
    logoLink: function () {
      if (!this.isAdmin && this.nonprofitId) {
        return { name: 'nonprofit-donations-list', params: { nonprofitId: this.nonprofitId } }
      }
      return { name: 'donations-list' }
    }
  },
  created: function () {
    const vue = this

    vue.emitter.on('userAccountUpdateInfo', function (data) {
      vue.firstName = data.firstName
      vue.lastName = data.lastName
    })
  },
  beforeDestroy: function () {
    const vue = this

    vue.emitter.off('userAccountUpdateInfo')
  },
  beforeMount: function () {
    document.body.classList.add('has-menubar', 'has-menubar--secondary')
  },
  methods: {
    toggleMenu: function (event) {
      event.preventDefault()
      const vue = this
      if (vue.displayingMenu) {
        $(vue.$refs.oMenubarPopupParent).removeClass('o-menubar-popup-parent--active')
        $(vue.$refs.oMenubarPopup).fadeOut(200)
      } else {
        $(vue.$refs.oMenubarPopupParent).addClass('o-menubar-popup-parent--active')
        $(vue.$refs.oMenubarPopup).fadeIn(200)
      }
      vue.displayingMenu = !vue.displayingMenu
    },
    closeMenu: function () {
      const vue = this
      vue.timer = setTimeout(function () {
        $(vue.$refs.oMenubarPopupParent).removeClass('o-menubar-popup-parent--active')
        $(vue.$refs.oMenubarPopup).fadeOut(200)
        vue.displayingMenu = false
      }, 500)
    },
    cancelCloseMenu: function () {
      const vue = this
      clearTimeout(vue.timer)
    }
  }
}
</script>
