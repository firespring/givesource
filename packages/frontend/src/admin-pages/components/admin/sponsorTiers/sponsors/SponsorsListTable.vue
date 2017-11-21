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
    <table class="table-middle table-reorder js-table-reorder">
        <thead>
        <tr>
            <th></th>
            <th>Logo</th>
            <th class="u-width-100p">Sponsor Name</th>
            <th></th>
        </tr>
        </thead>

        <tbody class="ui-sortable">
        <sponsors-list-table-row v-for="sponsor in sponsors" :sponsor="sponsor" :key="sponsor.uuid"></sponsors-list-table-row>
        </tbody>
    </table>
</template>

<script>
	module.exports = {
		props: {
			sponsors: {
				type: Array,
                default: function () {
                	return [];
                }
            }
        },
		components: {
			'sponsors-list-table-row': require('./SponsorsListTableRow.vue')
		}
	};
</script>