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

        <draggable v-model="localSponsors" :options="draggableOptions" :element="'tbody'" v-on:end="updateSortOrder">
            <sponsors-list-table-row v-for="sponsor in localSponsors" :sponsor="sponsor" :file="getFile(sponsor.fileUuid)" v-on:deleteSponsor="deleteSponsor" :key="sponsor.uuid">
            </sponsors-list-table-row>
        </draggable>
    </table>
</template>

<script>
	module.exports = {
		data: function () {
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
				default: function () {
					return [];
				}
			},
			sponsors: {
				type: Array,
				default: function () {
					return [];
				}
			},
            sponsorTierUuid: {
				type: String,
                default: null,
            }
		},
        watch: {
			sponsors: function (value) {
				this.localSponsors = value;
            },
            localSponsors: function () {
				this.$emit('sponsors', this.localSponsors);
            },
        },
		methods: {
			getFile: function (fileUuid) {
				return _.find(this.files, {uuid: fileUuid});
			},
			updateSortOrder: function () {
				const vue = this;

				const original = JSON.parse(JSON.stringify(vue.localSponsors));
				vue.localSponsors.forEach(function (sponsor, i) {
					sponsor.sortOrder = i;
				});

				const toUpdate = _.differenceWith(vue.localSponsors, original, _.isEqual);
				axios.patch(API_URL + 'sponsor-tiers/' + vue.sponsorTierUuid + '/sponsors', {
					sponsors: toUpdate
				}).catch(function (err) {
					console.log(err);
				});
			},
			deleteSponsor: function (sponsorUuid) {
				const vue = this;

				vue.localSponsors = _.filter(vue.localSponsors, function(sponsor) {
					return sponsor.uuid !== sponsorUuid;
				});
            }
		},
		components: {
			'draggable': require('vuedraggable'),
			'sponsors-list-table-row': require('./SponsorsListTableRow.vue')
		}
	};
</script>