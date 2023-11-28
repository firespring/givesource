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
    <td class="image">
      <vue-gravatar
        :email="adminUser.email"
        :size="150"
        default-img="mm"
      />
    </td>
    <td>
      <div class="c-user-strip u-flex u-items-center">
        <div class="c-user-strip__content u-flex u-items-center">
          <div class="c-user-strip__name">
            <strong>{{ adminUser.firstName }} {{ adminUser.lastName }}</strong>
          </div>
          <div class="c-user-strip__email u-icon u-flex u-items-center">
            <a :href="'mailto:' + adminUser.email">{{ adminUser.email }}</a>
          </div>
        </div>
      </div>
    </td>
    <td class="u-nowrap u-text-r">
      <div class="date">
        {{ formattedDate }}
      </div>
    </td>
    <td class="u-nowrap">
      <div
        v-if="!isSuperAdmin"
        ref="cBtnDropdown"
        class="c-btn-dropdown c-btn-dropdown--r"
        @mouseout="closeMenu"
        @mouseover="cancelCloseMenu"
      >
        <a
          href="#"
          role="button"
          class="c-btn c-btn--sm c-btn-dropdown-trigger c-btn-dropdown-trigger--only"
          @click="toggleMenu"
        />
        <div
          ref="cBtnDropdownMenu"
          class="c-btn-dropdown-menu"
        >
          <div
            v-if="!adminUser.isVerified"
            class="c-btn-dropdown-menu__options"
          >
            <a
              href="#"
              @click.prevent="resendVerificationEmail"
            >
              <i
                class="fa fa-fw fa-envelope"
                aria-hidden="true"
              />Resend Verification Email
            </a>
          </div>
          <div class="c-btn-dropdown-menu__options">
            <a
              href="#"
              @click.prevent="removeUser"
            >
              <i
                class="fa fa-fw fa-minus-circle"
                aria-hidden="true"
              />Remove
            </a>
          </div>
        </div>
      </div>
      <span v-else>(Administrator)</span>
    </td>
  </tr>
</template>

<script>

export default {
  props: {
    adminUser: { type: Object, default: () => null }
  },
  data: function () {
    return {
      displayingMenu: false,
      selectedAdminUser: this.adminUser,
      timer: null
    }
  },
  computed: {
    formattedDate: function () {
      return new Date(this.adminUser.createdAt).toLocaleDateString()
    },
    isSuperAdmin: function () {
      return _.includes(this.adminUser.groups, 'SuperAdmin')
    }
  },
  methods: {
    toggleMenu: function (event) {
      event.preventDefault()
      const vue = this
      if (vue.displayingMenu) {
        $(vue.$refs.cBtnDropdown).removeClass('c-btn-dropdown--active')
        $(vue.$refs.cBtnDropdownMenu).fadeOut()
      } else {
        $(vue.$refs.cBtnDropdown).addClass('c-btn-dropdown--active')
        $(vue.$refs.cBtnDropdownMenu).fadeIn()
      }
      vue.displayingMenu = !vue.displayingMenu
    },
    closeMenu: function () {
      const vue = this
      vue.timer = setTimeout(function () {
        $(vue.$refs.cBtnDropdown).removeClass('c-btn-dropdown--active')
        $(vue.$refs.cBtnDropdownMenu).fadeOut()
        vue.displayingMenu = false
      }, 250)
    },
    cancelCloseMenu: function () {
      const vue = this
      clearTimeout(vue.timer)
    },
    removeUser: function () {
      const vue = this
      vue.bus.$emit('deleteUserAdminModal', vue.selectedAdminUser)
    },
    resendVerificationEmail: function () {
      const vue = this

      vue.addModal('spinner')
      vue.$request.post('users/' + vue.adminUser.id + '/resend-verification-email').then(function () {
        vue.clearModals()
      }).catch(function (err) {
        console.log(err)
        vue.clearModals()
      })
    }
  }
}
</script>
