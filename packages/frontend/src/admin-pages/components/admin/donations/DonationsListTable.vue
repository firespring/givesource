<!--
  ~ Copyright 2018 Firespring, Inc.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<template>
    <table :class="{ 'table-empty': !displayRows }">
        <thead>
        <tr>
            <th class="sortable sortable--desc">
                <a href="#">Date</a>
            </th>
            <th class="sortable">
                <a href="#">Type</a>
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
        <donations-list-table-row v-for="donation in donations" :donation="donation" :key="donation.uuid"></donations-list-table-row>
        </tbody>

        <tbody v-else>
        <layout-empty-table-row :loaded="loaded" :colspan="7" message="There are no donations."></layout-empty-table-row>
        </tbody>
    </table>
</template>

<script>
	module.exports = {
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
            },
            loaded: {
				type: Boolean,
                default: false,
            }
		},
		components: {
			'donations-list-table-row': require('./DonationsListTableRow.vue'),
			'layout-empty-table-row': require('./../../layout/EmptyTableRow.vue')
		}
	};
</script>