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
            <div class="o-app_main-content o-app_main-content--md">
                <div class="o-app-main-content">
                    <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                        <header class="c-page-section__header">
                            <div class="c-page-section-header-text">
                                <h2 class="c-page-section-title" id="section-select-menus">Manage the pages that appear on your event site</h2>
                            </div>
                        </header>

                        <div class="c-page-section__main">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong><i class="fa fa-fw fa-file" aria-hidden="true"></i> <a href="#">About Us</a></strong>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        https://www.domain.com/about - Use this page to describe what your event is about, how it got started, and other important info.
                                    </div>
                                </div>
                                <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                    <div class="c-form-item__control">
                                        <div class="c-switch-control">
                                            <div>
                                                <input type="checkbox" name="page1" id="page1" value="1">
                                                <label for="page1" class="c-switch-lever"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong><i class="fa fa-fw fa-file" aria-hidden="true"></i> <a href="#">Frequently Asked Questions</a></strong>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        https://www.domain.com/faq - Use this page to answer all of your potential donors' questions.
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                    <div class="c-form-item__control">
                                        <div class="c-switch-control">
                                            <div>
                                                <input type="checkbox" name="page2" id="page2" value="1">
                                                <label for="page2" class="c-switch-lever"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong><i class="fa fa-fw fa-file" aria-hidden="true"></i> <a href="#">Toolkit</a></strong>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        https://www.domain.com/toolkit - Use this page to provide participating nonprofits with useful tools, images, and information to make their campaign more successful.
                                    </div>
                                </div>
                                <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                    <div class="c-form-item__control">
                                        <div class="c-switch-control">
                                            <div>
                                                <input type="checkbox" name="page3" id="page3" value="1">
                                                <label for="page3" class="c-switch-lever"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong><i class="fa fa-fw fa-file" aria-hidden="true"></i> <a href="#">Contact Us</a></strong>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        https://www.domain.com/contact - Use this page to provide site visitors with a contact form so they can easily contact you.
                                    </div>
                                </div>
                                <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                    <div class="c-form-item__control">
                                        <div class="c-switch-control">
                                            <div>
                                                <input type="checkbox" name="page4" id="page4" value="1">
                                                <label for="page4" class="c-switch-lever"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>
</template>