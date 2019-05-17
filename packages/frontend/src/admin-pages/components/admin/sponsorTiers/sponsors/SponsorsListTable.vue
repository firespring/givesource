<!--
  ~ Copyright 2019 Firespring, Inc.
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
    <table class="table-middle table-reorder js-table-reorder">
        <thead>
        <tr>
            <th></th>
            <th>Logo</th>
            <th class="u-width-100p">Sponsor Name</th>
            <th></th>
        </tr>
        </thead>

        <draggable v-model="localSponsors" :options="draggableOptions" :element="'tbody'" v-on:end="updateSortOrder">
            <sponsors-list-table-row v-for="sponsor in localSponsors" :sponsor="sponsor" :file="getFile(sponsor.fileUuid)" v-on:deleteSponsor="deleteSponsor" :key="sponsor.uuid"
                                     :v-on:hasError="hasError">
            </sponsors-list-table-row>
        </draggable>
    </table>
</template>

<script>
	import ComponentDraggable from 'vuedraggable';
	import ComponentSponsorsListTableRow from './SponsorsListTableRow.vue';

	export default {
		data() {
			return {
				localSponsors: [],

				// Sort Options
				draggableOptions: {
					handle: '.c-drag-handle',
					ghostClass: 'reorder-placeholder',
					draggable: 'tr',
				}
			};
		},
		props: {
			files: {
				type: Array,
				default() {
					return [];
				}
			},
			sponsors: {
				type: Array,
				default() {
					return [];
				}
			},
			sponsorTierUuid: {
				type: String,
				default: null,
			}
		},
		watch: {
			sponsors(value) {
				this.localSponsors = value;
			},
			localSponsors() {
				this.$emit('sponsors', this.localSponsors);
			},
		},
		methods: {
			getFile(fileUuid) {
				return _.find(this.files, {uuid: fileUuid});
			},
			updateSortOrder() {
				const vm = this;

				const original = JSON.parse(JSON.stringify(vm.localSponsors));
				vm.localSponsors.forEach((sponsor, i) => {
					sponsor.sortOrder = i;
				});

				const toUpdate = _.differenceWith(vm.localSponsors, original, _.isEqual);
				vm.$request.patch('sponsor-tiers/' + vm.sponsorTierUuid + '/sponsors', {
					sponsors: toUpdate
				}).catch(err => {
					vm.$emit('hasError', err);
				});
			},
			deleteSponsor(sponsorUuid) {
				const vm = this;

				vm.localSponsors = _.filter(vm.localSponsors, sponsor => {
					return sponsor.uuid !== sponsorUuid;
				});
			},
			hasError(err) {
				this.$emit('hasError', err);
			}
		},
		components: {
			'draggable': ComponentDraggable,
			'sponsors-list-table-row': ComponentSponsorsListTableRow,
		}
	};
</script>