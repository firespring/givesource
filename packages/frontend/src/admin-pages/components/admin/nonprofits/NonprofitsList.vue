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

                    <div class="c-header-actions">
                        <div>
                            <router-link :to="{ name: 'add-nonprofit' }" role="button" class="c-btn c-btn--sm c-btn--icon"><i class="fa fa-plus-circle" aria-hidden="true"></i>Add Nonprofit
                            </router-link>
                        </div>
                        <div class="c-header-actions__search u-flex-expand">
                            <form>
                                <div class="c-form-control-grid">
                                    <div class="c-form-control-grid__item u-flex-collapse">
                                        <select id="selectMenuDefault" name="selectMenuDefault" class="sm u-width-auto">
                                            <option value="0">View all nonprofits</option>
                                            <option value="1">View verified</option>
                                            <option value="2">View pending</option>
                                            <option value="3">View denied</option>
                                        </select>
                                    </div>
                                    <div class="c-form-control-grid__item">
                                        <div class="u-control-icon u-control-icon--search">
                                            <input type="search" name="searchPayOuts" id="searchPayOuts" class="sm" placeholder="Search nonprofits">
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <nonprofits-list-table></nonprofits-list-table>

                    <div class="c-table-footer">
                        <div class="c-table-footer__actions">
                            <a href="#" class="c-btn c-btn--bad c-btn--sm c-btn--flat c-btn--icon js-modal-trigger" rel="modal-confirm-delete"><i class="fa fa-fw fa-trash"
                                                                                                                                                  aria-hidden="true"></i>Delete Selected</a>
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
</template>

<script>
    module.exports = {
        components: {
	        'nonprofits-list-table': require('./NonprofitsListTable.vue')
        }
    };
</script>