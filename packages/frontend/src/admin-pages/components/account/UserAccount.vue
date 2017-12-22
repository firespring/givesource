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
            <div class="o-app_main-content o-app_main-content">
                <div class="o-app_main-content o-app_main-content--md">
                    <div class="o-app-main-content ">

                        <div class="o-page-header" v-if="firstName">
                            <div class="o-page-header__text">
                                <h1 class="o-page-header-title">Hi, {{ firstName }}!</h1>
                                From here, you can modify the various aspects of your account.
                            </div>
                        </div>

                        <section class="c-page-section c-page-section--border c-page-section--shadow">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title" id="section-your-info">Your Info</h2>
                                </div>
                                <div class="c-page-section-header-actions">
                                    <button v-on:click="editUserInfo" class="c-btn c-btn--xs c-btn--flat c-btn--icon">
                                        <i class="fa fa-pencil" aria-hidden="true"></i>Edit
                                    </button>
                                </div>
                            </header>
                            <div class="c-page-section__main">
                                <div class="c-page-section-segment">
                                    <h4 class="u-margin-none">Name</h4>
                                    <div class="u-break-word">{{ firstName }} {{ lastName }}</div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title" id="section-password-security">Password &amp; Security</h2>
                                </div>
                            </header>
                            <div class="c-page-section__main">
                                <div class="c-page-section-segment o-grid o-grid--sm-middle">
                                    <div class="o-grid-col o-grid-col--sm-expand">
                                        <h4 class="u-margin-none">Password</h4>
                                        <div class="u-break-word">********</div>
                                    </div>
                                    <div class="o-grid-col o-grid-col--sm-shrink">
                                        <button v-on:click="editPassword" class="c-btn c-btn--xs c-btn--flat c-btn--icon">
                                            <i class="fa fa-pencil" aria-hidden="true"></i>Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div class="u-margin-top-scale">
                            <button v-on:click="deleteAccount" class="c-btn c-btn--sm c-btn--bad c-btn--icon c-btn--text">
                                <i class="fa fa-fw fa-trash" aria-hidden="true"></i>Delete Your Account
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				firstName: this.user.firstName || '',
                lastName: this.user.lastName || '',
                nonprofitUuid: this.user.nonprofitUuid,
            }
        },
		created: function () {
			const vue = this;

			vue.bus.$on('userAccountUpdateInfo', function (data) {
				vue.firstName = data.firstName;
				vue.lastName = data.lastName;
            });
        },
        beforeDestroy: function () {
			const vue = this;

			vue.bus.$off('userAccountUpdateInfo');
        },
		methods: {
			editUserInfo: function () {
				this.addModal('account-edit-info');
			},
			editPassword: function () {
				this.addModal('account-edit-password');
			},
			deleteAccount: function (event) {
				// TODO: Delete User Account
			}
		},
	}
</script>