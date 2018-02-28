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

	module.exports = {
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
		  hasError: function(err){
		      const vue = this;
              vue.apiError = err.response.data.errors;
          }
        },
		components: {
			'sponsors-list-table': require('./SponsorsListTable.vue')
		}
	};
</script>