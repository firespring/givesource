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
  <div class="c-header-actions">
    <div>
      <router-link
        :to="{ name: 'donations-add' }"
        role="button"
        class="c-btn c-btn--sm c-btn--icon"
      >
        <i
          class="fa fa-plus-circle"
          aria-hidden="true"
        />
        Add Single Donation
      </router-link>
      <router-link
        :to="{ name: 'donations-add-bulk' }"
        role="button"
        class="c-btn c-btn--sm c-btn--icon"
      >
        <i
          class="fa fa-plus-circle"
          aria-hidden="true"
        />
        Add Bulk Donation
      </router-link>
      <a
        href="#"
        role="button"
        class="c-btn c-btn--sm c-btn--icon"
        @click.prevent="exportReport('DONATIONS')"
      ><i
        class="fa fa-cloud-download"
        aria-hidden="true"
      />Export Donations</a>
      <a
        href="#"
        role="button"
        class="c-btn c-btn--sm c-btn--icon"
        @click.prevent="donorReceipt"
      ><i
        class="fa fa-file-text"
        aria-hidden="true"
      />Donor Receipt</a>
    </div>
    <div
      v-if="isSuperAdmin"
      ref="cBtnDropdown"
      class="c-btn-dropdown"
      @mouseout="closeMenu"
      @mouseover="cancelCloseMenu"
    >
      <a
        href="#"
        role="button"
        class="c-btn c-btn--sm c-btn--neutral c-btn-dropdown-trigger c-btn-dropdown-trigger--only"
        @click.prevent="toggleMenu"
      ><span>Internal</span></a>
      <div
        ref="cBtnDropdownMenu"
        class="c-btn-dropdown-menu"
      >
        <div class="c-btn-dropdown-menu__options">
          <a
            href="#"
            @click.prevent="exportReport('PAYOUT_REPORT')"
          >Export Payout Report</a>
          <a
            href="#"
            @click.prevent="exportReport('LAST_4_REPORT')"
          >Export Last 4 CC Report</a>
          <a
            href="#"
            @click.prevent="exportReport('NONPROFIT_USERS')"
          >Export Nonprofits Report</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['has-error'],
  data () {
    return {
      displayingMenu: false
    }
  },

  computed: {
    isSuperAdmin: function () {
      return this.isSuperAdminUser()
    }
  },

  methods: {
    toggleMenu: function (event) {
      const vm = this
      if (vm.displayingMenu) {
        $(vm.$refs.cBtnDropdown).removeClass('c-btn-dropdown--active')
        $(vm.$refs.cBtnDropdownMenu).fadeOut()
      } else {
        $(vm.$refs.cBtnDropdown).addClass('c-btn-dropdown--active')
        $(vm.$refs.cBtnDropdownMenu).fadeIn()
      }
      vm.displayingMenu = !vm.displayingMenu
    },
    closeMenu: function () {
      const vm = this
      vm.timer = setTimeout(function () {
        $(vm.$refs.cBtnDropdown).removeClass('c-btn-dropdown--active')
        $(vm.$refs.cBtnDropdownMenu).fadeOut()
        vm.displayingMenu = false
      }, 250)
    },
    cancelCloseMenu: function () {
      const vm = this
      clearTimeout(vm.timer)
    },
    exportReport (exportType) {
      const vm = this

      vm.addModal('spinner')

      vm.$request.post('reports', {
        type: exportType,
        name: exportType.toLowerCase()
      }).then(response => {
        vm.pollReport(response.data)
      }).catch(err => {
        vm.clearModals()
        vm.$emit('has-error', err)
      })
    },

    async pollReport (report) {
      const vm = this
      if (report.status === 'SUCCESS') {
        vm.clearModals()
        vm.downloadFile(report)
      } else if (report.status === 'FAILED') {
        vm.clearModals()
        console.log('Report failed to generate')
      } else {
        vm.$store.commit('generateCacheKey')
        await new Promise(resolve => setTimeout(resolve, 1000))
        const response = await vm.$request.get('reports/' + report.id)
        return vm.pollReport(response.data)
      }
    },

    downloadFile (report) {
      const vm = this
      vm.$request.get('files/download/' + report.fileId).then(response => {
        if (response.data.download_url) {
          window.location.href = response.data.download_url
        }
      })
    },

    donorReceipt () {
      const vm = this
      vm.addModal('donor-receipt-modal')
    }
  }
}
</script>
