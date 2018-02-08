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
    <tr>
        <td class="image">
            <v-gravatar :email="adminUser.email" :size="150" default-img="mm"></v-gravatar>
        </td>
        <td>
            <div class="c-user-strip u-flex u-items-center">
                <div class="c-user-strip__content u-flex u-items-center">
                    <div class="c-user-strip__name">
                        <strong>{{ adminUser.firstName }} {{ adminUser.lastName }}</strong>
                    </div>
                    <div class="c-user-strip__email u-icon u-flex u-items-center">
                        <a :href="`mailto:${ adminUser.email }`">{{ adminUser.email }}</a>
                    </div>
                </div>
            </div>
        </td>
        <td class="u-nowrap u-text-r">
            <div class="date">{{ formattedDate }}</div>
        </td>
        <td class="u-nowrap">
            <div v-if="!isSuperAdmin" class="c-btn-dropdown c-btn-dropdown--r" ref="cBtnDropdown" v-on:mouseout="closeMenu" v-on:mouseover="cancelCloseMenu">
                <a v-on:click="toggleMenu" href="#" role="button" class="c-btn c-btn--sm c-btn-dropdown-trigger c-btn-dropdown-trigger--only"></a>
                <div class="c-btn-dropdown-menu" ref="cBtnDropdownMenu">
                    <div class="c-btn-dropdown-menu__options" v-if="!adminUser.isVerified">
                        <a v-on:click.prevent="resendVerificationEmail" href="#">
                            <i class="fa fa-fw fa-envelope" aria-hidden="true"></i>Resend Verification Email
                        </a>
                    </div>
                    <div class="c-btn-dropdown-menu__options">
                        <a v-on:click.prevent="removeUser" href="#">
                            <i class="fa fa-fw fa-minus-circle" aria-hidden="true"></i>Remove
                        </a>
                    </div>
                </div>
            </div>
            <span v-else>(Administrator)</span>
        </td>
    </tr>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				displayingMenu: false,
				selectedAdminUser: this.adminUser,
                timer: null,
			}
		},
		computed: {
			formattedDate: function () {
				return new Date(this.adminUser.createdOn).toLocaleDateString();
			},
			isSuperAdmin: function () {
				return _.includes(this.adminUser.groups, 'SuperAdmin');
			}
		},
		props: [
			'adminUser'
		],
		methods: {
			toggleMenu: function (event) {
				event.preventDefault();
				const vue = this;
				if (vue.displayingMenu) {
					$(vue.$refs.cBtnDropdown).removeClass('c-btn-dropdown--active');
					$(vue.$refs.cBtnDropdownMenu).fadeOut();
				} else {
					$(vue.$refs.cBtnDropdown).addClass('c-btn-dropdown--active');
					$(vue.$refs.cBtnDropdownMenu).fadeIn();
				}
				vue.displayingMenu = !vue.displayingMenu;
			},
			closeMenu: function () {
				const vue = this;
				vue.timer = setTimeout(function () {
					$(vue.$refs.cBtnDropdown).removeClass('c-btn-dropdown--active');
					$(vue.$refs.cBtnDropdownMenu).fadeOut();
					vue.displayingMenu = false;
				}, 250);
			},
			cancelCloseMenu: function () {
				const vue = this;
				clearTimeout(vue.timer);
			},
			removeUser: function () {
				const vue = this;
				vue.bus.$emit('deleteUserAdminModal', vue.selectedAdminUser);
			},
			resendVerificationEmail: function () {
				const vue = this;

				vue.addModal('spinner');
				vue.$request.post('users/' + this.adminUser.uuid + '/resend-verification-email').then(function () {
					vue.clearModals();
				}).catch(function (err) {
					console.log(err);
					vue.clearModals();
				});
			},
		}
	};
</script>