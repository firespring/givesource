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
    <div class="o-app o-app--no-nav o-app--centered">
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--xs">

                <section class="c-page-section c-page-section--border c-page-section--shadow">
                    <header class="c-page-section__header u-justify-center">
                        <a href="#"><img alt="Firespring Logo" src="../../../assets/svg/firespring-wordmark-white.svg" class="logo"></a>
                    </header>

                    <component :is="mainComponent" v-on:setMainComponent="setMainComponent"
                               v-on:setCognitoUser="setCognitoUser" v-bind:cognitoUser="cognitoUser">
                    </component>

                </section>

                <section class="c-page-section" style="margin-top: 1rem; padding: 0 1rem;">
                    <div class="c-notes c-page-section__main u-text-c">
                        Other info and links can go here.
                    </div>
                </section>

            </div>
        </main>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				mainComponent: 'forgot-password-form',
				cognitoUser: {},
			}
		},
		components: {
			'forgot-password-form': require('./ForgotPasswordForm.vue'),
			'forgot-password-verify-form': require('./ForgotPasswordVerifyForm.vue')
		},
		methods: {
			setMainComponent: function (component) {
				this.mainComponent = component;
			},
			setCognitoUser: function (cognitoUser) {
				this.cognitoUser = cognitoUser;
			}
		}
	};
</script>