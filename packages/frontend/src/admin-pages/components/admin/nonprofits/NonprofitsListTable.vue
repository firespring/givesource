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
                <a href="#">Registered</a>
            </th>
            <th class="sortable u-nowrap">
                <a href="#">Contact</a>
            </th>
            <th class="sortable u-nowrap">
                <a href="#">$ Raised</a>
            </th>
            <th>

            </th>
        </tr>
        </thead>

        <tbody v-if="displayRows">
        <nonprofits-list-table-row v-for="nonprofit in nonprofits" :nonprofit="nonprofit" :key="nonprofit.uuid"></nonprofits-list-table-row>
        </tbody>

        <tbody v-else>
        <layout-empty-table-row :loaded="loaded" :colspan="6" message="There are no nonprofits."></layout-empty-table-row>
        </tbody>

    </table>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				loaded: false,
            };
        },
		computed: {
			displayRows: function () {
				return this.loaded && this.nonprofits.length;
			}
		},
		props: {
			nonprofits: {
				type: Array,
				default: function () {
					return [];
				}
			}
		},
		watch: {
			nonprofits: function () {
				const vue = this;

				if (!vue.loaded) {
					vue.loaded = true;
				}
			}
		},
		components: {
			'layout-empty-table-row': require('./../../layout/EmptyTableRow.vue'),
			'nonprofits-list-table-row': require('./NonprofitsListTableRow.vue')
		},
	};
</script>