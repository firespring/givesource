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
    <div class="c-table-footer">
        <div class="c-table-footer__actions">
            <div class="c-notes">
                All times in CDT.
            </div>
        </div>
        <div class="c-table-footer__rows-page" v-if="displaySize">
            <span>Show</span>
            <select v-model="size" v-on:change="selectPageSize" id="rowsPage" name="rowsPage" class="sm">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            <span>rows/page</span>
        </div>
        <div class="c-table-footer__pagination" v-if="displayPagination">
            <nav class="c-pagination">
                <router-link :to="generatePageLink({start: 0})" class="c-pagination__first" title="Jump to the first page" v-if="start > 0">
                    <i class="fa fa-angle-double-left" aria-hidden="true"></i>
                </router-link>
                <span class="c-pagination__first" v-else>
                    <i class="fa fa-angle-double-left" aria-hidden="true"></i>
                </span>

                <router-link :to="generatePageLink({start: prevPageStart})" class="c-pagination__prev" title="Go to the previous page" v-if="currentPage > 0">
                    <i class="fa fa-angle-left" aria-hidden="true"></i>
                </router-link>
                <span class="c-pagination__prev" v-else>
                    <i class="fa fa-angle-left" aria-hidden="true"></i>
                </span>

                <pagination-link v-for="index in range" :current="currentPage" :page="index" :size="pagination.size" :key="index"></pagination-link>

                <router-link :to="generatePageLink({start: nextPageStart})" class="c-pagination__next" title="Go to the next page" v-if="currentPage < (totalPages - 1)">
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                </router-link>
                <span class="c-pagination__next" v-else>
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                </span>

                <router-link :to="generatePageLink({start: lastPageStart})" class="c-pagination__last" title="Jump to the last page" v-if="end < totalPages">
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                </router-link>
                <span class="c-pagination__last" v-else>
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                </span>
            </nav>
        </div>
    </div>
</template>

<script>
	import ComponentPaginationLink from './PaginationLink.vue';

	export default {
		data: function () {
			return {
				range: [],
				size: this.pagination.size || 10,
				start: 1,
				end: 1,
			};
		},
		computed: {
			displaySize: function () {
				return this.pagination.size > 0;
			},
			displayPagination: function () {
				return this.pagination.total > this.pagination.size;
			},
			currentPage: function () {
				return (this.pagination.start / this.pagination.size);
			},
			totalPages: function () {
				return Math.ceil(this.pagination.total / this.pagination.size);
			},
			prevPageStart: function () {
				return (this.currentPage - 1) * this.pagination.size;
			},
			nextPageStart: function () {
				return (this.currentPage + 1) * this.pagination.size;
			},
			lastPageStart: function () {
				return (this.totalPages - 1) * this.pagination.size;
			}
		},
		props: {
			maxPaginationLinks: {
				type: Number,
				default: 5
			},
			pagination: {
				type: Object,
				default: function () {
					return {
						items: [],
						loaded: false,
						size: 0,
						start: 0,
						total: 0,
					};
				}
			}
		},
		created: function () {
			const vue = this;

			vue.start = ((vue.currentPage - Math.floor(vue.maxPaginationLinks / 2)) <= 0) ? 0 : (vue.currentPage - Math.floor(vue.maxPaginationLinks / 2));
			vue.end = ((vue.start + vue.maxPaginationLinks) > vue.totalPages) ? vue.totalPages : (vue.start + vue.maxPaginationLinks);
			vue.start = ((vue.end - vue.maxPaginationLinks) >= vue.start || (vue.end - vue.maxPaginationLinks) <= 0) ?
				vue.start : (vue.end - vue.maxPaginationLinks);

			vue.range = _.range(vue.start, vue.end);
		},
		methods: {
			selectPageSize: function () {
				const vue = this;
				vue.$router.push(vue.generatePageLink({size: vue.size, start: 0}));
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
			'pagination-link': ComponentPaginationLink,
		}
	};
</script>