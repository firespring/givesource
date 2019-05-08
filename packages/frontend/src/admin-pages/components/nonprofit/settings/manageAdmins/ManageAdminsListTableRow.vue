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
            <v-gravatar :email="nonprofitUser.email" :size="150" default-img="mm"></v-gravatar>
        </td>

        <td>

            <div class="c-user-strip u-flex u-items-center">
                <div class="c-user-strip__content u-flex u-items-center">
                    <div class="c-user-strip__name">
                        <strong>{{ nonprofitUser.firstName }} {{ nonprofitUser.lastName }}</strong>
                    </div>
                    <div class="c-user-strip__email u-icon u-flex u-items-center">
                        <a :href="'mailto:' + nonprofitUser.email">{{ nonprofitUser.email }}</a>
                    </div>
                </div>
            </div>
        </td>

        <td class="u-nowrap u-text-r">
            <div class="date">{{ formattedDate }}</div>
        </td>

        <td class="u-nowrap">
            <div class="c-btn-dropdown c-btn-dropdown--r" ref="cBtnDropdown" v-on:mouseout="closeMenu" v-on:mouseover="cancelCloseMenu">
                <a v-on:click.prevent="toggleMenu" href="#" role="button" class="c-btn c-btn--sm c-btn-dropdown-trigger c-btn-dropdown-trigger--only"></a>
                <div class="c-btn-dropdown-menu" ref="cBtnDropdownMenu">
                    <div class="c-btn-dropdown-menu__options" v-if="!nonprofitUser.isVerified">
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
        </td>
    </tr>
</template>

<script>
	export default {
		data() {
			return {
				displayingMenu: false,
				selectedNonprofitUser: this.nonprofitUser,
				timer: null,
			};
		},
		computed: {
			formattedDate() {
				return new Date(this.nonprofitUser.createdOn).toLocaleDateString();
			}
		},
		props: [
			'nonprofitUser'
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
				vm.bus.$emit('deleteUserNonprofitModal', vm.selectedNonprofitUser);
			},
			resendVerificationEmail() {
				const vm = this;

				vm.addModal('spinner');
				vm.$request.post('users/' + vm.nonprofitUser.uuid + '/resend-verification-email').then(() => {
					vm.clearModals();
				}).catch(err => {
					console.log(err);
					vm.clearModals();
				});
			},
		}
	};
</script>