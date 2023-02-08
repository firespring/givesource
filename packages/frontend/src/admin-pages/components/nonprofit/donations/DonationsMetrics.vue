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
            Total $
          </h6>
          <div class="metric-value">
            {{ donationsTotal }}
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
  props: {
    nonprofit: {}
  },
  data: function () {
    return {
      metrics: {
        DONATIONS_COUNT: 0,
        DONATIONS_TOTAL: 0
      }
    }
  },
  computed: {
    donationsCount: function () {
      const totalDonations = this.nonprofit.Donations ? this.nonprofit.Donations.length : 0
      return numeral(totalDonations).format('0,000')
    },
    donationsTotal: function () {
      let subtotal = 0
      if (this.nonprofit.Donations && this.nonprofit.Donations.length > 0) {
        this.nonprofit.Donations.forEach(function (donation) {
          subtotal += donation.subtotal
        })
      }

      return numeral(subtotal / 100).format('$0,0.00')
    }
  }
}
</script>
