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
    <div class="o-menubar">
        <div class="o-menubar__primary">

            <div class="o-branding">
                <router-link :to="{name: 'donations-list'}" class="u-flex u-items-center">
                    <div class="o-branding__logo">
                        <img alt="Firespring Logo" src="../../assets/svg/firespring-wordmark-white.svg" class="logo svg">
                    </div>
                    <span class="o-branding__app-name">Givesource</span>
                </router-link>
            </div>

            <div class="o-user">
                <div class="o-user__current o-menubar-popup-parent" ref="oMenubarPopupParent" v-on:mouseout="closeMenu" v-on:mouseover="cancelCloseMenu">
                    <a href="#" class="js-user-popup-toggle has-tooltip" title="Manage Your Account" v-on:click="toggleMenu">
                        <v-gravatar :email="user.email" :size="150" default-img="mm" :alt="gravatarAlt" class="o-user__avatar"></v-gravatar>
                    </a>
                    <div class="o-menubar-popup o-menubar-popup--current-user" ref="oMenubarPopup">
                        <div class="o-menubar-popup__header o-current-user" v-if="firstName">
                            <div class="o-current-user-info">
                                <div class="account-user-name">
                                    <strong>{{ firstName }} {{ lastName }}</strong>
                                </div>
                            </div>
                        </div>

                        <nav class="o-menubar-popup__nav">
                            <ul>
                                <li>
                                    <router-link :to="{name: 'user-account'}"><i class="fa fa-fw fa-user" aria-hidden="true"></i>Your Account</router-link>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <router-link :to="{ name: 'logout' }"><i class="fa fa-fw fa-sign-out" aria-hidden="true"></i>Sign Out</router-link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <component :is="isAdmin ? 'navigation-admin' : 'navigation-nonprofit'" :nonprofitUuid="nonprofitUuid"></component>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				firstName: this.user.firstName,
				lastName: this.user.lastName,
				gravatarAlt: this.user.firstName && this.user.lastName ? this.user.firstName + ' ' + this.user.lastName : 'Avatar',
				navigationComponent: 'navigation-nonprofit',

                displayingMenu: false,
                timer: null,
			}
		},
		computed: {
			isAdmin: function () {
				return this.isSuperAdminUser() || this.isAdminUser();
			}
		},
		props: [
			'nonprofitUuid'
		],
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
		beforeMount: function () {
			document.body.classList.add('has-menubar', 'has-menubar--secondary');
		},
        methods: {
			toggleMenu: function (event) {
				event.preventDefault();
				const vue = this;
				if (vue.displayingMenu) {
					$(vue.$refs.oMenubarPopupParent).removeClass('o-menubar-popup-parent--active');
					$(vue.$refs.oMenubarPopup).fadeOut(200);
                } else {
					$(vue.$refs.oMenubarPopupParent).addClass('o-menubar-popup-parent--active');
					$(vue.$refs.oMenubarPopup).fadeIn(200);
                }
				vue.displayingMenu = !vue.displayingMenu;
            },
	        closeMenu: function () {
		        const vue = this;
		        vue.timer = setTimeout(function () {
			        $(vue.$refs.oMenubarPopupParent).removeClass('o-menubar-popup-parent--active');
			        $(vue.$refs.oMenubarPopup).fadeOut(200);
			        vue.displayingMenu = false;
		        }, 500);
	        },
	        cancelCloseMenu: function () {
		        const vue = this;
		        clearTimeout(vue.timer);
	        }
        },
		components: {
			'navigation-nonprofit': require('./NavigationNonprofits.vue'),
			'navigation-admin': require('./NavigationAdmin.vue'),
		}
	};
</script>