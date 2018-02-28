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
            <th class="u-width-100p">Sponsor Tier</th>
            <th></th>
        </tr>
        </thead>

        <draggable v-model="localSponsorTiers" :options="draggableOptions" :element="'tbody'" v-on:end="updateSortOrder">
            <sponsors-list-table-row v-for="sponsorTier in localSponsorTiers" :sponsorTier="sponsorTier" :key="sponsorTier.uuid" v-on:deleteSponsorTier="deleteSponsorTier"
                                     v-on:hasError="hasError">
            </sponsors-list-table-row>
        </draggable>
    </table>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				localSponsorTiers: [],

				// Sort Options
				draggableOptions: {
					handle: '.c-drag-handle',
					ghostClass: 'reorder-placeholder',
					draggable: 'tr',
				},

                apiError:{},
			};
		},
		props: {
			sponsorTiers: {
				type: Array,
				default: function () {
					return [];
				}
			},
		},
		watch: {
			sponsorTiers: function (value) {
				this.localSponsorTiers = value;
			},
			localSponsorTiers: function () {
				this.$emit('sponsorTiers', this.localSponsorTiers);
			},
		},
		methods: {
			updateSortOrder: function () {
				const vue = this;

				const original = JSON.parse(JSON.stringify(vue.localSponsorTiers));
				vue.localSponsorTiers.forEach(function (sponsorTier, i) {
					sponsorTier.sortOrder = i;
				});

				const toUpdate = _.differenceWith(vue.localSponsorTiers, original, _.isEqual);
				vue.$request.patch('sponsor-tiers', {
					sponsorTiers: toUpdate
				}).catch(function (err) {
                    vue.$emit('hasError', err);
				});
			},
			deleteSponsorTier: function (sponsorTierUuid) {
				const vue = this;

				vue.localSponsorTiers = _.filter(vue.localSponsorTiers, function (sponsorTier) {
					return sponsorTier.uuid !== sponsorTierUuid;
				});
			},
            hasError: function (err) {
                const vue = this;
                vue.$emit('hasError', err);
            },
		},
		components: {
			'draggable': require('vuedraggable'),
			'sponsors-list-table-row': require('./SponsorsTiersListTableRow.vue')
		}
	};
</script>