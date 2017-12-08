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
        <td class="icon">
            <div class="c-drag-handle ui-sortable-handle"></div>
        </td>

        <td>
            <strong>{{ sponsorTier.name }}</strong>
        </td>

        <td class="item-actions">
            <div class="c-btn-group c-btn-dropdown c-btn-dropdown--r" ref="cBtnDropdown" v-on:mouseout="closeMenu" v-on:mouseover="cancelCloseMenu">
                <router-link :to="{ name: 'sponsors-list', params: {sponsorTierUuid: sponsorTier.uuid} }" role="button" class="c-btn c-btn--sm c-btn--icon">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>Manage Tier
                </router-link>
                <a v-on:click="toggleMenu" href="#" role="button" class="c-btn c-btn--sm c-btn-dropdown-trigger js-btn-dropdown-trigger"></a>
                <div class="c-btn-dropdown-menu" ref="cBtnDropdownMenu">
                    <div class="c-btn-dropdown-menu__options">
                        <router-link :to="{name: 'sponsor-tiers-edit', params: {sponsorTierUuid: sponsorTier.uuid }}">
                            <i class="fa fa-fw fa-gear" aria-hidden="true"></i>Edit Tier Settings
                        </router-link>
                        <hr>
                        <a v-on:click="deleteSponsorTier" href="#" class="js-modal-trigger" rel="modal-confirm-delete">
                            <i class="fa fa-fw fa-trash" aria-hidden="true"></i>Delete This Tier
                        </a>
                    </div>
                </div>
            </div>
        </td>
    </tr>
</template>

<script>
	import * as Utils from './../../../helpers/utils';

	module.exports = {
		data: function () {
			return {
				displayingMenu: false,
				timer: null,
			};
		},
		props: {
			sponsorTier: {
				type: Object,
				default: function () {
					return {};
				}
			},
		},
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
			deleteSponsorTier: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('spinner');

				const sponsors = [];
				const fileUuids = [];
				axios.get(API_URL + 'sponsor-tiers/' + vue.sponsorTier.uuid + '/sponsors').then(function (response) {
					response.data.forEach(function (sponsor) {
						sponsors.push(sponsor);
						if (sponsor.fileUuid) {
							fileUuids.push(sponsor.fileUuid);
						}
					});
					return axios.get(API_URL + 'files' + Utils.generateQueryString({
						uuids: fileUuids
					}));
				}).then(function (response) {
					return axios.delete(API_URL + 'files', {
						data: {
							files: response.data
						}
					});
				}).then(function () {
					return axios.delete(API_URL + 'sponsor-tiers/' + vue.sponsorTier.uuid + '/sponsors', {
						data: {
							sponsors: sponsors
						}
					});
				}).then(function () {
					return axios.delete(API_URL + 'sponsor-tiers/' + vue.sponsorTier.uuid);
				}).then(function () {
					vue.clearModals();
					vue.$emit('deleteSponsorTier', vue.sponsorTier.uuid);
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			}
		}

	}
</script>
