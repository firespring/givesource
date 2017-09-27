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
    <table>

        <thead>
        <tr>
            <th class="sortable sortable--desc">
                <a href="#">Date</a>
            </th>
            <th class="sortable">
                <a href="#">$</a>
            </th>
            <th class="u-width-33p sortable">
                <a href="#">Donor</a>
            </th>
            <th class="u-width-33p">Contact Info</th>
            <th class="u-width-33p">Billing Address</th>
        </tr>
        </thead>

        <tbody>
            <donations-list-table-row v-for="donation in donations" v-bind:donation="donation" v-bind:key="donation.uuid"></donations-list-table-row>
        </tbody>

    </table>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				donations: [],
				donors: []
			};
		},
        props: [
			'nonprofitUuid'
        ],
		components: {
			'donations-list-table-row': require('./DonationsListTableRow.vue')
		},
		mounted: function () {
			this.getDonations();
		},
		methods: {
			getDonations: function () {
				const vue = this;
				// TODO: make this faster via the GetDonations lambda function & elastic search
				axios.get(API_URL + 'donors').then(function (response) {
					response.data.forEach(function (donor) {
						vue.donors.push(donor);
					});
				}).then(function () {
					axios.get(API_URL + 'nonprofits/' + vue.nonprofitUuid + '/donations').then(function (response) {
						response.data.forEach(function (donation) {
							donation.donor = vue.getDonor(donation.donorUuid);
							vue.donations.push(donation);
						});
					});
				}).catch(function (err) {
					console.log(err);
				});
			},
			getDonor: function (donorUuid) {
				const vue = this;
				let result = {};
				vue.donors.forEach(function (donor) {
					if (donor.uuid === donorUuid) {
						result = donor;
					}
				});
				return result;
			},

		}
	};
</script>