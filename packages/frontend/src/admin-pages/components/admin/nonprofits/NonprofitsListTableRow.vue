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
                    <strong><router-link :to="{ name: 'nonprofit-settings-manage-organization', params: { nonprofitUuid: nonprofit.uuid } }">{{ nonprofit.legalName }}</router-link></strong>
                    <div class="c-notes">
                        Tax ID: {{ nonprofit.taxId }}
                    </div>
                </div>


                <div class="u-margin-left-thick" id="paymentStatus">

                    <div class="c-label c-label--neutral" v-if="nonprofit.status === 'PENDING'">
                        <i class="fa fa-question-circle" aria-hidden="true"></i> Pending
                    </div>


                    <div class="c-label c-label--good" v-if="nonprofit.status === 'ACTIVE'">
                        <i class="fa fa-check-circle" aria-hidden="true"></i> Active
                    </div>


                    <div class="c-label c-label--bad" v-if="nonprofit.status === 'DENIED'">
                        <i class="fa fa-ban" aria-hidden="true"></i> Denied
                    </div>

                    <div class="c-label c-label--bad" v-if="nonprofit.status === 'REVOKED'">
                        <i class="fa fa-ban" aria-hidden="true"></i> Revoked
                    </div>

                </div>
            </div>

        </td>
        <td class="u-nowrap u-text-r">
            <div class="date">{{ getDate(nonprofit.createdOn) }}</div>
            <div class="time">{{ getTime(nonprofit.createdOn) }}</div>
        </td>
        <td class="u-nowrap">

            <div class="c-user-strip u-flex u-items-center">
                <div class="c-user-strip__content">

                    <div class="c-user-strip__name">
                        FIX
                    </div>

                    <div class="c-user-strip__email u-icon u-flex u-items-center c-notes">
                        <a href="mailto:john.smith@email.com">FIX</a>
                    </div>

                </div>
            </div>

        </td>
        <td class="u-nowrap u-text-r">
            <router-link :to="{ name: 'nonprofit-donations-list', params: { nonprofitUuid: nonprofit.uuid } }">{{ formatSum(nonprofit.donationsSum) }}</router-link>
        </td>
        <td>

            <div class="c-btn-dropdown c-btn-dropdown--r" ref="cBtnDropdown" v-on:mouseout="closeMenu" v-on:mouseover="cancelCloseMenu">
                <a v-on:click="toggleMenu" href="#" role="button" class="c-btn c-btn--sm c-btn-dropdown-trigger c-btn-dropdown-trigger--only js-btn-dropdown-trigger"></a>

                <div class="c-btn-dropdown-menu" ref="cBtnDropdownMenu">
                    <div class="c-btn-dropdown-menu__options">
                        <a href="#"><i class="fa fa-fw fa-ban" aria-hidden="true"></i>Deny Nonprofit</a>
                        <a href="#"><i class="fa fa-fw fa-question-circle" aria-hidden="true"></i>Change to Pending</a>
                        <hr>
                        <router-link :to="{ name: 'nonprofit-your-page', params: { nonprofitUuid: nonprofit.uuid } }">
                            <i class="fa fa-fw fa-gear" aria-hidden="true"></i>Manage Donation Page
                        </router-link>
                        <hr>
                        <a href="#" class="js-modal-trigger" rel="modal-confirm-delete"><i class="fa fa-fw fa-trash" aria-hidden="true"></i>Delete Nonprofit</a>
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
		props: [
			'nonprofit'
		],
        methods: {
	        getDate: function (createdOn) {
		        return new Date(createdOn).toLocaleDateString();
	        },
	        getTime: function (createdOn) {
		        return new Date(createdOn).toLocaleTimeString();
	        },
	        formatSum: function (donationsSum) {
		        return numeral(donationsSum / 100).format('$0,0.00');
	        },
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
            }
        }
	};
</script>