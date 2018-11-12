<!--
  ~ Copyright 2018 Firespring, Inc.
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
    <div class="c-header-actions">
        <div>
            <router-link :to="{ name: 'donations-add' }" role="button" class="c-btn c-btn--sm c-btn--icon">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>Add Offline Donations
            </router-link>
            <a v-on:click.prevent="exportDonations" href="#" role="button" class="c-btn c-btn--sm c-btn--icon"><i class="fa fa-cloud-download" aria-hidden="true"></i>Export Donations</a>
        </div>
    </div>
</template>

<script>
	export default {

		data() {
			return {
				report: {},
				file: {},
				downloaded: false,

				countdown: null,
			};
		},

		methods: {
			exportDonations() {
				const vm = this;

				vm.addModal('spinner');

				vm.$request.post('reports', {
					type: 'DONATIONS',
					name: 'donations',
				}).then(response => {
					vm.report = response.data;
					vm.pollReport();
				}).catch(err => {
					vm.clearModals();
					vm.$emit('hasError', err);
				});
			},

			pollReport() {
				const vm = this;

				if (vm.downloaded) {
					vm.clearModals();
					vm.downloadFile();

				} else {
					vm.countdown = setInterval(() => {
						vm.$store.commit('generateCacheKey');

						vm.$request.get('reports/' + vm.report.uuid).then(response => {
							vm.report = response.data;

							if (vm.report.status === 'SUCCESS') {
								vm.clearModals();
								clearTimeout(vm.countdown);

								if (!vm.downloaded) {
									vm.downloadFile();
								}

							} else if (vm.report.status === 'FAILED') {
								vm.clearModals();
								clearTimeout(vm.countdown);
								console.log('Report failed to generate');
							}

						}).catch(err => {
							vm.clearModals();
							vm.$emit('hasError', err);
						});

					}, 1000);
				}

			},

			downloadFile() {
				const vm = this;

				let promise = Promise.resolve();

				if (!vm.downloaded) {
					promise = promise.then(() => {
						return vm.$request.get('files/' + vm.report.fileUuid);
					}).then(response => {
						vm.file = response.data;
						vm.downloaded = true;
					});
				}

				promise = promise.then(() => {
					window.location.href = vm.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vm.file.path;
				});
			}
		}
	};
</script>