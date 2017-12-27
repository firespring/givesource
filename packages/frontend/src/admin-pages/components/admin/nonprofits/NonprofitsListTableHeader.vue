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
    <div class="c-header-actions">

        <div>
            <router-link :to="{ name: 'add-nonprofit' }" role="button" class="c-btn c-btn--sm c-btn--icon">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>Add Nonprofit
            </router-link>
        </div>

        <div class="c-header-actions__search u-flex-expand">
            <form v-on:submit="submit">
                <div class="c-form-control-grid">

                    <div class="c-form-control-grid__item u-flex-collapse">
                        <select v-on:change="updateSort" v-model="sort" id="selectMenuDefault" name="selectMenuDefault" class="sm u-width-auto">
                            <option value="all_created_on_descending">View all nonprofits</option>
                            <option value="active_legal_name_descending">View active</option>
                            <option value="pending_legal_name_descending">View pending</option>
                            <option value="denied_legal_name_descending">View denied</option>
                        </select>
                    </div>

                    <div class="c-form-control-grid__item">
                        <div class="u-control-icon u-control-icon--search">
                            <input v-model="formData.search" type="search" name="search" id="search" class="sm" placeholder="Search nonprofits"
                                   :class="{ 'has-error': formErrors.search }">
                        </div>
                        <div v-if="formErrors.search" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                            {{ formErrors.search }}
                        </div>
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
				sort: this.pagination.sort,

				// Form Data
				formData: {
					search: '',
				},

				// Form Errors
				formErrors: {},
			};
		},
		props: {
			pagination: {
				type: Object,
				default: function () {
					return {
						items: [],
						loaded: false,
						size: 0,
						sort: '',
						start: 0,
						total: 0,
					};
				}
			}
		},
		watch: {
			pagination: {
				handler: function () {
					this.sort = this.pagination.sort;
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
                    }
				}
			},
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (!Object.keys(vue.formErrors).length) {
					if (vue.formData.search.replace(/\s/g, '')) {
						vue.searchNonprofits();
					} else {
						vue.$emit('resetPagination');
					}
				}
			},
            searchNonprofits: function () {
				const vue = this;

	            const filter = vue.getFilter();
	            const params = {
		            legalName: vue.formData.search.toLowerCase(),
	            };

	            if (filter) {
		            params.status = filter;
	            }

	            if (vue.sort) {
	            	params.sort = vue.sort;
                }

	            vue.$emit('searchNonprofits', params);
            },
            getFilter: function () {
				const vue = this;

				switch (vue.sort) {
                    case 'active_legal_name_descending':
                    	return 'ACTIVE';

                    case 'pending_legal_name_descending':
                    	return 'PENDING';

                    case 'denied_legal_name_descending':
                    	return 'DENIED';

					default:
					case 'all_created_on_descending':
						return null;
                }
            },
			updateSort: function () {
				const vue = this;

				if (vue.formData.search) {
					vue.searchNonprofits();
                } else {
					vue.$router.push(vue.generatePageLink({sort: vue.sort}));
                }
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
		}
	};
</script>