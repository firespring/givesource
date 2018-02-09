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
    <div class="o-app">
        <navigation></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content">

                <div class="o-app-main-content">
                    <donations-metrics v-on:hasError="hasError"></donations-metrics>
                    <api-error v-model="apiError"></api-error>
                    <donations-list-table-header v-on:hasError="hasError"></donations-list-table-header>
                    <donations-list-table :donations="pagination.items" :loaded="pagination.loaded"></donations-list-table>
                    <paginated-table-footer :pagination="pagination" v-if="pagination.loaded"></paginated-table-footer>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import * as Utils from './../../../helpers/utils';

    const PaginationMixin = require('./../../../mixins/pagination');

    module.exports = {
        data: function () {
            return {
                apiError: {}
            };
        },
        beforeRouteEnter: function (to, from, next) {
            next(function (vue) {
                vue.$request.get('donations', to.query).then(function (response) {
                    vue.setPaginationData(response.data)
                });
            });
        },
        beforeRouteUpdate: function (to, from, next) {
            const vue = this;

            vue.resetPaginationData();
            vue.$request.get('donations', to.query).then(function (response) {
                vue.setPaginationData(response.data);
                next();
            }).catch(function (err) {
                vue.apiError = err.response.data.errors;
                next();
            });
        },
        methods: {
           hasError: function(err) {
               const vue = this;
               vue.apiError = err.response.data.errors;
           }
        },
        mixins: [
            PaginationMixin
        ],
        components: {
            'donations-list-table': require('./DonationsListTable.vue'),
            'donations-list-table-header': require('./DonationsListTableHeader.vue'),
            'donations-metrics': require('./DonationsMetrics.vue'),
            'paginated-table-footer': require('./../../pagination/PaginatedTableFooter.vue')
        }
    };
</script>