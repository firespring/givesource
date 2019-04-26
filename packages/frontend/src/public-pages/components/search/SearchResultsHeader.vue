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
    <div class="actions-row">
        <div class="actions-row__search" style="width: 100%;">
            <form v-on:submit.prevent="submit">
                <div class="grid grid--compact grid--middle">

                    <div class="grid-item grid-item--expand">
                        <div class="select-wrap">
                            <forms-nonprofit-category-select v-model="formData.category" placeholder="Select a category" :disablePlaceholder="false" class="sm">
                            </forms-nonprofit-category-select>
                        </div>
                    </div>

                    <div class="grid-item grid-item--expand">
                        <div class="search-wrap">
                            <input v-model="formData.search" type="search" name="search" class="sm" placeholder="Search By Name" :class="{'has-error': formErrors.search}">
                        </div>
                        <div v-if="formErrors.search" class="notes notes--below notes--error">
                            {{ formErrors.search }}
                        </div>
                    </div>

                    <div class="grid-item grid-item--collapse">
                        <button type="submit" class="btn btn--dark btn--sm">Go</button>
                    </div>

                </div>
            </form>
        </div>
    </div>
</template>

<script>
	import ComponentNonprofitCategorySelect from './../forms/NonprofitCategorySelect.vue';

	export default {
		data() {
			return {
				// Form Data
				formData: {
					category: 0,
					search: '',
				},

				// Errors
				formErrors: {},
			};
		},
		props: {
			category: {
				type: Number,
				default: 0
			},
			search: {
				type: String,
				default: '',
			}
		},
		watch: {
			category(value) {
				this.formData.category = value;
			},
			search(value) {
				this.formData.search = value;
			},
			formData: {
				handler() {
					const vm = this;
					if (Object.keys(vm.formErrors).length) {
						vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
					}
				},
				deep: true
			}
		},
		methods: {
			getConstraints() {
				return {
					search: {
						presence: false,
						length: {
							minimum: 3
						},
					},
				};
			},
			submit() {
				const vm = this;

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (!Object.keys(vm.formErrors).length) {
					vm.searchNonprofits();
				}
			},
			searchNonprofits() {
				const vm = this;

				vm.$router.push(vm.generatePageLink({
					category: vm.formData.category,
					search: vm.formData.search,
					start: null
				}));
			},
			generatePageLink(query) {
				const vm = this;

				query = query || {};
				query = _.extend({}, vm.$route.query, query);
				Object.keys(query).forEach(key => {
					if (query[key] === null || query[key] === 0 || query[key] === '' || query[key] === '0') {
						delete query[key];
					}
				});
				return {
					name: vm.$route.name,
					query: query
				};
			}
		},
		components: {
			'forms-nonprofit-category-select': ComponentNonprofitCategorySelect,
		}
	};
</script>