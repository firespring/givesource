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
        ></i>
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
        ></i>
        Add Bulk Donation
      </router-link>
      <a
        v-on:click.prevent="exportReport('DONATIONS')"
        href="#"
        role="button"
        class="c-btn c-btn--sm c-btn--icon"
      ><i
        class="fa fa-cloud-download"
        aria-hidden="true"
      ></i>Export Donations</a>
      <a
        v-on:click.prevent="donorReceipt"
        href="#"
        role="button"
        class="c-btn c-btn--sm c-btn--icon"
      ><i
        class="fa fa-file-text"
        aria-hidden="true"
      ></i>Donor Receipt</a>
      <a
        v-if="isSuperAdmin"
        v-on:click.prevent="exportReport('PAYOUT_REPORT')"
        href="#"
        role="button"
        class="c-btn c-btn--sm c-btn--icon c-btn--good"
      ><i
        class="fa fa-cloud-download"
        aria-hidden="true"
      ></i>Export Payout Report</a>
      <a
        v-if="isSuperAdmin"
        v-on:click.prevent="exportReport('LAST_4_REPORT')"
        href="#"
        role="button"
        class="c-btn c-btn--sm c-btn--icon c-btn--good"
      ><i
        class="fa fa-cloud-download"
        aria-hidden="true"
      ></i>Export Last 4 CC Report</a>
    </div>
  </div>
</template>

<script>
export default {

  data () {
    return {
      report: {},
      file: {},
      downloaded: false,

      countdown: null
    }
  },

  computed: {
    isSuperAdmin: function () {
      return this.isSuperAdminUser();
    }
  },

  methods: {
    exportReport (exportType) {
      const vm = this

      vm.addModal('spinner')

      vm.$request.post('reports', {
        type: exportType,
        name: exportType.toLowerCase()
      }).then(response => {
        vm.report = response.data
        vm.pollReport()
      }).catch(err => {
        vm.clearModals()
        vm.$emit('hasError', err)
      })
    },

    pollReport () {
      const vm = this

      if (vm.downloaded) {
        vm.clearModals()
        vm.downloadFile()

      } else {
        vm.countdown = setInterval(() => {
          vm.$store.commit('generateCacheKey')
          vm.$request.get('reports/' + vm.report.id).then(response => {
            vm.report = response.data
            if (vm.report.status === 'SUCCESS') {
              vm.clearModals()
              clearTimeout(vm.countdown)

              if (!vm.downloaded) {
                vm.downloadFile()
              }
            } else if (vm.report.status === 'FAILED') {
              vm.clearModals()
              clearTimeout(vm.countdown)
              console.log('Report failed to generate')
            }
          }).catch(err => {
            vm.clearModals()
            vm.$emit('hasError', err)
          })
        }, 1000)
      }
    },

    downloadFile () {
      const vm = this
      let downloadPath
      let promise = Promise.resolve()
      if (!vm.downloaded) {
        promise = promise.then(() => {
          return vm.$request.get('files/download/' + vm.report.fileId)
        }).then(response => {
          downloadPath = response.data.download_url
          vm.file = response.data.file
          vm.downloaded = true
        })
      }
      promise = promise.then(() => {
        if (downloadPath) {
          window.location.href = downloadPath
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