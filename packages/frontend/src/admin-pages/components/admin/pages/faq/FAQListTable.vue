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
    <table class="table-reorder table-headless">
        <draggable v-model="localContents" :options="draggableOptions" :element="'tbody'" v-on:end="updateSortOrder" class="ui-sortable">
            <faq-list-table-row v-for="content in localContents" :content="content" :key="content.uuid"></faq-list-table-row>
        </draggable>
    </table>
</template>

<script>
	import ComponentDraggable from 'vuedraggable';
	import ComponentFAQListTableRow from './FAQListTableRow.vue';

	export default {
		data() {
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
				default() {
					return [];
				}
			},
		},
		watch: {
			contents(value) {
				this.localContents = value;
			},
			localContents() {
				this.$emit('contents', this.localContents);
			},
		},
		methods: {
			updateSortOrder() {
				const vm = this;

				const original = JSON.parse(JSON.stringify(vm.localContents));
				vm.localContents.forEach((content, i) => {
					content.sortOrder = i;
				});

				const toUpdate = _.differenceWith(vm.localContents, original, _.isEqual);
				vm.$request.patch('contents', {
					contents: toUpdate
				}).catch(err => {
					vm.$emit('hasError', err);
				});
			}
		},
		components: {
			'draggable': ComponentDraggable,
			'faq-list-table-row': ComponentFAQListTableRow,
		}
	};
</script>