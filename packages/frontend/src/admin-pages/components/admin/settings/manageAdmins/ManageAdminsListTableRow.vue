<!--
  ~ Copyright 2019 Firespring, Inc.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
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
                        <a :href="'mailto:' + adminUser.email">{{ adminUser.email }}</a>
                    </div>
                </div>
            </div>
        </td>
        <td class="u-nowrap u-text-r">
            <div class="date">{{ formattedDate }}</div>
        </td>
        <td class="u-nowrap">
            <div v-if="!isSuperAdmin" class="c-btn-dropdown c-btn-dropdown--r" ref="cBtnDropdown" v-on:mouseout="closeMenu" v-on:mouseover="cancelCloseMenu">
                <a v-on:click.prevent="toggleMenu" href="#" role="button" class="c-btn c-btn--sm c-btn-dropdown-trigger c-btn-dropdown-trigger--only"></a>
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
	export default {
		data() {
			return {
				displayingMenu: false,
				selectedAdminUser: this.adminUser,
				timer: null,
			};
		},
		computed: {
			formattedDate() {
				return new Date(this.adminUser.createdOn).toLocaleDateString();
			},
			isSuperAdmin() {
				return _.includes(this.adminUser.groups, 'SuperAdmin');
			}
		},
		props: [
			'adminUser'
		],
		methods: {
			toggleMenu() {
				const vm = this;

				if (vm.displayingMenu) {
					$(vm.$refs.cBtnDropdown).removeClass('c-btn-dropdown--active');
					$(vm.$refs.cBtnDropdownMenu).fadeOut();
				} else {
					$(vm.$refs.cBtnDropdown).addClass('c-btn-dropdown--active');
					$(vm.$refs.cBtnDropdownMenu).fadeIn();
				}
				vm.displayingMenu = !vm.displayingMenu;
			},
			closeMenu() {
				const vm = this;

				vm.timer = setTimeout(() => {
					$(vm.$refs.cBtnDropdown).removeClass('c-btn-dropdown--active');
					$(vm.$refs.cBtnDropdownMenu).fadeOut();
					vm.displayingMenu = false;
				}, 250);
			},
			cancelCloseMenu() {
				const vm = this;
				clearTimeout(vm.timer);
			},
			removeUser() {
				const vm = this;
				vm.bus.$emit('deleteUserAdminModal', vm.selectedAdminUser);
			},
			resendVerificationEmail() {
				const vm = this;

				vm.addModal('spinner');
				vm.$request.post('users/' + vm.adminUser.uuid + '/resend-verification-email').then(() => {
					vm.clearModals();
				}).catch(err => {
					console.log(err);
					vm.clearModals();
				});
			},
		}
	};
</script>