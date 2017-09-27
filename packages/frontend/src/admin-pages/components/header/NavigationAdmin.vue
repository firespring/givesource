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
                    <span class="o-branding__app-name">Giving Day</span>
                </router-link>
            </div>

            <div class="o-menubar-app">
            </div>


            <div class="o-user">
                <div class="o-user__current o-menubar-popup-parent">
                    <a href="#" class="js-user-popup-toggle has-tooltip" title="Manage Your Account">
                        <v-gravatar :email="user.email" :size="150" default-img="mm" :alt="gravatarAlt" class="o-user__avatar"></v-gravatar>
                    </a>
                    <div class="o-menubar-popup o-menubar-popup--current-user">
                        <div class="o-menubar-popup__header o-current-user" v-if="firstName">
                            <div class="o-current-user-info">
                                <div class="account-user-name">
                                    <strong>{{ firstName }} {{ lastName }}</strong>
                                </div>
                            </div>
                        </div>

                        <nav class="o-menubar-popup__nav">
                            <ul>
                                <li><router-link :to="{name: 'user-account'}"><i class="fa fa-fw fa-user" aria-hidden="true"></i>Your Account</router-link></li>
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

        <div class="o-menubar__secondary">

            <ul>
                <router-link tag="li" :to="{ name: 'donations-list' }">
                    <a><i class="fa fa-fw fa-credit-card" aria-hidden="true"></i>Donations</a>
                </router-link>
                <router-link tag="li" :to="{ name: 'nonprofits-list' }">
                    <a><i class="fa fa-fw fa-bank" aria-hidden="true"></i>Nonprofits</a>
                </router-link>
                <router-link tag="li" :to="{ name: 'donors' }">
                    <a><i class="fa fa-fw fa-users" aria-hidden="true"></i>Donors</a>
                </router-link>
                <router-link tag="li" :to="{ name: 'sponsors-tiers-list' }">
                    <a><i class="fa fa-fw fa-star" aria-hidden="true"></i>Sponsors</a>
                </router-link>
                <router-link tag="li" :to="{ name: 'pages' }">
                    <a><i class="fa fa-fw fa-files-o" aria-hidden="true"></i>Pages</a>
                </router-link>
                <router-link tag="li" :to="{ name: 'reports' }">
                    <a><i class="fa fa-fw fa-bar-chart" aria-hidden="true"></i>Reports</a>
                </router-link>
                <router-link tag="li" :to="{ name: 'settings-list' }">
                    <a><i class="fa fa-fw fa-cogs" aria-hidden="true"></i>Settings</a>
                </router-link>
                <router-link tag="li" :to="{ name: 'help' }">
                    <a><i class="fa fa-fw fa-question-circle" aria-hidden="true"></i>Help</a>
                </router-link>
            </ul>

            <select class="js-menubar-nav-select">
                <option value="#" selected>Donations</option>
                <option value="#">Nonprofits</option>
                <option value="#">Content</option>
                <option value="#">Messages</option>
                <option value="#">Reports</option>
                <option value="#">Settings</option>
                <option value="#">Help</option>
            </select>

        </div>

    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				firstName: this.user.firstName,
                lastName: this.user.lastName,
				gravatarAlt: this.user.firstName && this.user.lastName ? this.user.firstName + ' ' + this.user.lastName : 'Avatar'
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
        }
	};
</script>