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
        <navigation :nonprofitUuid="nonprofitUuid"></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">

                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Request Name Change</h1>
                    </div>
                </div>

                <form>
                    <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
                        <div class="c-page-section__main">

                            <div class="c-form-item c-form-item--text c-form-item--required">
                                <div class="c-form-item__label">
                                    <label for="requestedName" class="c-form-item-label-text">Requested Name</label>
                                </div>
                                <div class="c-form-item__control">
                                    <input type="text" name="requestedName" id="requestedName" maxlength="200" value="">
                                    <div class="c-notes c-notes--below">
                                        Your nonprofit's current name is: Craig needs this functionality.
                                    </div>
                                </div>
                            </div>

                            <div class="c-form-item c-form-item--textarea">
                                <div class="c-form-item__label">
                                    <label for="changeReasons" class="c-form-item-label-text">Reasons for Name Change</label>
                                </div>
                                <div class="c-form-item__control">
                                    <textarea name="changeReasons" id="changeReasons" style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 100px;"></textarea>
                                </div>
                            </div>

                        </div>
                    </section>

                    <footer class="c-form-actions">
                        <button type="submit" class="c-btn">Submit Your Request</button>
                    </footer>
                </form>

            </div>
        </main>
    </div>
</template>

<script>
	module.exports = {
		props: [
			'nonprofitUuid'
		],
	};
</script>