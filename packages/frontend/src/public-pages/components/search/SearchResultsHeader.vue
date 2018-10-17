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
    <div class="actions-row">
        <div class="actions-row__search" style="width: 100%;">
            <form v-on:submit="submit">
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
		data: function () {
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
			category: function (value) {
				this.formData.category = value;
			},
			search: function (value) {
				this.formData.search = value;
			},
			formData: {
				handler: function () {
					const vue = this;
					if (Object.keys(vue.formErrors).length) {
						vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
					}
				},
				deep: true
			}
		},
		methods: {
			getConstraints: function () {
				return {
					search: {
						presence: false,
						length: {
							minimum: 3
						},
					},
				};
			},
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (!Object.keys(vue.formErrors).length) {
					vue.searchNonprofits();
				}
			},
			searchNonprofits: function () {
				const vue = this;

				vue.$router.push(vue.generatePageLink({
					category: vue.formData.category,
					search: vue.formData.search,
				}));
			},
			generatePageLink: function (query) {
				const vue = this;
				query = query || {};
				query = _.extend({}, vue.$route.query, query);
				Object.keys(query).forEach(function (key) {
					if (query[key] === null || query[key] === 0 || query[key] === '' || query[key] === '0') {
						delete query[key];
					}
				});
				return {
					name: vue.$route.name,
					query: query
				};
			}
		},
		components: {
			'forms-nonprofit-category-select': ComponentNonprofitCategorySelect,
		}
	};
</script>