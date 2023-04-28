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
    <td class="u-nowrap u-text-r">
      <div class="date">
        {{ formattedDate }}
      </div>
      <div class="time">
        {{ formattedTime }}
      </div>
    </td>

    <td
      v-if="isOfflineBulk"
      class="u-nowrap"
    >
      Offline ({{ donation.count }})
    </td>
    <td
      v-else-if="isOffline"
      class="u-nowrap"
    >
      Offline
    </td>
    <td
      v-else
      class="u-nowrap"
    >
      Online
    </td>

    <td class="u-text-r">
      {{ formattedAmount }}
    </td>

    <td>
      <router-link :to="{ name: 'nonprofit-donations-list', params: { nonprofitId: donation.nonprofitId } }">
        {{ donation.Nonprofit.legalName }}
      </router-link>
    </td>

    <td
      v-if="isOfflineBulk || noDonor"
      class="u-nowrap empty"
    />
    <td v-else-if="isAnonymous">
      Anonymous
    </td>
    <td v-else>
      {{ donation.Donor.firstName }} {{ donation.Donor.lastName }}
    </td>

    <td
      v-if="isOfflineBulk || isAnonymous || noDonor || !donation.Donor.email"
      class="u-nowrap empty"
    />
    <td
      v-else
      class="u-nowrap"
    >
      <div class="c-user-strip u-flex u-items-center">
        <div class="c-user-strip__content">
          <div class="c-user-strip__email u-icon u-flex u-items-center">
            <a :href="'mailto:' + donation.Donor.email">{{ donation.Donor.email }}</a>
          </div>
          <div
            v-if="donation.Donor.phone"
            class="c-user-strip__phone u-icon u-flex u-items-center"
          >
            {{ donation.Donor.phone }}
          </div>
        </div>
      </div>
    </td>

    <td
      v-if="!hasAddress || isAnonymous || noDonor"
      class="u-nowrap empty"
    />
    <td
      v-else
      class="u-nowrap"
    >
      <div class="c-user-strip u-flex u-items-center">
        <div class="c-user-strip__content">
          <div class="c-user-strip__address u-icon u-flex">
            {{ donation.Donor.address1 }}<br v-if="donation.Donor.address2">
            {{ donation.Donor.address2 }}<br v-if="donation.Donor.city || donation.Donor.state || donation.Donor.zip">
            {{ donation.Donor.city }}, {{ donation.Donor.state }} {{ donation.Donor.zip }}
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
    donation: { type: Object, default: () => null }
  },
  computed: {
    isAnonymous () {
      return this.donation.isAnonymous
    },

    isOffline () {
      return this.donation.isOfflineDonation
    },

    isOfflineBulk () {
      return this.isOffline && this.donation.type === 'BULK'
    },

    hasAddress () {
      return this.donation.Donor !== null && (this.donation.Donor.address1 || this.donation.Donor.address2 || this.donation.Donor.city || this.donation.Donor.state || this.donation.Donor.zip)
    },

    formattedAmount () {
      return numeral(this.donation.subtotal / 100).format('$0,00.00')
    },

    formattedDate () {
      return new Date(this.donation.createdAt).toLocaleDateString()
    },

    formattedTime () {
      return new Date(this.donation.createdAt).toLocaleTimeString()
    },

    noDonor () {
      return this.donation.Donor === null
    }
  }
}
</script>
