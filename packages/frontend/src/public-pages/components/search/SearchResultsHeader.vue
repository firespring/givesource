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
	module.exports = {
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
			'forms-nonprofit-category-select': require('./../forms/NonprofitCategorySelect.vue'),
		}
	};
</script>