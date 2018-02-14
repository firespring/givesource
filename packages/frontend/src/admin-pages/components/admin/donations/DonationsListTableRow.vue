<!--
  ~ Copyright (C) 2017  Firespring
  ~
  ~ This program is free software: you can redistribute it and/or modify
  ~ it under the terms of the GNU General Public License as published by
  ~ the Free Software Foundation, either version 3 of the License, or
  ~ (at your option) any later version.
  ~
  ~ This program is distributed in the hope that it will be useful,
  ~ but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~ GNU General Public License for more details.
  ~
  ~ You should have received a copy of the GNU General Public License
  ~ along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -->

<template>
    <tr>
        <td class="u-nowrap u-text-r">
            <div class="date">{{ formattedDate }}</div>
            <div class="time">{{ formattedTime }}</div>
        </td>

        <td class="u-text-r">
            {{ formattedAmount }}
        </td>

        <td>
            <router-link :to="{ name: 'nonprofit-donations-list', params: { nonprofitUuid: donation.nonprofitUuid } }">{{ donation.nonprofitLegalName }}</router-link>
        </td>

        <td v-if="donation.isAnonymous">
            Anonymous
        </td>

        <td v-else>
            {{ donation.donorFirstName }} {{ donation.donorLastName }}
        </td>

        <td v-if="donation.isAnonymous"></td>

        <td v-else-if="donation.isOfflineDonation">
            <div class="c-user-strip u-flex u-items-center" v-if="donation.donorEmail">
                <div class="c-user-strip__content">
                    <div class="c-user-strip__email u-icon u-flex u-items-center">
                        <a :href="'mailto:' + donation.donorEmail">{{ donation.donorEmail }}</a>
                    </div>
                </div>
            </div>
        </td>

        <td class="u-nowrap" v-else>
            <div class="c-user-strip u-flex u-items-center">
                <div class="c-user-strip__content">
                    <div class="c-user-strip__email u-icon u-flex u-items-center">
                        <a :href="'mailto:' + donation.donorEmail">{{ donation.donorEmail }}</a>
                    </div>
                    <div class="c-user-strip__phone u-icon u-flex u-items-center">
                        {{ donation.donorPhone }}
                    </div>
                </div>
            </div>
        </td>

        <td v-if="donation.isAnonymous"></td>

        <td v-else-if="donation.isOfflineDonation">
            Offline Donation
        </td>

        <td class="u-nowrap" v-else>
            <div class="c-user-strip u-flex u-items-center">
                <div class="c-user-strip__content">
                    <div class="c-user-strip__address u-icon u-flex">
                        {{ donation.donorAddress1 }}<br v-if="donation.donorAddress2">
                        {{ donation.donorAddress2 }}<br v-if="donation.donorCity || donation.donorState || donation.donorZip">
                        {{ donation.donorCity }}, {{ donation.donorState }} {{ donation.donorZip }}
                    </div>
                </div>
            </div>
        </td>

    </tr>
</template>

<script>
	const numeral = require('numeral');

	module.exports = {
		computed: {
			formattedAmount: function () {
				return numeral(this.donation.subtotal / 100).format('$0,00.00');
			},
			formattedDate: function () {
				return new Date(this.donation.createdOn).toLocaleDateString();
			},
			formattedTime: function () {
				return new Date(this.donation.createdOn).toLocaleTimeString();
			},
		},
		props: {
			donation: {},
		}
	};
</script>