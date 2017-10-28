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
        <donations-list-table-row v-for="donation in donations" :donation="donation" :nonprofit="getNonprofit(donation)"
                                  :donor="getDonor(donation)" :key="donation.uuid"></donations-list-table-row>
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
				nonprofits: [],
				donors: [],

                loaded: false
			};
		},
		computed: {
			displayRows: function () {
				return this.loaded && this.donations.length;
			}
		},
		props: {
			donations: {
				type: Array,
				default: function () {
					return [];
				}
			}
		},
		watch: {
			donations: function () {
				const vue = this;

				if (!vue.loaded) {
					vue.loadData();
				} else {
					vue.loaded = false;
                }
			}
		},
		methods: {
			loadData: function () {
				const vue = this;

				let promise = Promise.resolve();
				vue.donations.forEach(function (donation) {
					promise = promise.then(function () {
						if (!_.find(vue.nonprofits, {'uuid': donation.nonprofitUuid})) {
							return axios.get(API_URL + 'nonprofits/' + donation.nonprofitUuid).then(function (response) {
								vue.nonprofits.push(response.data);
							});
						}
						return Promise.resolve();
					}).then(function () {
						if (!_.find(vue.donors, {'uuid': donation.donorUuid}) && !donation.isAnonymous) {
							return axios.get(API_URL + 'donors/' + donation.donorUuid).then(function (response) {
								vue.donors.push(response.data);
							});
						}
						return Promise.resolve();
					});
				});

				promise = promise.then(function () {
					vue.loaded = true;
				});
			},
			getNonprofit: function (donation) {
				const vue = this;
				return _.find(vue.nonprofits, {uuid: donation.nonprofitUuid});
			},
			getDonor: function (donation) {
				const vue = this;
				if (!donation.isAnonymous) {
					return _.find(vue.donors, {uuid: donation.donorUuid});
                }
                return {};
			},
		},
		components: {
			'donations-list-table-row': require('./DonationsListTableRow.vue'),
			'layout-empty-table-row': require('./../../layout/EmptyTableRow.vue')
		}
	};
</script>