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
            <div class="date">{{ date }}</div>
            <div class="time">{{ time }}</div>
        </td>

        <td class="u-text-r">
            {{ amount }}
        </td>

        <td v-if="donation.isAnonymous">
            Anonymous
        </td>

        <td v-else>
            {{ donor.firstName }} {{ donor.lastName}}
        </td>

        <td v-if="donation.isAnonymous"></td>

        <td v-else-if="donation.isOfflineDonation">
            <div class="c-user-strip u-flex u-items-center" v-if="donor.email">
                <div class="c-user-strip__content">
                    <div class="c-user-strip__email u-icon u-flex u-items-center">
                        <a :href="`mailto:${donor.email}`">{{ donor.email }}</a>
                    </div>
                </div>
            </div>
        </td>

        <td class="u-nowrap" v-else>
            <div class="c-user-strip u-flex u-items-center">
                <div class="c-user-strip__content">
                    <div class="c-user-strip__email u-icon u-flex u-items-center">
                        <a :href="`mailto:${ donor.email }`">{{ donor.email }}</a>
                    </div>
                    <div class="c-user-strip__phone u-icon u-flex u-items-center">
                        {{ donor.phone }}
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
                        {{ donor.address1}}<br>
                        {{ donor.address2 }}<br>
                        {{ donor.city }}, {{ donor.state }} {{ donor.zip }}
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
			date: function () {
				return new Date(this.donation.createdOn).toLocaleDateString();
			},
			time: function () {
				return new Date(this.donation.createdOn).toLocaleTimeString();
			},
			amount: function () {
				return numeral(this.donation.subtotal / 100).format('$0,00.00');
			},
		},
		props: {
			donation: {
				type: Object,
				default: function () {
					return {};
				}
			},
			donor: {
				type: Object,
				default: function () {
					return {};
				}
			}
		}
	};
</script>