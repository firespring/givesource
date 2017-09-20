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
            <div class="date">{{ getDate(donation.createdOn) }}</div>
            <div class="time">{{ getTime(donation.createdOn) }}</div>
        </td>
        <td class="u-text-r">
            {{ formatDonation(donation.amountInCents) }}
        </td>
        <td>
            {{ donation.donor.name }}
        </td>
        <td class="u-nowrap">

            <div class="c-user-strip u-flex u-items-center">

                <div class="c-user-strip__content">

                    <div class="c-user-strip__email u-icon u-flex u-items-center">
                        <a :href="`mailto:${ donation.donor.email }`">{{ donation.donor.email }}</a>
                    </div>

                    <div class="c-user-strip__phone u-icon u-flex u-items-center">
                        {{ donation.donor.phone }}
                    </div>

                </div>

            </div>

        </td>
        <td class="u-nowrap">

            <div class="c-user-strip u-flex u-items-center">

                <div class="c-user-strip__content">

                    <div class="c-user-strip__address u-icon u-flex">
                        {{ donation.donor.address1}}<br>
                        {{ donation.donor.address2 }}<br>
                        {{ donation.donor.city }}, {{ donation.donor.state }} {{ donation.donor.zip }}
                    </div>

                </div>

            </div>

        </td>
    </tr>
</template>

<script>
	const numeral = require('numeral');
	module.exports = {
		props: [
			'donation'
		],
		methods: {
			getDate: function (createdOn) {
				return new Date(createdOn).toLocaleDateString();
			},
			getTime: function (createdOn) {
				return new Date(createdOn).toLocaleTimeString();
			},
			formatDonation: function (amountInCents) {
				return numeral(amountInCents / 100).format('$0,0.00');
			}
		},
	};
</script>