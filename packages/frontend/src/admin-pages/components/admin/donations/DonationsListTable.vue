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
    <table :class="{ 'table-empty': !displayRows }">
        <thead>
        <tr>
            <th class="sortable sortable--desc">
                <a href="#">Date</a>
            </th>
            <th class="sortable">
                <a href="#">$</a>
            </th>
            <th class="u-width-25p sortable">
                <a href="#">Nonprofit</a>
            </th>
            <th class="u-width-25p sortable">
                <a href="#">Donor</a>
            </th>
            <th class="u-width-25p">Contact Info</th>
            <th class="u-width-25p">Billing Address</th>
        </tr>
        </thead>

        <tbody v-if="displayRows">
        <donations-list-table-row v-if="displayRows" v-for="donation in donations" :donation="donation" :nonprofit="getNonprofit(donation.nonprofitUuid)"
                                  :donor="getDonor(donation.donorUuid)" :key="donation.uuid"></donations-list-table-row>
        </tbody>

        <tbody v-else>
        <layout-empty-table-row :loaded="loaded" :colspan="6" message="There are no donations."></layout-empty-table-row>
        </tbody>
    </table>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				donations: [],
				donors: [],
				nonprofits: [],

				loaded: false
			};
		},
		computed: {
			displayRows: function () {
				return this.loaded && this.donations.length;
			}
		},
		created: function () {
			const vue = this;

			axios.get(API_URL + 'donations').then(function (response) {
				vue.donations = response.data;
				return axios.get(API_URL + 'donors');
			}).then(function (response) {
				vue.donors = response.data;
				return axios.get(API_URL + 'nonprofits');
			}).then(function (response) {
				vue.nonprofits = response.data;
				vue.loaded = true;
			});
		},
		methods: {
			getNonprofit: function (nonprofitUuid) {
				const vue = this;

				return _.find(vue.nonprofits, { uuid: nonprofitUuid });
			},
			getDonor: function (donorUuid) {
				const vue = this;

				return _.find(vue.donors, { uuid: donorUuid });
			},
		},
		components: {
			'donations-list-table-row': require('./DonationsListTableRow.vue'),
            'layout-empty-table-row': require('./../../layout/EmptyTableRow.vue')
		}
	};
</script>