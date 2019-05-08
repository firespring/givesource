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

        <td class="image u-text-c">
            <img alt="" :src="logoUrl" v-if="logoUrl">
        </td>

        <td>
            <strong>
                <router-link :to="{ name: 'sponsors-edit', params: {sponsorTierUuid: sponsor.sponsorTierUuid, sponsorUuid: sponsor.uuid} }">{{ sponsor.name }}</router-link>
            </strong>
        </td>

        <td class="icon">
            <a v-on:click.prevent="deleteSponsor" href="#" role="button" class="c-btn c-btn--sm c-btn--icon c-btn--bad c-btn--flat js-modal-trigger" rel="modal-confirm-delete">
                <i class="fa fa-trash" aria-hidden="true"></i>Delete
            </a>
        </td>
    </tr>
</template>

<script>
	export default {
		computed: {
			logoUrl() {
				return this.file.hasOwnProperty('path') ? this.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + this.file.path : false;
			}
		},
		props: {
			file: {
				type: Object,
				default() {
					return {};
				}
			},
			sponsor: {
				type: Object,
				default() {
					return {};
				}
			},
		},
		methods: {
			deleteSponsor() {
				const vm = this;

				vm.addModal('spinner');
				let promise = Promise.resolve();
				if (vm.sponsor.hasOwnProperty('fileUuid') && vm.sponsor.fileUuid) {
					promise = vm.$request.delete('files/' + vm.sponsor.fileUuid);
				}

				promise.then(() => {
					return vm.$request.delete('sponsor-tiers/' + vm.sponsor.sponsorTierUuid + '/sponsors/' + vm.sponsor.uuid);
				}).then(() => {
					vm.clearModals();
					vm.$emit('deleteSponsor', vm.sponsor.uuid);
				}).catch(err => {
					vm.clearModals();
					vm.$emit('hasError', err);
				});
			}
		}
	};
</script>