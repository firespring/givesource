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
                            <span><router-link :to="{ name: 'sponsors-tiers-list' }">Sponsors</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Gold</h1>
                    </div>
                </div>

                <div class="o-app-main-content">

                    <div class="c-header-actions">
                        <div>
                            <router-link :to="{ name: 'sponsors-add' }" role="button" class="c-btn c-btn--sm c-btn--icon">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i>Add Sponsor
                            </router-link>
                        </div>
                    </div>

                    <sponsors-list-table></sponsors-list-table>

                </div>
            </div>
        </main>
    </div>
</template>

<script>
	module.exports = {
		components: {
			'sponsors-list-table': require('./SponsorsListTable.vue')
		}
	};
</script>