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
    <div class="o-app">
        <navigation></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content o-app_main-content--md">

                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'sponsor-tiers-list' }">Tiers</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">{{ sponsorTier.name }}</h1>
                    </div>
                </div>

                <div class="o-app-main-content">
                    <api-error v-model="apiError"></api-error>
                    <div class="c-header-actions">
                        <div>
                            <router-link :to="{ name: 'sponsors-add' }" role="button" class="c-btn c-btn--sm c-btn--icon">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i>Add Sponsor
                            </router-link>
                        </div>
                    </div>
                    <sponsors-list-table :sponsors="sponsors" :files="files" :sponsorTierUuid="sponsorTierUuid" v-on:hasError="hasError"></sponsors-list-table>
                </div>

            </div>
        </main>
    </div>
</template>

<script>
	import * as Utils from './../../../../helpers/utils';
	import ComponentSponsorsListTable from './SponsorsListTable.vue';

	export default {
		data: function () {
			return {
				files: [],
				sponsors: [],
				sponsorTier: {},
				apiError: {},
			};
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('sponsor-tiers/' + vue.sponsorTierUuid).then(function (response) {
					vue.sponsorTier = response.data;
					return vue.$request.get('sponsor-tiers/' + vue.sponsorTierUuid + '/sponsors');
				}).then(function (response) {
					response.data.sort(function (a, b) {
						return a.sortOrder - b.sortOrder;
					});
					vue.sponsors = response.data;
					const uuids = [];
					vue.sponsors.forEach(function (sponsor) {
						if (sponsor.fileUuid) {
							uuids.push(sponsor.fileUuid);
						}
					});
					if (uuids.length) {
						return vue.$request.get('files', {uuids: uuids});
					} else {
						return Promise.resolve();
					}
				}).then(function (response) {
					vue.files = response ? response.data : [];
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.$request.get('sponsor-tiers/' + vue.sponsorTierUuid).then(function (response) {
				vue.sponsorTier = response.data;
				return vue.$request.get('sponsor-tiers/' + vue.sponsorTierUuid + '/sponsors');
			}).then(function (response) {
				response.data.sort(function (a, b) {
					return a.sortOrder - b.sortOrder;
				});
				vue.sponsors = response.data;
				const uuids = [];
				vue.sponsors.forEach(function (sponsor) {
					if (sponsor.fileUuid) {
						uuids.push(sponsor.fileUuid);
					}
				});
				if (uuids.length) {
					return vue.$request.get('files', {uuids: uuids});
				} else {
					return Promise.resolve();
				}
			}).then(function (response) {
				vue.files = response ? response.data : [];
				next();
			}).catch(function (err) {
				vue.apiError = err.response.data.errors;
				next();
			});
		},
		props: [
			'sponsorTierUuid'
		],
		methods: {
			hasError: function (err) {
				const vue = this;
				vue.apiError = err.response.data.errors;
			}
		},
		components: {
			'sponsors-list-table': ComponentSponsorsListTable,
		}
	};
</script>