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
            <a v-on:click="exportDonations" href="#" role="button" class="c-btn c-btn--sm c-btn--icon"><i class="fa fa-cloud-download" aria-hidden="true"></i>Export Donations</a>
        </div>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				report: {},
				file: {},

				countdown: null,
			};
		},
		methods: {
			exportDonations: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('spinner');

				vue.$request.post('reports', {
					type: 'DONATIONS',
					name: 'donations',
				}).then(function (response) {
					vue.report = response.data;
					vue.pollReport();
				}).catch(function (err) {
					vue.clearModals();
                    vue.$emit('hasError', err);
				});
			},
			pollReport: function () {
				const vue = this;

				vue.countdown = setInterval(function () {
					vue.$store.commit('generateCacheKey');
					vue.$request.get('reports/' + vue.report.uuid).then(function (response) {
						vue.report = response.data;
						if (vue.report.status === 'SUCCESS') {
							vue.clearModals();
							clearTimeout(vue.countdown);
							vue.downloadFile();
						} else if (vue.report.status === 'FAILED') {
							vue.clearModals();
							clearTimeout(vue.countdown);
							console.log('Report failed to generate');
						}
					}).catch(function (err) {
                        const vue = this;
                        vue.$emit('hasError', err);
                    });
				}, 1000);
			},
			downloadFile: function () {
				const vue = this;

				vue.$request.get('files/' + vue.report.fileUuid).then(function (fileResponse) {
					vue.file = fileResponse.data;
					window.location.href = vue.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vue.file.path;
				});
			}
		}
	};
</script>