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
                <router-link :to="{ name: 'sponsors-list', params: {sponsorTierUuid: sponsorTier.uuid} }" role="button" class="c-btn c-btn--sm">
                    Manage Tier
                </router-link>
                <a v-on:click.prevent="toggleMenu" href="#" role="button" class="c-btn c-btn--sm c-btn-dropdown-trigger"></a>
                <div class="c-btn-dropdown-menu" ref="cBtnDropdownMenu">
                    <div class="c-btn-dropdown-menu__options">
                        <router-link :to="{name: 'sponsor-tiers-edit', params: {sponsorTierUuid: sponsorTier.uuid }}">
                            <i class="fa fa-fw fa-gear" aria-hidden="true"></i>Edit Tier Settings
                        </router-link>
                        <hr>
                        <a v-on:click.prevent="deleteSponsorTier" href="#" class="js-modal-trigger" rel="modal-confirm-delete">
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
		data() {
			return {
				displayingMenu: false,
				timer: null,
			};
		},
		props: {
			sponsorTier: {
				type: Object,
				default() {
					return {};
				}
			},
		},
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
			deleteSponsorTier() {
				const vm = this;

				vm.addModal('spinner');

				const sponsors = [];
				const fileUuids = [];
				vm.$request.get('sponsor-tiers/' + vm.sponsorTier.uuid + '/sponsors').then(response => {
					response.data.forEach(sponsor => {
						sponsors.push(sponsor);
						if (sponsor.fileUuid) {
							fileUuids.push(sponsor.fileUuid);
						}
					});
					return vm.$request.get('files', {
						uuids: fileUuids
					});
				}).then(response => {
					return vm.$request.delete('files', {
						files: response.data
					});
				}).then(() => {
					return vm.$request.delete('sponsor-tiers/' + vm.sponsorTier.uuid + '/sponsors', {
						sponsors: sponsors
					});
				}).then(() => {
					return vm.$request.delete('sponsor-tiers/' + vm.sponsorTier.uuid);
				}).then(() => {
					vm.clearModals();
					vm.$emit('deleteSponsorTier', vm.sponsorTier.uuid);
				}).catch(err => {
					vm.clearModals();
					vm.$emit('hasError', err);
				});
			}
		}

	}
</script>
