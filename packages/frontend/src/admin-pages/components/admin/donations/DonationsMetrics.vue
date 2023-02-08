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
  <div class="c-page-section c-page-section--headless c-page-section--shadow c-page-section--border u-margin-bottom-scale">
    <div class="c-page-section__main">
      <div class="c-leaderboard">
        <div class="c-leaderboard__metric">
          <h6 class="metric-title">
            Donations
          </h6>
          <div class="metric-value">
            {{ donationsCount }}
          </div>
        </div>

        <div class="c-leaderboard__metric">
          <h6 class="metric-title">
            Donors
          </h6>
          <div class="metric-value">
            {{ donorsCount }}
          </div>
        </div>

        <div class="c-leaderboard__metric">
          <h6 class="metric-title">
            Total $
          </h6>
          <div class="metric-value">
            {{ donationsTotal }}
          </div>
        </div>

        <div class="c-leaderboard__metric">
          <h6 class="metric-title">
            Top Donation
          </h6>
          <div class="metric-value">
            {{ topDonation }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Utils from './../../../helpers/utils'

const numeral = require('numeral')

export default {
  data: function () {
    return {
      metrics: {
        DONATIONS_COUNT: 0,
        DONATIONS_TOTAL: 0,
        DONORS_COUNT: 0,
        TOP_DONATION: 0
      }
    }
  },
  computed: {
    donationsCount: function () {
      return numeral(this.metrics.DONATIONS_COUNT).format('0,000')
    },
    donationsTotal: function () {
      return numeral(this.metrics.DONATIONS_TOTAL / 100).format('$0,00.00')
    },
    donorsCount: function () {
      return numeral(this.metrics.DONORS_COUNT).format('0,000')
    },
    topDonation: function () {
      return numeral(this.metrics.TOP_DONATION / 100).format('$0,00.00')
    }
  },
  created: function () {
    const vue = this

    vue.$request.get('metrics', { keys: Object.keys(vue.metrics) }).then(function (response) {
      vue.metrics = response.data
    }).catch(function (err) {
      vue.$emit('hasError', err)
    })
  }
}
</script>
