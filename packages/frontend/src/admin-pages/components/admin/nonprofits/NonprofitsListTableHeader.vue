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
    <div class="c-header-actions">

        <div>
            <router-link :to="{ name: 'add-nonprofit' }" role="button" class="c-btn c-btn--sm c-btn--icon">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>Add Nonprofit
            </router-link>
        </div>

        <div class="c-header-actions__search u-flex-expand">
            <form v-on:submit.prevent="submit">
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
	export default {
		data() {
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
				default() {
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
				handler() {
					this.sort = this.pagination.sort;
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
                    }
				}
			},
			submit() {
				const vm = this;

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (!Object.keys(vm.formErrors).length) {
					if (vm.formData.search.replace(/\s/g, '')) {
						vm.searchNonprofits();
					} else {
						vm.$emit('resetPagination');
					}
				}
			},
            searchNonprofits() {
				const vm = this;

	            const filter = vm.getFilter();
	            const params = {
		            legalName: vm.formData.search.toLowerCase(),
	            };

	            if (filter) {
		            params.status = filter;
	            }

	            if (vm.sort) {
	            	params.sort = vm.sort;
                }

	            vm.$emit('searchNonprofits', params);
            },
            getFilter() {
				const vm = this;

				switch (vm.sort) {
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
			updateSort() {
				const vm = this;

				if (vm.formData.search) {
					vm.searchNonprofits();
                } else {
					vm.$router.push(vm.generatePageLink({sort: vm.sort}));
                }
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
		}
	};
</script>