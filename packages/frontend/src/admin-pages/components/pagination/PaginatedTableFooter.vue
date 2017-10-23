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
    <div class="c-table-footer">
        <div class="c-table-footer__actions">
            <div class="c-notes">
                All times in CDT.
            </div>
        </div>
        <div class="c-table-footer__rows-page">
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
	module.exports = {
		data: function () {
			return {
				range: [],
                size: this.pagination.size || 10,
				start: 1,
				end: 1,
			};
		},
		computed: {
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
				vue.$router.push({
                    name: vue.$route.name,
                    query: {
                    	size: vue.size,
                        start: 0
                    }
                });
            },
	        generatePageLink: function (query) {
		        const vue = this;
		        query = query || {};
		        return {
			        name: vue.$route.name,
			        query: _.extend({}, vue.$route.query, query)
		        };
	        }
        },
		components: {
			'pagination-link': require('./PaginationLink.vue')
		}
	};
</script>