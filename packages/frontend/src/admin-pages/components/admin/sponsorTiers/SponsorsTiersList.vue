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
                <div class="o-app-main-content">
                    <api-error v-model="apiError"></api-error>

                    <div class="c-header-actions">
                        <div>
                            <router-link :to="{ name: 'sponsor-tiers-add' }" role="button" class="c-btn c-btn--sm c-btn--icon">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i>Add Sponsor Tier
                            </router-link>
                        </div>
                    </div>

                    <sponsors-list-table :sponsorTiers="sponsorTiers"></sponsors-list-table>

                </div>
            </div>
        </main>
    </div>
</template>
<script>
	module.exports = {
		data: function () {
			return {
				sponsorTiers: [],
                apiError: {},
			};
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('sponsor-tiers').then(function (response) {
					response.data.sort(function (a, b) {
						return a.sortOrder - b.sortOrder;
					});
					vue.sponsorTiers = response.data;
				}).catch(function (err) {
                    vue.apiError = err.response.data.errors;
                });
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.$request.get('sponsor-tiers').then(function (response) {
				response.data.sort(function (a, b) {
					return a.sortOrder - b.sortOrder;
				});
				vue.sponsorTiers = response.data;
				next();
			}).catch(function (err) {
                vue.apiError = err.response.data.errors;
				next();
			});
		},
		components: {
			'sponsors-list-table': require('./SponsorsTiersListTable.vue')
		}
	};
</script>