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
                <div class="o-app-main-content">
                    <section class="c-page-section c-page-section--headless c-page-section--border c-page-section--shadow c-page-section--segmented">
                        <div class="c-page-section__main">

                            <div class="c-page-section-segment">
                                <h3 class="c-page-section-segment__title">
                                    <router-link :to="{ name: 'nonprofit-settings-manage-organization' }">Manage Organization Info</router-link>
                                </h3>
                                <div class="c-notes c-notes--below">
                                    Manage your organization's info, including contact info and categories.
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-page-section-segment">
                                <h3 class="c-page-section-segment__title">
                                    <router-link :to="{ name: 'nonprofit-settings-thank-you-message' }">Thank You Message</router-link>
                                </h3>
                                <div class="c-notes c-notes--below">
                                    Configure the thank you message that your donors will receive.
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-page-section-segment">
                                <h3 class="c-page-section-segment__title">
                                    <router-link :to="{ name: 'nonprofit-settings-notifications' }">Donation Notifications</router-link>
                                </h3>
                                <div class="c-notes c-notes--below">
                                    Control how often you receive donation notifications.
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-page-section-segment">
                                <h3 class="c-page-section-segment__title">
                                    <router-link :to="{ name: 'nonprofit-settings-admins-list' }">Manage Admins</router-link>
                                </h3>
                                <div class="c-notes c-notes--below">
                                    Invite additional individuals to help you manage your donation page.
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-page-section-segment">
                                <h3 class="c-page-section-segment__title">
                                    <router-link :to="{ name: 'nonprofit-settings-request-name-change' }">Request Name Change</router-link>
                                </h3>
                                <div class="c-notes c-notes--below">
                                    Fill out this form to request that your organization name be changed by the Giving Day event admin.
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
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