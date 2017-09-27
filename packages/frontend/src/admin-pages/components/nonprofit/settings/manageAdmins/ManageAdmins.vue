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
        <div class="o-app">
            <navigation :nonprofitUuid="nonprofitUuid"></navigation>
            <main class="o-app__main o-app__main--compact">
                <div class="o-app_main-content o-app_main-content--md">
                    <div class="o-app-main-content">

                        <div class="o-page-header" v-if="isAdmin">
                            <div class="o-page-header__text">
                                <nav class="o-page-header-nav c-breadcrumb">
                                    <span><router-link :to="{ name: 'nonprofits-list' }">Nonprofits</router-link></span>
                                    <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                                </nav>
                                <h1 class="o-page-header-title" v-if="nonprofit.legalName">Manage {{ nonprofit.legalName }}'s Admin Users</h1>
                            </div>
                        </div>

                        <div class="o-page-header" v-else>
                            <div class="o-page-header__text">
                                <nav class="o-page-header-nav c-breadcrumb">
                                    <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                                </nav>
                                <h1 class="o-page-header-title">Manage Admins</h1>
                            </div>
                        </div>

                        <div class="c-header-actions">
                            <div>
                                <router-link :to="{ name: 'nonprofit-settings-admins-invite' }" role="button" class="c-btn c-btn--sm c-btn--icon">
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>Invite Admins
                                </router-link>
                            </div>
                            <div class="c-header-actions__search u-flex-expand">
                                <form>
                                    <div class="c-form-control-grid">
                                        <div class="c-form-control-grid__item">
                                            <div class="u-control-icon u-control-icon--search">
                                                <input type="search" name="nameGroupDefaultLastName" id="nameGroupDefaultLastName" class="sm" placeholder="Search admins">
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <manage-admins-list-table :nonprofit="nonprofit"></manage-admins-list-table>

                        <div class="c-table-footer">
                            <div class="c-table-footer__actions">
                                <a href="#" role="button" class="c-btn c-btn--sm c-btn--flat c-btn--neutral c-btn--icon js-modal-trigger" rel="modal-confirm-remove-org-member">
                                    <i class="fa fa-minus-circle" aria-hidden="true"></i>Remove Selected
                                </a>
                            </div>
                            <div class="c-table-footer__rows-page">
                                <span>Show</span>
                                <select id="rowsPage" name="rowsPage" class="sm">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <span>rows/page</span>
                            </div>
                            <div class="c-table-footer__pagination">
                                <nav class="c-pagination">
                                    <span class="c-pagination__first"><i class="fa fa-angle-double-left" aria-hidden="true"></i></span>
                                    <span class="c-pagination__prev"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
                                    <strong class="c-pagination__here">1</strong>
                                    <a href="#">2</a>
                                    <a href="#">3</a>
                                    <a href="#">4</a>
                                    <a href="#">5</a>
                                    <a href="#" class="c-pagination__next" title="Go to the next page"><i class="fa fa-angle-right" aria-hidden="true"></i></a>
                                    <a href="#" class="c-pagination__last" title="Jump to the last page"><i class="fa fa-angle-double-right" aria-hidden="true"></i></a>
                                </nav>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				nonprofit: {}
			}
		},
		computed: {
			isAdmin: function () {
				return this.isSuperAdminUser() || this.isAdminUser();
			}
		},
		props: [
			'nonprofitUuid'
		],
		beforeRouteEnter: function (to, from, next) {
			next(function (vm) {
				axios.get(API_URL + '/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
					vm.nonprofit = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + '/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
				vue.nonprofit = response.data;
			}).then(function () {
				next();
			}).catch(function () {
				next();
			});
		},
		components: {
			'manage-admins-list-table': require('./ManageAdminsListTable.vue')
		}
	};
</script>