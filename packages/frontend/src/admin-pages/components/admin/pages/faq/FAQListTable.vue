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
    <table class="table-reorder table-headless">
        <draggable v-model="localContents" :options="draggableOptions" :element="'tbody'" v-on:end="updateSortOrder" class="ui-sortable">
            <faq-list-table-row v-for="content in localContents" :content="content" :key="content.uuid"></faq-list-table-row>
        </draggable>
    </table>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				localContents: [],

				// Sort Options
				draggableOptions: {
					handle: '.c-drag-handle',
					ghostClass: 'reorder-placeholder',
					draggable: 'tr',
				}
			};
		},
		props: {
			contents: {
				type: Array,
				default: function () {
					return [];
				}
			},
		},
		watch: {
			contents: function (value) {
				this.localContents = value;
			},
			localContents: function () {
				this.$emit('contents', this.localContents);
			},
		},
		methods: {
			updateSortOrder: function () {
				const vue = this;

				const original = JSON.parse(JSON.stringify(vue.localContents));
				vue.localContents.forEach(function (content, i) {
					content.sortOrder = i;
				});

				const toUpdate = _.differenceWith(vue.localContents, original, _.isEqual);
				vue.$request.patch('contents', {
					contents: toUpdate
				}).catch(function (err) {
					console.log(err);
				});
			}
		},
		components: {
			'draggable': require('vuedraggable'),
			'faq-list-table-row': require('./FAQListTableRow.vue')
		}
	};
</script>