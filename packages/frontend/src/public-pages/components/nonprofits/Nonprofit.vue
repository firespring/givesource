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
    <div>
        <layout-hero>
            <div slot="logo" v-if="logoUrl" class="page-hero__logo">
                <img width="320" height="140" :alt="nonprofit.legalName" :src="logoUrl">
            </div>
            <h1 slot="title">{{ nonprofit.legalName }}</h1>
        </layout-hero>

        <!-- BEGIN page main -->
        <main class="main">
            <div class="wrapper">

                <div class="donation-wrapper nonprofit-campaign">
                <api-error v-model="apiError"></api-error>

                    <div class="nonprofit-campaign__header">

                        <div class="nonprofit-campaign__donation">
                            <div v-if="displayDonationMetrics" class="donation-metrics">
                                <div class="donation-metrics__raised">
                                    <div class="num">{{ formatMoney(nonprofit.donationsSubtotal) }}</div>
                                    <div class="caption">Raised</div>
                                </div>

                                <div class="donation-metrics__donations">
                                    <div class="num">{{ nonprofit.donationsCount }}</div>
                                    <div class="caption">{{ donationsLabel }}</div>
                                </div>
                            </div>

                            <div class="donation-text">
                                <template v-if="nonprofit.shortDescription">
                                    {{ nonprofit.shortDescription }}
                                </template>
                                <template v-else>
                                    We’re the leading advocate for those affected by our cause. You can count on our organization to ensure your voice is heard. It’s with your help
                                    that we can make a difference.
                                </template>
                            </div>

                            <div v-if="canDonate" class="donation-action">
                                <a v-on:click="openDonations" href="#" class="btn btn--accent btn--lg btn--block donation-trigger">Donate</a>
                            </div>

                            <social-sharing network-tag="a"
                                            :url="pageUrl"
                                            :title="settings.SOCIAL_SHARING_DESCRIPTION"
                                            inline-template>
                                <div class="donation-share">
                                    <network network="facebook">
                                        <span class="btn btn--xs btn--dark btn--icon btn--facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i>Share</span>
                                    </network>
                                    <network network="twitter">
                                        <span class="btn btn--xs btn--dark btn--icon btn--twitter"><i class="fab fa-twitter" aria-hidden="true"></i>Tweet</span>
                                    </network>
                                </div>
                            </social-sharing>
                        </div>

                        <div ref="slider" class="nonprofit-campaign__slider" style="overflow: hidden;">
                            <template v-if="slides.length">
                                <div v-for="(slide, index) in slides" class="slide" style="display: flex; align-items: center;">
                                    <img v-if="slide.type === 'IMAGE'" alt="" :src="getImageUrl(slide.fileUuid)">
                                    <iframe v-else :src="slide.embedUrl" width="770" height="443" style="max-width: 100%;" frameborder="0" webkitallowfullscreen mozallowfullscreen
                                            allowfullscreen></iframe>
                                </div>
                            </template>
                            <div v-else class="nonprofit-campaign__slider" style="overflow: hidden;">
                                <img alt="" src="/assets/temp/community.jpg">
                            </div>
                        </div>
                    </div>

                    <div ref="sliderNav" class="nonprofit-campaign__slider-nav"></div>

                    <div class="nonprofit-campaign__content">
                        <div class="wrapper wrapper--sm">
                            <template v-if="nonprofit.longDescription">
                                <div v-html="nonprofit.longDescription"></div>
                            </template>
                            <template v-else>
                                <p>At the core of our mission is an unwavering determination to ensure the voice of our constituency is heard and to affect change in the lives of
                                    those we serve.</p>

                                <p>We bring change to our community by raising awareness and acting through our programs and services. We couldn’t achieve success without our
                                    dedicated staff, passionate volunteers and generous donors like you.</p>

                                <p>Your gifts, both large and small, will help us to achieve our mission of affecting change in our community. Thank you in advance for your
                                    generous support that sheds light on our cause for thousands each year.</p>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <layout-footer></layout-footer>
    </div>
</template>

