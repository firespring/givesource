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
    <div class="c-header-actions">

        <div>
            <a v-on:click="exportDonations" href="#" role="button" class="c-btn c-btn--sm c-btn--icon"><i class="fa fa-cloud-download" aria-hidden="true"></i>Export Donations</a>
        </div>

        <div class="c-header-actions__search u-flex-expand">
            <form>
                <div class="c-form-control-grid">
                    <div class="c-form-control-grid__item">
                        <div class="u-control-icon u-control-icon--search">
                            <input type="search" name="nameGroupDefaultLastName" id="nameGroupDefaultLastName" class="sm" placeholder="Search donations">
                        </div>
                    </div>
                </div>
            </form>
        </div>

    </div>
</template>

<script>
	const slug = require('slug');

	module.exports = {
		data: function () {
			return {
				report: {},
				file: {},

				countdown: null,
			};
		},
		props: {
			nonprofit: {}
		},
		methods: {
			exportDonations: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('spinner');

				vue.$request.post('reports', {
					type: 'DONATIONS',
					nonprofitUuid: vue.nonprofit.uuid,
					name: slug(vue.nonprofit.legalName),
				}).then(function (response) {
					vue.report = response.data;
					vue.pollReport();
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			},
			pollReport: function () {
				const vue = this;

				vue.countdown = setInterval(function () {
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
					});
				}, 1000);
			},
			downloadFile: function () {
				const vue = this;

				vue.$request.get('files/' + vue.report.fileUuid).then(function (fileResponse) {
					vue.file = fileResponse.data;
					window.location.href = vue.$store.getters.setting('UPLOADS_CLOUDFRONT_URL') + '/' + vue.file.path;
				});
			}
		}
	};
</script>