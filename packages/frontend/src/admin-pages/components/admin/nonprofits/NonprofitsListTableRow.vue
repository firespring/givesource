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
        <td>
            <div class="u-flex">
                <div class="u-flex-expand">
                    <strong v-if="canEditNonprofitDetails">
                        <router-link :to="{ name: 'nonprofit-settings-manage-organization', params: { nonprofitUuid: nonprofit.uuid } }">{{ nonprofit.legalName }}</router-link>
                    </strong>
                    <strong v-else>{{ nonprofit.legalName }}</strong>
                    <div class="c-notes">
                        Tax ID: {{ nonprofit.taxId }}
                    </div>
                </div>

                <div class="u-margin-left-thick" id="paymentStatus">
                    <div class="c-label c-label--neutral" :class="statusLabelClass" v-if="statusLabel">
                        <i class="fa" :class="statusIconClass" aria-hidden="true"></i> {{ statusLabel }}
                    </div>
                </div>
            </div>
        </td>

        <td class="u-nowrap u-text-r">
            <div class="date">{{ date }}</div>
            <div class="time">{{ time }}</div>
        </td>

        <td class="u-nowrap u-text-r" v-if="canAcceptDonations">
            <router-link :to="{ name: 'nonprofit-donations-list', params: { nonprofitUuid: nonprofit.uuid } }">{{ donationAmount }}</router-link>
        </td>
        <td class="u-nowrap u-text-r" v-else>
            {{ donationAmount }}
        </td>

        <td>
            <div v-if="canModify" class="c-btn-dropdown c-btn-dropdown--r" ref="cBtnDropdown" v-on:mouseout="closeMenu" v-on:mouseover="cancelCloseMenu">
                <a v-on:click.prevent="toggleMenu" href="#" role="button" class="c-btn c-btn--sm c-btn-dropdown-trigger c-btn-dropdown-trigger--only js-btn-dropdown-trigger"></a>

                <div class="c-btn-dropdown-menu" ref="cBtnDropdownMenu">
                    <div class="c-btn-dropdown-menu__options">
                        <a v-on:click.prevent="updateStatus('DENIED')" href="#" v-if="canChangeStatus"><i class="fa fa-fw fa-ban" aria-hidden="true"></i>Deny Nonprofit</a>
                        <a v-on:click.prevent="updateStatus('ACTIVE')" href="#" v-if="canChangeStatus"><i class="fa fa-fw fa-check-circle" aria-hidden="true"></i>Activate Nonprofit</a>

                        <hr v-if="canChangeStatus && canEditNonprofitDetails">

                        <router-link :to="{ name: 'nonprofit-settings-list', params: { nonprofitUuid: nonprofit.uuid } }" v-if="canEditNonprofitDetails">
                            <i class="fa fa-fw fa-gear" aria-hidden="true"></i>Manage Settings
                        </router-link>
                        <router-link :to="{ name: 'nonprofit-your-page', params: { nonprofitUuid: nonprofit.uuid } }" v-if="canEditNonprofitDonationPage">
                            <i class="fa fa-fw fa-gear" aria-hidden="true"></i>Manage Donation Page
                        </router-link>

                        <a href="#" class="js-modal-trigger" rel="modal-confirm-delete" v-if="canDeleteNonprofit">
                            <i class="fa fa-fw fa-trash" aria-hidden="true"></i>Delete Nonprofit
                        </a>

                        <hr v-if="canRevoke">
                        <a v-on:click.prevent="revokeNonprofit" href="#" v-if="canRevoke"><i class="fa fa-fw fa-ban" aria-hidden="true"></i>Revoke Nonprofit</a>
                    </div>
                </div>
            </div>
        </td>

    </tr>
</template>

<script>
	const numeral = require('numeral');

	export default {
		data() {
			return {
				displayingMenu: false,
				timer: null,
				apiError: {}
			};
		},
		computed: {
			date() {
				return new Date(this.nonprofit.createdOn).toLocaleDateString();
			},
			time() {
				return new Date(this.nonprofit.createdOn).toLocaleTimeString();
			},
			donationAmount() {
				return numeral(this.nonprofit.donationsSubtotal / 100).format('$0,0.00');
			},
			canAcceptDonations() {
				return this.nonprofit.status === 'ACTIVE';
			},
			canChangeStatus() {
				return this.nonprofit.status === 'PENDING';
			},
			canDeleteNonprofit() {
				return this.nonprofit.status === 'DENIED';
			},
			canEditNonprofitDetails() {
				return this.nonprofit.status === 'ACTIVE' || this.nonprofit.status === 'PENDING';
			},
			canEditNonprofitDonationPage() {
				return this.nonprofit.status === 'ACTIVE';
			},
			canRevoke() {
				return this.nonprofit.status === 'ACTIVE';
			},
			canModify() {
				return this.nonprofit.status !== 'REVOKED';
			},
			statusLabelClass() {
				switch (this.nonprofit.status) {
					case 'ACTIVE':
						return 'c-label--good';
					case 'PENDING':
						return 'c-label--neutral';
					default:
						return 'c-label--bad';
				}
			},
			statusIconClass() {
				switch (this.nonprofit.status) {
					case 'ACTIVE':
						return 'fa-check-circle';
					case 'PENDING':
						return 'fa-question-circle';
					default:
						return 'fa-ban';
				}
			},
			statusLabel() {
				switch (this.nonprofit.status) {
					case 'ACTIVE':
						return 'Active';
					case 'PENDING':
						return 'Pending';
					case 'DENIED':
						return 'Denied';
					case 'REVOKED':
						return 'Revoked';
				}
				return false;
			}
		},
		props: [
			'nonprofit'
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
			updateStatus(status) {
				const vm = this;

				vm.addModal('spinner');

				vm.$request.patch('nonprofits/' + vm.nonprofit.uuid + '/status', {
					status: status
				}).then(() => {
					vm.clearModals();
					vm.$emit('updateNonprofit', vm.nonprofit.uuid);
				}).catch(err => {
					vm.clearModals();
					vm.$emit('hasError', err);
				})
			},
			revokeNonprofit() {
				const vm = this;
				vm.addModal('nonprofits-revoke', {nonprofit: vm.nonprofit});
			}
		}
	};
</script>