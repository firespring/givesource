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
    <!--<div class="o-app">-->
    <!--<navigation></navigation>-->
        <!--&lt;!&ndash; BEGIN app main &ndash;&gt;-->
        <!--<main class="o-app__main o-app__main&#45;&#45;compact">-->

            <!--&lt;!&ndash; BEGIN app main content wrapper &ndash;&gt;-->
            <!--<div class="o-app_main-content o-app_main-content&#45;&#45;md">-->

                <!--&lt;!&ndash; BEGIN page header &ndash;&gt;-->
                <!--<div class="o-page-header">-->

                    <!--<div class="o-page-header__text">-->

                        <!--<nav class="o-page-header-nav c-breadcrumb">-->

                            <!--<span><a href="../../giving-day-foundation/sponsors/">Sponsors</a></span><span><a href="../../giving-day-foundation/sponsors/tier.php">Gold</a></span>-->
                        <!--</nav>-->
                        <!--<h1 class="o-page-header-title">Add Sponsor</h1>-->
                    <!--</div>-->

                <!--</div>-->
                <!--&lt;!&ndash; END page header &ndash;&gt;-->

                <!--<div class="o-app-main-content">-->

                    <!--&lt;!&ndash; BEGIN form &ndash;&gt;-->
                    <!--<form method="post" action="tier.php" novalidate="">-->

                        <!--<section class="c-page-section c-page-section&#45;&#45;border c-page-section&#45;&#45;shadow c-page-section&#45;&#45;headless">-->

                            <!--<div class="c-page-section__main">-->

                                <!--<div class="c-form-item c-form-item&#45;&#45;text c-form-item&#45;&#45;required">-->

                                    <!--<div class="c-form-item__label">-->

                                        <!--<label for="sponsorName" class="c-form-item-label-text">Name</label>-->

                                    <!--</div>-->

                                    <!--<div class="c-form-item__control">-->

                                        <!--<input type="text" name="sponsorName" id="sponsorName">-->

                                    <!--</div>-->

                                <!--</div>-->

                                <!--<div class="c-form-item c-form-item&#45;&#45;url">-->

                                    <!--<div class="c-form-item__label">-->

                                        <!--<label for="sponsorUrl" class="c-form-item-label-text">URL</label>-->

                                    <!--</div>-->

                                    <!--<div class="c-form-item__control">-->

                                        <!--<div class="u-control-icon u-control-icon&#45;&#45;url">-->
                                            <!--<input type="url" name="sponsorUrl" id="sponsorUrl" placeholder="http://">-->
                                        <!--</div>-->

                                    <!--</div>-->

                                <!--</div>-->

                                <!--<div class="c-form-item c-form-item&#45;&#45;select">-->

                                    <!--<div class="c-form-item__label">-->

                                        <!--<label for="sponsorTier" class="c-form-item-label-text">Tier</label>-->

                                    <!--</div>-->

                                    <!--<div class="c-form-item__control">-->

                                        <!--<select id="sponsorTier" name="sponsorTier" class="u-width-auto">-->
                                            <!--<option value="1">Platinum</option>-->
                                            <!--<option value="2" selected="">Gold</option>-->
                                            <!--<option value="3">Silver</option>-->
                                            <!--<option value="4">Bronze</option>-->
                                        <!--</select>-->

                                    <!--</div>-->

                                <!--</div>-->

                                <!--<div class="c-form-item c-form-item&#45;&#45;file">-->

                                    <!--<div class="c-form-item__label">-->
                                        <!--<label for="fileFieldDefault" class="c-form-item-label-text">Logo</label>-->

                                        <!--<div class="c-notes">-->
                                            <!--If no logo is uploaded, one will be automatically generated based on the sponsor's name.-->
                                        <!--</div>-->
                                    <!--</div>-->

                                    <!--<div class="c-form-item__control">-->

                                        <!--<input type="file" name="fileFieldDefault" id="fileFieldDefault" data-filenames="fileFieldDefaultFilenames">-->
                                        <!--<button type="button" class="c-btn c-btn&#45;&#45;good" id="fileFieldDefaultTrigger" data-control="fileFieldDefault" data-filenames="fileFieldDefaultFilenames">Select File</button>-->
                                        <!--<div class="filenames" id="fileFieldDefaultFilenames"></div>-->

                                        <!--<script>-->
											<!--$(document).ready(function() {-->

												<!--$('#fileFieldDefaultTrigger').click(function(e) {-->
													<!--var relatedControl = $(this).attr('data-control');-->
													<!--$('#' + relatedControl).trigger('click');-->
													<!--e.preventDefault();-->
												<!--});-->

												<!--$('#fileFieldDefault').change(function(e) {-->
													<!--var filenames = '';-->
													<!--var filenameList = $(this).attr('data-filenames');-->
													<!--if (this.files && this.files.length > 1) {-->
														<!--filenames = this.files.length + ' files selected';-->
													<!--} else if (e.target.value) {-->
														<!--filenames = e.target.value.split('\\').pop();-->
													<!--}-->
													<!--if (filenames) {-->
														<!--$('#' + filenameList).addClass('has-files').html(filenames);-->
													<!--} else {-->
														<!--$('#' + filenameList).removeClass('has-files').html('No file selected');-->
													<!--}-->
												<!--});-->

											<!--});-->
                                        <!--</script>-->

                                    <!--</div>-->

                                <!--</div>-->

                            <!--</div>-->

                        <!--</section>-->

                        <!--&lt;!&ndash; BEGIN form actions &ndash;&gt;-->
                        <!--<footer class="c-form-actions">-->

                            <!--<button type="submit" class="c-btn">Save &amp; Add Another</button>-->
                            <!--<button type="submit" class="c-btn">Save &amp; Finish</button>-->
                            <!--<a href="tier.php" class="c-btn c-btn&#45;&#45;text c-btn&#45;&#45;neutral">Cancel</a>-->

                        <!--</footer>-->
                        <!--&lt;!&ndash; END form actions &ndash;&gt;-->

                    <!--</form>-->
                    <!--&lt;!&ndash; END form &ndash;&gt;-->

                <!--</div>-->

            <!--</div>-->
            <!--&lt;!&ndash; END app main content wrapper &ndash;&gt;-->

        <!--</main>-->
        <!--&lt;!&ndash; END app main &ndash;&gt;-->

    <!--</div>-->
</template>