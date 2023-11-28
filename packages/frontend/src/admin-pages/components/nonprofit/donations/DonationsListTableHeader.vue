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
      <a
        href="#"
        role="button"
        class="c-btn c-btn--sm c-btn--icon"
        @click.prevent="exportDonations"
      ><i
        class="fa fa-cloud-download"
        aria-hidden="true"
      />Export Donations</a>
    </div>
  </div>
</template>

<script>
const slug = require('slug')

export default {
  emits: ['has-error'],
  props: {
    nonprofit: { type: Object, default: () => ({}) }
  },
  data () {
    return {
      report: {},
      file: {},
      downloaded: false,

      countdown: null
    }
  },

  methods: {
    exportDonations () {
      const vm = this

      vm.addModal('spinner')

      vm.$request.post('nonprofits/' + vm.nonprofit.id + '/reports', {
        type: 'DONATIONS',
        nonprofitId: vm.nonprofit.id,
        name: slug(vm.nonprofit.legalName)
      }).then(response => {
        vm.report = response.data
        vm.pollReport()
      }).catch(err => {
        vm.clearModals()
        vm.$emit('has-error', err)
      })
    },

    pollReport () {
      const vm = this

      if (vm.downloaded) {
        vm.downloadFile()
        vm.clearModals()
      } else {
        vm.countdown = setInterval(() => {
          vm.$store.commit('generateCacheKey')

          vm.$request.get('nonprofits/' + vm.nonprofit.id + '/reports/' + vm.report.id).then(response => {
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
            vm.$emit('has-error', err)
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

      promise.then(() => {
        if (downloadPath) {
          window.location.href = downloadPath
        }
      })
    }
  }
}
</script>
