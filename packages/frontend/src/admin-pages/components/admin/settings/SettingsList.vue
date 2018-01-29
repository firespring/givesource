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
                    <div class="o-app-main-content">
                        <section class="c-page-section c-page-section--headless c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <div class="c-page-section__main">

                                <div class="c-page-section-segment">
                                    <h3 class="c-page-section-segment__title">
                                        <router-link :to="{ name: 'settings-event' }">Event Settings</router-link>
                                    </h3>
                                    <div class="c-notes c-notes--below">
                                        Modify your event's name, dates, etc.
                                    </div>
                                </div>

                                <hr class="expand">

                                <div class="c-page-section-segment">
                                    <h3 class="c-page-section-segment__title">
                                        <router-link :to="{ name: 'settings-contact' }">Contact Settings</router-link>
                                    </h3>
                                    <div class="c-notes c-notes--below">
                                        Manage the email addresses and contact methods associated with your account.
                                    </div>
                                </div>

                                <hr class="expand">

                                <div class="c-page-section-segment">
                                    <h3 class="c-page-section-segment__title">
                                        <router-link :to="{ name: 'site-appearance' }">Site Appearance</router-link>
                                    </h3>
                                    <div class="c-notes c-notes--below">
                                        Modify your site's logo, colors, and other visual settings.
                                    </div>
                                </div>

                                <hr class="expand" v-if="isSuperAdmin">

                                <div class="c-page-section-segment" v-if="isSuperAdmin">
                                    <h3 class="c-page-section-segment__title">
                                        <router-link :to="{ name: 'settings-payment-gateway' }">Payment Gateway Settings</router-link>
                                    </h3>
                                    <div class="c-notes c-notes--below">
                                        Integrate with PaymentSpring to process credit cards.
                                    </div>
                                </div>

                                <hr class="expand">

                                <div class="c-page-section-segment">
                                    <h3 class="c-page-section-segment__title">
                                        <router-link :to="{ name: 'settings-admins-list' }">Manage Admins</router-link>
                                    </h3>
                                    <div class="c-notes c-notes--below">
                                        Invite additional admin users
                                    </div>
                                </div>

                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
	module.exports = {
		computed: {
			isSuperAdmin: function () {
				return this.isSuperAdminUser();
			},
		}
	};
</script>