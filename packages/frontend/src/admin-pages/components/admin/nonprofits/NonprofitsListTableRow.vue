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
            <a href="donations.php">{{ formatSum(nonprofit.donationsSum) }}</a>
        </td>
        <td>

            <div class="c-btn-dropdown c-btn-dropdown--r">
                <a href="#" role="button" class="c-btn c-btn--sm c-btn-dropdown-trigger c-btn-dropdown-trigger--only js-btn-dropdown-trigger"></a>

                <div class="c-btn-dropdown-menu">
                    <div class="c-btn-dropdown-menu__options">
                        <a href="#"><i class="fa fa-fw fa-ban" aria-hidden="true"></i>Deny Nonprofit</a>
                        <a href="#"><i class="fa fa-fw fa-question-circle" aria-hidden="true"></i>Change to Pending</a>
                        <hr>
                        <a href="manage-donation-page-content.php"><i class="fa fa-fw fa-gear" aria-hidden="true"></i>Manage Donation Page</a>
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
	        }
        }
	};
</script>