<script>
	import * as Settings from './../../helpers/settings';
	import * as Utils from './../../helpers/utils';

	require('fireSlider.js/dist/jquery.fireSlider.velocity');

	module.exports = {
		data: function () {
			return {
				files: [],
				logo: null,
				nonprofit: {},
				slides: [],

				settings: {
					SOCIAL_SHARING_DESCRIPTION: ''
				},

                apiError: {},
            }
		},
		props: [
			'slug'
		],
		computed: {
			donationsLabel: function () {
				return this.nonprofit.donationsCount === 1 ? 'Donation' : 'Donations';
			},
			eventTitle: function () {
				return Settings.eventTitle();
			},
			pageTitle: function () {
				const vue = this;
				let title = vue.eventTitle + ' - Donate';
				if (vue.nonprofitLoaded) {
					title += ' to ' + vue.nonprofit.legalName;
				}
				return title;
			},
			displayDonationMetrics: function () {
				return Settings.isDayOfEventOrAfter();
			},
			canDonate: function () {
				return Settings.acceptDonations();
			},
			logoUrl: function () {
				const vue = this;
				let logo = false;
				if (vue.logo) {
					logo = vue.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vue.logo.path;
				} else if (vue.$store.getters.setting('EVENT_LOGO')) {
					logo = vue.$store.getters.setting('EVENT_LOGO');
				} else {
					logo = '/assets/temp/logo-event.png';
				}
				return logo;
			},
			pageUrl: function () {
				return document.location.origin;
			},
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('donation', 'donation--nonprofit');
			vue.setPageTitle(vue.pageTitle);
		},
		beforeRouteEnter: function (to, from, next) {
			let files = [];
			let logo = null;
			let slides = [];
			let nonprofit = null;

			let promise = Promise.resolve();
			if (to.meta.nonprofit !== null) {
				nonprofit = to.meta.nonprofit;
            } else {
				promise = promise.then(function () {
					return axios.get(API_URL + 'nonprofits/pages/' + to.params.slug).then(function (response) {
						nonprofit = response.data;
					});
                });
            }

			promise = promise.then(function () {
				return axios.get(API_URL + 'nonprofits/' + nonprofit.uuid + '/slides');
			}).then(function (response) {
				response.data.sort(function (a, b) {
					return a.sortOrder - b.sortOrder;
				});
				slides = response.data;
				const uuids = [];
				slides.forEach(function (slide) {
					if (slide.hasOwnProperty('fileUuid') && slide.fileUuid) {
						uuids.push(slide.fileUuid);
					}
				});
				return axios.get(API_URL + 'files/' + Utils.generateQueryString({uuids: uuids}));
			}).then(function (response) {
				if (response && response.data) {
					files = response.data;
				}
			});

			if (!_.isEmpty(nonprofit.logoFileUuid)) {
				promise = promise.then(function () {
					return axios.get(API_URL + 'files/' + nonprofit.logoFileUuid);
                }).then(function (response) {
					if (response && response.data) {
						logo = response.data;
					}
                });
            }

            promise.then(function () {
                next(function (vue) {
                	vue.files = files;
                	vue.logo = logo;
                	vue.nonprofit = nonprofit;
                	vue.slides = slides;
                    return vue.loadSettings();
                });
            });
		},
		mounted: function () {
			const vue = this;

			$(document).ready(function () {
				$(vue.$refs.slider).data({
					pager: $(vue.$refs.sliderNav)
				}).fireSlider({
					activePagerClass: 'current',
					hoverPause: true,
					pagerTemplate: '<a href="#"></a>',
					slide: 'div.slide',
				});
			});
		},
		methods: {
			loadSettings: function () {
				const vue = this;
				return axios.get(API_URL + 'settings' + Utils.generateQueryString({
					keys: Object.keys(vue.settings)
				})).then(function (response) {
					response.data.forEach(function (setting) {
						if (vue.settings.hasOwnProperty(setting.key)) {
							vue.settings[setting.key] = setting.value;
						}
					});
				}).catch(function (err) {
                    vue.apiError = err.response.data.errors;
                });
			},
			getImageUrl: function (fileUuid) {
				const vue = this;
				const file = _.find(vue.files, {uuid: fileUuid});

				return file ? vue.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + file.path : '';
			},
			openDonations: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('donation-tiers', {nonprofit: vue.nonprofit});
			}
		},
		watch: {
			nonprofit: {
				handler: function () {
					const vue = this;
					vue.setPageTitle(vue.pageTitle);
				},
				deep: true
			}
		},
		components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('./../layout/Hero.vue')
		}
	};
</script>