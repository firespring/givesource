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

                <section class="c-page-section c-page-section--border c-page-section--shadow" v-bind:class="{ 'c-page-section--headless': displayHeader }">
                    <header class="c-page-section__header u-justify-center" v-if="displayHeader">
                        <a href="#"><img alt="Firespring Logo" src="../../../assets/svg/firespring-wordmark-white.svg" class="logo"></a>
                    </header>


                    <component :is="mainComponent" v-on:setMainComponent="setMainComponent"
                               v-on:setDisplayHeader="setDisplayHeader" v-on:setDisplayLinks="setDisplayLinks"
                               v-on:setCognitoUser="setCognitoUser" v-bind:cognitoUser="cognitoUser"
                               v-on:setUserAttributes="setUserAttributes" v-bind:userAttributes="userAttributes"></component>
                </section>

                <section class="c-page-section" style="margin-top: 1rem; padding: 0 1rem;" v-if="displayLinks">
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
				displayHeader: true,
				displayLinks: true,
				mainComponent: 'login-form',
				cognitoUser: null,
				userAttributes: null,
			}
		},
        beforeMount: function () {
	        document.body.classList.remove('has-menubar', 'has-menubar--secondary');
        },
		components: {
			'login-form': require('./LoginForm.vue'),
			'password-reset-form': require('./PasswordResetForm.vue')
		},
		methods: {
			setDisplayHeader: function (displayHeader) {
				this.displayHeader = displayHeader;
			},
			setDisplayLinks: function (displayLinks) {
				this.displayLinks = displayLinks;
			},
			setMainComponent: function (component) {
				this.mainComponent = component;
			},
			setCognitoUser: function (cognitoUser) {
				this.cognitoUser = cognitoUser;
			},
			setUserAttributes: function (userAttributes) {
				this.userAttributes = userAttributes;
			}
		}
	};
</script>