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
    <table :class="{ 'table=-empty': !displayRows }">
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

        <tbody v-if="displayRows">
        <donations-list-table-row v-for="donation in donations" :donation="donation" :donor="getDonor(donation)" :key="donation.uuid"></donations-list-table-row>
        </tbody>

        <tbody v-else>
        <layout-empty-table-row :loaded="loaded" :colspan="5" message="There are no donations."></layout-empty-table-row>
        </tbody>

    </table>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				donors: [],

				loaded: false,
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
						if (!_.find(vue.donors, {'uuid': donation.donorUuid}) && !donation.isAnonymous) {
							return vue.$request.get('donors/' + donation.donorUuid).then(function (response) {
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