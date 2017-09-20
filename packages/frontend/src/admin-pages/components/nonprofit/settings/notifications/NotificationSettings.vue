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
                <!-- BEGIN page header -->
                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                        <span>
                            <router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link>
                        </span>
                        </nav>
                        <h1 class="o-page-header-title">Donation Notifications</h1>
                    </div>
                </div>

                <form>
                    <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
                        <div class="c-page-section__main">

                            <div class="c-form-item c-form-item--radio">
                                <div class="c-form-item__label">
                                    <div class="c-form-item-label-text" id="radioDefault">How often do you want to receive donation notification emails?</div>
                                </div>
                                <div class="c-form-item__control">
                                    <ul class="c-input-list c-input-list--radio" aria-labelledby="radioDefault">
                                        <li>
                                            <input type="radio" name="notifications" id="notifications-1" value="1" checked="">
                                            <label for="notifications-1">Send notifications for every donation</label>
                                        </li>
                                        <li>
                                            <input type="radio" name="notifications" id="notifications-2" value="2">
                                            <label for="notifications-2">Hourly - You'll receive a summary of the previous hour's donations</label>
                                        </li>
                                        <li>
                                            <input type="radio" name="notifications" id="notifications-3" value="3">
                                            <label for="notifications-3">Daily - You'll receive a summary of the previous day's donations</label>
                                        </li>
                                        <li>
                                            <input type="radio" name="notifications" id="notifications-4" value="3">
                                            <label for="notifications-4">Don't send any donation notifications</label>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div class="c-notes u-margin-top-thick">
                                These settings will apply to all of <router-link to="admins">your donation page's admins</router-link>. Donation notifications will be sent from notifications@domain.com. Add that email address to your whitelist so that notifications aren't marked as spam.
                            </div>

                        </div>
                    </section>

                    <footer class="c-form-actions">
                        <button type="submit" class="c-btn">Save Changes</button>
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
		]
	};
</script>