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
    <div class="c-header-actions">

        <div>
            <a v-on:click.prevent="exportDonations" href="#" role="button" class="c-btn c-btn--sm c-btn--icon"><i class="fa fa-cloud-download" aria-hidden="true"></i>Export Donations</a>
        </div>

    </div>
</template>

<script>
	const slug = require('slug');

	export default {
		data() {
			return {
				report: {},
				file: {},
				downloaded: false,

				countdown: null,
			};
		},

		props: {
			nonprofit: {}
		},

		methods: {
			exportDonations() {
				const vm = this;

				vm.addModal('spinner');

				vm.$request.post('nonprofits/' + vm.nonprofit.id + '/reports', {
					type: 'DONATIONS',
					nonprofitId: vm.nonprofit.id,
					name: slug(vm.nonprofit.legalName),
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
					vm.downloadFile();
					vm.clearModals();

				} else {
					vm.countdown = setInterval(() => {
						vm.$store.commit('generateCacheKey');

						vm.$request.get('nonprofits/' + vm.nonprofit.id + '/reports/' + vm.report.id).then(response => {
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
						return vm.$request.get('files/' + vm.report.fileId);
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