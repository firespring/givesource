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
    <div id="modal-confirm-delete" class="c-modal c-modal--warning c-modal--sm" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">

                    <div class="c-modal-header">
                        <h1>Do you want to delete this page?</h1>
                    </div>


                    <div class="c-modal-content">
                        <div class="c-page-section">
                            <div class="c-page-section__main">
                                <p>

                                </p>
                            </div>
                        </div>

                        <div class="c-modal-footer">
                            <div class="c-modal-footer__actions">
                                <button v-on:click.prevent="deletePage" type="button" class="c-btn c-btn--bad">Yes, Delete This Page</button>
                                <button v-on:click.prevent="cancel" type="button" class="c-btn c-btn--neutral c-btn--text">No, Keep This Page</button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import {getSettingKeys} from './../../../../helpers/content';

	export default {
		props: {
			zIndex: {
				type: [Number, String],
				default: 1000
			},
			data: {
				type: Object,
				default: {
					contents: [],
					settings: [],
					pageId: null
				}
			}
		},
		methods: {
			cancel() {
				this.clearModals();
			},
			deletePage() {
				const vm = this;

				vm.addModal('spinner');

				vm.$request.delete('contents', {
					contents: vm.data.contents
				}).then(() => {
					const setting = _.find(vm.data.settings, {key: 'CUSTOM_PAGES'});
					const uuids = setting.value.split('|');
					const updatedUuids = uuids.filter((uuid) => {
						return uuid !== vm.data.pageId;
					});

					let promise = Promise.resolve();
					if (updatedUuids.length) {
						setting.value = updatedUuids.join('|');
						promise = promise.then(() => {
							return vm.$request.patch('settings', {
								settings: [setting]
							});
						});
					} else {
						promise = promise.then(() => {
							return vm.$request.delete('settings', {
								settings: [setting]
							});
						});
					}

					promise = promise.then(() => {
						const keys = getSettingKeys(vm.data.pageId);
						const toDelete = [];

						keys.forEach((key) => {
							const setting = _.find(vm.data.settings, {key: key});
							if (setting) {
								toDelete.push(setting);
							}
						});

						return vm.$request.delete('settings', {
							settings: toDelete
						});
					});

					return promise;
				}).then(() => {
					vm.clearModals();
					vm.bus.$emit('deletePage');
				}).catch(() => {
					vm.clearModals();
				});
			},
		}
	};
</script>