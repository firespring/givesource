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
        <td class="icon">
            <div class="c-drag-handle ui-sortable-handle"></div>
        </td>

        <td>
            <strong>{{ sponsorTier.name }}</strong>
        </td>

        <td class="item-actions">
            <div class="c-btn-group c-btn-dropdown c-btn-dropdown--r" ref="cBtnDropdown" v-on:mouseout="closeMenu" v-on:mouseover="cancelCloseMenu">
                <router-link :to="{ name: 'sponsors-list', params: {sponsorTierId: sponsorTier.id} }" role="button" class="c-btn c-btn--sm">
                    Manage Tier
                </router-link>
                <a v-on:click="toggleMenu" href="#" role="button" class="c-btn c-btn--sm c-btn-dropdown-trigger"></a>
                <div class="c-btn-dropdown-menu" ref="cBtnDropdownMenu">
                    <div class="c-btn-dropdown-menu__options">
                        <router-link :to="{name: 'sponsor-tiers-edit', params: {sponsorTierId: sponsorTier.id }}">
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

	export default {
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
				const fileIds = [];
				vue.$request.get('sponsor-tiers/' + vue.sponsorTier.id + '/sponsors').then(function (response) {
					response.data.forEach(function (sponsor) {
						sponsors.push(sponsor);
						if (sponsor.fileId) {
							fileIds.push(sponsor.fileId);
						}
					});
					return vue.$request.get('files', {
						uuids: fileIds
					});
				}).then(function (response) {
					return vue.$request.delete('files', {
						files: response.data
					});
				}).then(function () {
					return vue.$request.delete('sponsor-tiers/' + vue.sponsorTier.id + '/sponsors', {
						sponsors: sponsors
					});
				}).then(function () {
					return vue.$request.delete('sponsor-tiers/' + vue.sponsorTier.id);
				}).then(function () {
					vue.clearModals();
					vue.$emit('deleteSponsorTier', vue.sponsorTier.id);
				}).catch(function (err) {
					vue.clearModals();
                    vue.$emit('hasError', err);
				});
			}
		}

	}
</script>
