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
    <div class="sponsors wrapper" v-if="displaySponsorTiers">
        <h2 class="sponsors-title">Many Thanks To Our Sponsors</h2>

        <div v-for="sponsorTier in sponsorTiers" class="sponsors__tier" :class="getSponsorTierClass(sponsorTier.size)" :key="sponsorTier.uuid">
            <div class="sponsors__tier-title">
                <h3>{{ sponsorTier.name }}</h3>
            </div>

            <div class="sponsors__tier-list">
                <div v-for="sponsor in sponsors[sponsorTier.uuid]" :key="sponsor.uuid" class="sponsor" :class="{ 'sponsor--no-logo': !sponsor.fileUuid }">
                    <a v-if="sponsor.url" :href="sponsor.url" target="_blank" rel="noopener noreferrer">
                        <img v-if="sponsor.fileUuid" width="320" :alt="sponsor.name" :src="getSponsorImage(sponsor.fileUuid)">
                        <span class="logo-text" v-else>{{ sponsor.name }}</span>
                    </a>
                    <img v-else-if="sponsor.fileUuid" width="320" :alt="sponsor.name" :src="getSponsorImage(sponsor.fileUuid)">
                    <span class="logo-text" v-else>{{ sponsor.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import * as Utils from './../../helpers/utils';

	module.exports = {
		data: function () {
			return {
				files: {},
				loaded: false,
				sponsors: {},
				sponsorTiers: [],
			};
		},
		computed: {
			displaySponsorTiers: function () {
				return this.loaded && Object.keys(this.sponsors).length;
			}
		},
		created: function () {
			const vue = this;

			axios.get(API_URL + 'sponsor-tiers/').then(function (response) {
				response.data.sort(function (a, b) {
					return a.sortOrder - b.sortOrder;
				});
				vue.sponsorTiers = response.data;
			}).then(function () {
				let promise = Promise.resolve();
				vue.sponsorTiers.forEach(function (sponsorTier) {
					promise = promise.then(function () {
						return axios.get(API_URL + 'sponsor-tiers/' + sponsorTier.uuid + '/sponsors').then(function (response) {
							response.data.sort(function (a, b) {
								return a.sortOrder - b.sortOrder;
							});
							vue.sponsors[sponsorTier.uuid] = response.data;
							response.data.forEach(function (sponsor) {
								if (sponsor.fileUuid) {
									vue.files[sponsor.fileUuid] = {};
								}
							});
						});
					});
				});
				return promise;
			}).then(function () {
				const fileUuids = Object.keys(vue.files);
				if (fileUuids.length) {
					return axios.get(API_URL + 'files' + Utils.generateQueryString({uuids: fileUuids}));
				} else {
					return Promise.resolve();
				}
			}).then(function (response) {
				if (response && response.data) {
					response.data.forEach(function (file) {
						vue.files[file.uuid] = file;
					});
				}
			}).then(function () {
				vue.loaded = true;
			});
		},
		methods: {
			getSponsorTierClass: function (size) {
				switch (size) {
					case 'LARGE':
						return 'sponsors__tier--lg';
					case 'SMALL':
						return 'sponsors__tier--sm';
					default:
						return 'sponsors__tier--md';
				}
			},
			getSponsorImage: function (fileUuid) {
				const vue = this;

				const file = vue.files[fileUuid];
				return file.hasOwnProperty('path') ? vue.$store.getters.setting('UPLOADS_CLOUDFRONT_URL') + '/' + file.path : false;
			}
		}
	};
</script>