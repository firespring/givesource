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
    <td>
      <div class="u-flex">
        <div class="u-flex-expand">
          <strong v-if="canEditNonprofitDetails">
            <router-link :to="{ name: 'nonprofit-settings-manage-organization', params: { nonprofitId: nonprofit.id } }">{{ nonprofit.legalName }}</router-link>
          </strong>
          <strong v-else>{{ nonprofit.legalName }}</strong>
          <div class="c-notes">
            Tax ID: {{ nonprofit.taxId }}
          </div>
        </div>

        <div
          id="paymentStatus"
          class="u-margin-left-thick"
        >
          <div
            v-if="statusLabel"
            class="c-label c-label--neutral"
            :class="statusLabelClass"
          >
            <i
              class="fa"
              :class="statusIconClass"
              aria-hidden="true"
            /> {{ statusLabel }}
          </div>
        </div>
      </div>
    </td>

    <td class="u-nowrap u-text-r">
      <div class="date">
        {{ date }}
      </div>
      <div class="time">
        {{ time }}
      </div>
    </td>

    <td
      v-if="canAcceptDonations"
      class="u-nowrap u-text-r"
    >
      <router-link :to="{ name: 'nonprofit-donations-list', params: { nonprofitId: nonprofit.id } }">
        {{ donationAmount }}
      </router-link>
    </td>
    <td
      v-else
      class="u-nowrap u-text-r"
    >
      {{ donationAmount }}
    </td>

    <td>
      <div
        v-if="canModify"
        ref="cBtnDropdown"
        class="c-btn-dropdown c-btn-dropdown--r"
        @mouseout="closeMenu"
        @mouseover="cancelCloseMenu"
      >
        <a
          href="#"
          role="button"
          class="c-btn c-btn--sm c-btn-dropdown-trigger c-btn-dropdown-trigger--only js-btn-dropdown-trigger"
          @click="toggleMenu"
        />

        <div
          ref="cBtnDropdownMenu"
          class="c-btn-dropdown-menu"
        >
          <div class="c-btn-dropdown-menu__options">
            <a
              v-if="canChangeStatus"
              href="#"
              @click.prevent="updateStatus('DENIED')"
            ><i
              class="fa fa-fw fa-ban"
              aria-hidden="true"
            />Deny Nonprofit</a>
            <a
              v-if="canChangeStatus"
              href="#"
              @click.prevent="updateStatus('ACTIVE')"
            ><i
              class="fa fa-fw fa-check-circle"
              aria-hidden="true"
            />Activate Nonprofit</a>

            <hr v-if="canChangeStatus && canEditNonprofitDetails">

            <router-link
              v-if="canEditNonprofitDetails"
              :to="{ name: 'nonprofit-settings-list', params: { nonprofitId: nonprofit.id } }"
            >
              <i
                class="fa fa-fw fa-gear"
                aria-hidden="true"
              />Manage Settings
            </router-link>
            <router-link
              v-if="canEditNonprofitDonationPage"
              :to="{ name: 'nonprofit-your-page', params: { nonprofitId: nonprofit.id } }"
            >
              <i
                class="fa fa-fw fa-gear"
                aria-hidden="true"
              />Manage Donation Page
            </router-link>

            <a
              v-if="canDeleteNonprofit"
              href="#"
              class="js-modal-trigger"
              rel="modal-confirm-delete"
            >
              <i
                class="fa fa-fw fa-trash"
                aria-hidden="true"
              />Delete Nonprofit
            </a>

            <hr v-if="canRevoke">
            <a
              v-if="canRevoke"
              href="#"
              @click.prevent="revokeNonprofit"
            ><i
              class="fa fa-fw fa-ban"
              aria-hidden="true"
            />Revoke Nonprofit</a>

            <hr v-if="statusUrl501c3">
            <a
              v-if="statusUrl501c3"
              target="_blank"
              rel="noopener noreferrer"
              :href="statusUrl501c3"
            ><i
              class="fa fa-fw fa-check"
              aria-hidden="true"
            />Check 501c3 Status</a>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
const numeral = require('numeral')

export default {
  props: {
    nonprofit: { type: Object, default: () => null }
  },
  emits: ['update-nonprofit', 'has-error'],
  data: function () {
    return {
      displayingMenu: false,
      timer: null,
      apiError: {}
    }
  },
  computed: {
    date: function () {
      return new Date(this.nonprofit.createdAt).toLocaleDateString()
    },
    time: function () {
      return new Date(this.nonprofit.createdAt).toLocaleTimeString()
    },
    donationAmount: function () {
      return numeral(this.nonprofit.donationsSubtotal / 100).format('$0,0.00')
    },
    canAcceptDonations: function () {
      return this.nonprofit.status === 'ACTIVE'
    },
    canChangeStatus: function () {
      return this.nonprofit.status === 'PENDING'
    },
    canDeleteNonprofit: function () {
      return this.nonprofit.status === 'DENIED'
    },
    canEditNonprofitDetails: function () {
      return this.nonprofit.status === 'ACTIVE' || this.nonprofit.status === 'PENDING'
    },
    canEditNonprofitDonationPage: function () {
      return this.nonprofit.status === 'ACTIVE'
    },
    canRevoke: function () {
      return this.nonprofit.status === 'ACTIVE'
    },
    canModify: function () {
      return this.nonprofit.status !== 'REVOKED'
    },
    statusLabelClass: function () {
      switch (this.nonprofit.status) {
        case 'ACTIVE':
          return 'c-label--good'
        case 'PENDING':
          return 'c-label--neutral'
        default:
          return 'c-label--bad'
      }
    },
    statusIconClass: function () {
      switch (this.nonprofit.status) {
        case 'ACTIVE':
          return 'fa-check-circle'
        case 'PENDING':
          return 'fa-question-circle'
        default:
          return 'fa-ban'
      }
    },
    statusLabel: function () {
      switch (this.nonprofit.status) {
        case 'ACTIVE':
          return 'Active'
        case 'PENDING':
          return 'Pending'
        case 'DENIED':
          return 'Denied'
        case 'REVOKED':
          return 'Revoked'
      }
      return false
    },

    statusUrl501c3: function () {
      const vm = this
      return 'https://501c3lookup.org/search/?qs=search&qsEIN=' + vm.nonprofit.taxId
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
    updateStatus: function (status) {
      const vue = this

      vue.addModal('spinner')

      vue.$request.patch('nonprofits/' + vue.nonprofit.id + '/status', {
        status: status
      }).then(function () {
        vue.clearModals()
        vue.$emit('update-nonprofit', vue.nonprofit.id)
      }).catch(function (err) {
        vue.clearModals()
        vue.$emit('has-error', err)
      })
    },
    revokeNonprofit: function () {
      const vue = this
      vue.addModal('nonprofits-revoke', { nonprofit: vue.nonprofit })
    }
  }
}
</script>
