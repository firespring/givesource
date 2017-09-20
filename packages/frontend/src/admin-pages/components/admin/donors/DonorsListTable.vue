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
            <th class="input">
                <div class="checkbox checkbox--sm">
                    <input type="checkbox" name="checkAllRows" id="checkAllRows-1" class="check-all-rows js-check-all-rows" value="1">
                    <label for="checkAllRows-1"></label>
                </div>
            </th>
            <th class="u-width-99p sortable sortable--desc u-nowrap">
                <a href="#">Name</a>
            </th>
            <th class="sortable u-nowrap">
                <a href="#">Email</a>
            </th>
            <th class="sortable u-nowrap">
                <a href="#">Registered</a>
            </th>
            <th class="sortable u-nowrap">
                <a href="#">$ Donated</a>
            </th>
            <th>

            </th>
        </tr>
        </thead>

        <tbody>
            <donors-list-table-row v-for="donor in donors" v-bind:donor="donor" v-bind:key="donor.uuid"></donors-list-table-row>
        </tbody>

    </table>
</template>

<script>
	var numeral = require('numeral');
	module.exports = {
		data: function () {
			return {
				donors: [],
			};
		},
		components: {
			'donors-list-table-row': require('./DonorsListTableRow.vue')
		},
		mounted: function () {
			this.getDonors();
		},
		methods: {
			getDonors: function () {
				const vue = this;
				axios.get(API_URL + 'donors').then(function (response) {
					response.data.forEach(function (donor) {
						donor.date = vue.getDate(donor.createdOn);
						donor.time = vue.getTime(donor.createdOn);
						donor.formatAmount = vue.formatTotalAmount(donor.totalAmountInCents);
						vue.donors.push(donor);
					});
				}).catch(function (err) {
					console.log(err);
				});
			},
			getDate: function (createdOn) {
				return new Date(createdOn).toLocaleDateString();
			},
			getTime: function (createdOn) {
				return new Date(createdOn).toLocaleTimeString();
			},
			formatTotalAmount: function (totalAmountInCents) {
				return numeral(totalAmountInCents / 100).format('$0,0.00');
			}
		}
	}
</script>