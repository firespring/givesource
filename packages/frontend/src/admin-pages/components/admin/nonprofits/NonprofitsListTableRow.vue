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
        <td class="input">
            <div class="checkbox checkbox--sm js-check-this-row">
                <input type="checkbox" name="checkThisRow[]" id="checkThisRow-1" class="check-this-row" value="1">
                <label for="checkThisRow-1"></label>
            </div>
        </td>

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

        <td class="u-nowrap">
            <div class="c-user-strip u-flex u-items-center">
                <div class="c-user-strip__content">
                    <div class="c-user-strip__name">
                        John Smith
                    </div>
                    <div class="c-user-strip__email u-icon u-flex u-items-center c-notes">
                        <a href="mailto:john.smith@nonprofit.org">john.smith@nonprofit.org</a>
                    </div>
                </div>
            </div>
        </td>

        <td class="u-nowrap u-text-r" v-if="canAcceptDonations">
            <router-link :to="{ name: 'nonprofit-donations-list', params: { nonprofitUuid: nonprofit.uuid } }">{{ donationAmount }}</router-link>
        </td>
        <td class="u-nowrap u-text-r" v-else>
            {{ donationAmount }}
        </td>

        <td>
            <div class="c-btn-dropdown c-btn-dropdown--r" ref="cBtnDropdown" v-on:mouseout="closeMenu" v-on:mouseover="cancelCloseMenu">
                <a v-on:click="toggleMenu" href="#" role="button" class="c-btn c-btn--sm c-btn-dropdown-trigger c-btn-dropdown-trigger--only js-btn-dropdown-trigger"></a>

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
                    </div>
                </div>
            </div>
        </td>

    </tr>
</template>

<script>
	const numeral = require('numeral');

	module.exports = {
		data: function () {
			return {
				displayingMenu: false,
				timer: null,
			};
		},
		computed: {
			date: function () {
				return new Date(this.nonprofit.createdOn).toLocaleDateString();
			},
			time: function () {
				return new Date(this.nonprofit.createdOn).toLocaleTimeString();
			},
			donationAmount: function () {
				return numeral(this.nonprofit.donationsSubtotal / 100).format('$0,0.00');
			},
			canAcceptDonations: function () {
				return this.nonprofit.status === 'ACTIVE';
			},
			canChangeStatus: function () {
				return this.nonprofit.status === 'PENDING';
			},
			canDeleteNonprofit: function () {
				return this.nonprofit.status === 'DENIED';
			},
			canEditNonprofitDetails: function () {
				return this.nonprofit.status === 'ACTIVE' || this.nonprofit.status === 'PENDING';
			},
			canEditNonprofitDonationPage: function () {
				return this.nonprofit.status === 'ACTIVE';
			},
			statusLabelClass: function () {
				switch (this.nonprofit.status) {
					case 'ACTIVE':
						return 'c-label--good';
					case 'PENDING':
						return 'c-label--neutral';
					default:
						return 'c-label--bad';
				}
			},
			statusIconClass: function () {
				switch (this.nonprofit.status) {
					case 'ACTIVE':
						return 'fa-check-circle';
					case 'PENDING':
						return 'fa-question-circle';
					default:
						return 'fa-ban';
				}
			},
			statusLabel: function () {
				switch (this.nonprofit.status) {
					case 'ACTIVE':
						return 'Active';
					case 'PENDING':
						return 'Pending';
					case 'DENIED':
						return 'Denied';
				}
				return false;
			}
		},
		props: [
			'nonprofit'
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
            updateStatus: function (status) {
				const vue = this;

				vue.addModal('spinner');

	            vue.$request.patch('nonprofits/' + vue.nonprofit.uuid + '/status', {
					status: status
                }).then(function () {
                	vue.clearModals();
                	vue.$emit('updateNonprofit', vue.nonprofit.uuid);
                }).catch(function (err) {
                	vue.clearModals();
                	console.log(err);
                })
            }
		}
	};
</script>