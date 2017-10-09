<template>
    <div class="o-app">

        <!-- BEGIN app main -->
        <main class="o-app__main o-app__main--compact">

            <!-- BEGIN app main content wrapper -->
            <div class="o-app_main-content o-app_main-content--md">

                <div class="o-app-main-content">

                    <!-- BEGIN page header -->
                    <div class="o-page-header">

                        <div class="o-page-header__text">

                            <nav class="o-page-header-nav c-breadcrumb">

                                <span><a href="../../giving-day-npo/settings/">Settings</a></span>
                            </nav>
                            <h1 class="o-page-header-title">Manage Admins</h1>
                        </div>

                    </div>
                    <!-- END page header -->

                    <!-- BEGIN header actions -->
                    <div class="c-header-actions">

                        <div>
                            <a href="admins-invite.php" role="button" class="c-btn c-btn--sm c-btn--icon"><i class="fa fa-plus-circle" aria-hidden="true"></i>Invite Admins</a>
                        </div>

                        <!-- BEGIN header actions search -->
                        <div class="c-header-actions__search u-flex-expand">

                            <form method="post" action="/app-style/_devs/tables-search.php" novalidate="">

                                <div class="c-form-control-grid">

                                    <div class="c-form-control-grid__item">
                                        <div class="u-control-icon u-control-icon--search">
                                            <input type="search" name="nameGroupDefaultLastName" id="nameGroupDefaultLastName" class="sm" placeholder="Search admins">
                                        </div>
                                    </div>

                                </div>

                            </form>

                        </div>
                        <!-- END header actions search -->

                    </div>
                    <!-- END page search -->

                    <!-- BEGIN table -->
                    <table class="table-middle">
                        <thead>
                        <tr>
                            <th class="input">
                                <div class="checkbox checkbox--sm">
                                    <input type="checkbox" name="checkAllRows" id="checkAllRows-1" class="check-all-rows js-check-all-rows" value="1">
                                    <label for="checkAllRows-1"></label>
                                </div>
                            </th>
                            <th class="icon"><i class="fa fa-picture-o" aria-hidden="true"></i></th>
                            <th class="u-width-100p sortable sortable--asc">
                                <a href="#">Name</a>
                            </th>
                            <th class="sortable">
                                <a href="#">Added</a>
                            </th>
                            <th></th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            <td class="input">
                                <div class="checkbox checkbox--sm js-check-this-row">
                                    <input type="checkbox" name="checkThisRow[]" id="checkThisRow-1" class="check-this-row" value="1">
                                    <label for="checkThisRow-1"></label>
                                </div>
                            </td>
                            <td class="image">
                                <!--<img width="600" height="600" alt="Bono" src="../../_theme/photos/bono.jpg">-->
                            </td>
                            <td>

                                <div class="c-user-strip u-flex u-items-center">

                                    <div class="c-user-strip__content u-flex u-items-center">

                                        <div class="c-user-strip__name">
                                            <strong>Bono</strong>
                                        </div>

                                        <div class="c-user-strip__email u-icon u-flex u-items-center">
                                            <a href="mailto:bono@bono.com">bono@bono.com</a>
                                        </div>

                                    </div>

                                </div>

                            </td>
                            <td class="u-nowrap u-text-r">
                                <div class="date">10/17/2016</div>
                            </td>
                            <td class="u-nowrap">
                                <a href="add1.php" role="button" class="c-btn c-btn--sm c-btn--flat c-btn--neutral c-btn--icon js-modal-trigger" rel="modal-confirm-remove-org-member"><i class="fa fa-minus-circle" aria-hidden="true"></i>Remove</a>
                            </td>
                        </tr>

                        <tr>
                            <td class="input">
                                <div class="checkbox checkbox--sm js-check-this-row">
                                    <input type="checkbox" name="checkThisRow[]" id="checkThisRow-3" class="check-this-row" value="3">
                                    <label for="checkThisRow-1"></label>
                                </div>
                            </td>
                            <td class="image">
                                <!--<img width="400" height="400" alt="Nick Cave" src="../../_theme/photos/nick-cave.jpg">-->
                            </td>
                            <td>

                                <div class="c-user-strip u-flex u-items-center">

                                    <div class="c-user-strip__content u-flex u-items-center">

                                        <div class="c-user-strip__name">
                                            <strong>Nick Cave</strong>
                                        </div>

                                        <div class="c-user-strip__email u-icon u-flex u-items-center">
                                            <a href="mailto:nick@nickcave.com">nick@nickcave.com</a>
                                        </div>

                                    </div>

                                </div>

                            </td>
                            <td class="u-nowrap u-text-r">
                                <div class="date">10/17/2016</div>
                            </td>
                            <td class="u-nowrap">
                                <a href="add1.php" role="button" class="c-btn c-btn--sm c-btn--flat c-btn--neutral c-btn--icon js-modal-trigger" rel="modal-confirm-remove-org-member"><i class="fa fa-minus-circle" aria-hidden="true"></i>Remove</a>
                            </td>
                        </tr>

                        <tr>
                            <td class="input">
                                <div class="checkbox checkbox--sm js-check-this-row">
                                    <input type="checkbox" name="checkThisRow[]" id="checkThisRow-2" class="check-this-row" value="2">
                                    <label for="checkThisRow-1"></label>
                                </div>
                            </td>
                            <td class="image">
                                <!--<img width="400" height="400" alt="Lisa Gerrard" src="../../_theme/photos/lisa-gerrard.jpg">-->
                            </td>
                            <td>

                                <div class="c-user-strip u-flex u-items-center">

                                    <div class="c-user-strip__content u-flex u-items-center">

                                        <div class="c-user-strip__name">
                                            <strong>Lisa Gerrard</strong>
                                        </div>

                                        <div class="c-user-strip__email u-icon u-flex u-items-center">
                                            <a href="mailto:lisa@lisagerrard.com">lisa@lisagerrard.com</a>
                                        </div>

                                    </div>

                                </div>

                            </td>
                            <td class="u-nowrap u-text-r">
                                <div class="date">10/17/2016</div>
                            </td>
                            <td class="u-nowrap">
                                <a href="add1.php" role="button" class="c-btn c-btn--sm c-btn--flat c-btn--neutral c-btn--icon js-modal-trigger" rel="modal-confirm-remove-org-member"><i class="fa fa-minus-circle" aria-hidden="true"></i>Remove</a>
                            </td>
                        </tr>

                        <tr>
                            <td class="input">
                                <div class="checkbox checkbox--sm js-check-this-row">
                                    <input type="checkbox" name="checkThisRow[]" id="checkThisRow-4" class="check-this-row" value="4">
                                    <label for="checkThisRow-1"></label>
                                </div>
                            </td>
                            <td class="image">
                                <!--<img width="600" height="600" alt="Liz Fraser" src="../../_theme/photos/liz-fraser.jpg">-->
                            </td>
                            <td>

                                <div class="c-user-strip u-flex u-items-center">

                                    <div class="c-user-strip__content u-flex u-items-center">

                                        <div class="c-user-strip__name">
                                            <strong>Liz Fraser</strong>
                                        </div>

                                        <div class="c-user-strip__email u-icon u-flex u-items-center">
                                            <a href="mailto:liz@lizfraser.com">liz@lizfraser.com</a>
                                        </div>

                                    </div>

                                </div>

                            </td>
                            <td class="u-nowrap u-text-r">
                                <div class="date">10/17/2016</div>
                            </td>
                            <td class="u-nowrap">
                                <a href="add1.php" role="button" class="c-btn c-btn--sm c-btn--flat c-btn--neutral c-btn--icon js-modal-trigger" rel="modal-confirm-remove-org-member"><i class="fa fa-minus-circle" aria-hidden="true"></i>Remove</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <!-- END table -->

                    <!-- BEGIN table footer -->
                    <div class="c-table-footer">

                        <!-- BEGIN table footer actions -->
                        <div class="c-table-footer__actions">

                            <a href="#" role="button" class="c-btn c-btn--sm c-btn--flat c-btn--neutral c-btn--icon js-modal-trigger" rel="modal-confirm-remove-org-member"><i class="fa fa-minus-circle" aria-hidden="true"></i>Remove Selected</a>

                        </div>
                        <!-- END table footer actions -->

                        <!-- BEGIN table footer rows/page -->
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
                        <!-- END table footer rows/page -->

                        <!-- BEGIN table footer pagination -->
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
                        <!-- END table footer pagination -->

                    </div>
                    <!-- END table footer -->

                </div>

            </div>
            <!-- END app main content wrapper -->

        </main>
        <!-- END app main -->

    </div>
</template>