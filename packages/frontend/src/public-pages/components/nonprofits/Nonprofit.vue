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
    <div>
        <layout-header></layout-header>

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
                                <a v-on:click.prevent="openDonations" href="#" class="btn btn--accent btn--lg btn--block donation-trigger">Donate</a>
                            </div>

                            <social-sharing network-tag="a"
                                            :url="pageUrl"
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
                                    <img v-if="slide.type === 'IMAGE'" :alt="slide.caption" :src="getImageUrl(slide.fileUuid)">
                                    <iframe v-else :alt="slide.caption" :src="slide.embedUrl" width="770" height="443" style="max-width: 100%;" frameborder="0" webkitallowfullscreen mozallowfullscreen
                                            allowfullscreen></iframe>
                                </div>
                            </template>
                            <div v-else class="nonprofit-campaign__slider" style="overflow: hidden;">
                                <img alt="" src="/assets/img/community.jpg">
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
	import ComponentFooter from './../layout/Footer.vue';
	import ComponentHeader from './../layout/Header.vue';
	import ComponentHero from './../layout/Hero.vue';

	require('fireSlider.js/dist/jquery.fireSlider.velocity');

	export default {
		data() {
			return {
				files: [],
				logo: null,
				nonprofit: {},
				slides: [],
				hovering: false,

				settings: {
					EVENT_URL: ''
				},

				apiError: {},
			}
		},
		props: [
			'slug'
		],
		computed: {
			donationsLabel() {
				return this.nonprofit.donationsCount === 1 ? 'Donation' : 'Donations';
			},
			eventTitle() {
				return Settings.eventTitle();
			},
            pageDescription() {
				return this.nonprofit.shortDescription;
            },
			pageTitle() {
				return 'Support '+ this.nonprofit.legalName + ' at ' + this.eventTitle;
			},
			displayDonationMetrics() {
				return Settings.isDuringEvent() || Settings.isAfterEvent();
			},
			canDonate() {
				return Settings.isDuringDonations() || Settings.isDuringEvent();
			},
			logoUrl() {
				const vm = this;
				let logo = false;

				if (vm.logo) {
					logo = vm.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vm.logo.path;
				} else if (vm.$store.getters.setting('EVENT_LOGO')) {
					logo = vm.$store.getters.setting('EVENT_LOGO');
				} else {
					logo = '/assets/img/logo-event.png';
				}
				return logo;
			},
			pageUrl() {
				return this.settings.EVENT_URL + '/nonprofits/' + this.nonprofit.slug;
			},
		},
		beforeMount() {
			const vm = this;

			vm.setBodyClasses('donation', 'donation--nonprofit');
			vm.setPageTitle(vm.pageTitle);
		},
		beforeRouteEnter(to, from, next) {
			let files = [];
			let logo = null;
			let slides = [];
			let nonprofit = null;

			let promise = Promise.resolve();
			if (to.meta.nonprofit !== null) {
				nonprofit = to.meta.nonprofit;
			} else {
				promise = promise.then(() => {
					return axios.get(API_URL + 'nonprofits/pages/' + to.params.slug).then(response => {
						nonprofit = response.data;
					});
				});
			}

			promise = promise.then(() => {
				return axios.get(API_URL + 'nonprofits/' + nonprofit.uuid + '/slides');
			}).then(response => {
				response.data.sort((a, b) => {
					return a.sortOrder - b.sortOrder;
				});
				slides = response.data;
				const uuids = [];
				slides.forEach(slide => {
					if (slide.hasOwnProperty('fileUuid') && slide.fileUuid) {
						uuids.push(slide.fileUuid);
					}
				});
				return axios.get(API_URL + 'files/' + Utils.generateQueryString({uuids: uuids}));
			}).then(response => {
				if (response && response.data) {
					files = response.data;
				}
			});

			if (!_.isEmpty(nonprofit.logoFileUuid)) {
				promise = promise.then(() => {
					return axios.get(API_URL + 'files/' + nonprofit.logoFileUuid);
				}).then(response => {
					if (response && response.data) {
						logo = response.data;
					}
				});
			}

			promise.then(() => {
				next(vm => {
					vm.files = files;
					vm.logo = logo;
					vm.nonprofit = nonprofit;
					vm.slides = slides;
					vm.setPageDescription(vm.nonprofit.shortDescription);
					return vm.loadSettings();
				});
			});
		},
		mounted() {
			const vm = this;

			$(document).ready(() => {
				const slider = $(vm.$refs.slider).data({
					pager: $(vm.$refs.sliderNav)
				}).fireSlider({
					activePagerClass: 'current',
					pagerTemplate: '<a href="#"></a>',
					slide: 'div.slide',
				});

				if (vm.slides.length > 1) {
					slider.on('mouseenter mouseover touchenter touchstart', () => {
						vm.hover = true;
					}).on('mouseelave mouseout touchleave touchend', () => {
						vm.hover = false;
					});

					// Pause slider if we interact with a slide (including videos)
					window.addEventListener('blur', () => {
						if (vm.hover) {
							slider.data('fireSlider').pause();
						}
					});

					slider.data('fireSlider').slides.on('click', () => {
						slider.data('fireSlider').pause();
					});

					// Resume playing slider if we interact with the pager
					slider.data('fireSlider').pages.on('click', () => {
						slider.data('fireSlider').play();
					});
				}
			});
		},
		methods: {
			loadSettings() {
				const vm = this;

				return axios.get(API_URL + 'settings' + Utils.generateQueryString({
					keys: Object.keys(vm.settings)
				})).then(response => {
					response.data.forEach(setting => {
						if (vm.settings.hasOwnProperty(setting.key)) {
							vm.settings[setting.key] = setting.value;
						}
					});
				}).catch(err => {
					vm.apiError = err.response.data.errors;
				});
			},
			getImageUrl(fileUuid) {
				const vm = this;
				const file = _.find(vm.files, {uuid: fileUuid});

				return file ? vm.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + file.path : '';
			},
			openDonations() {
				const vm = this;

				vm.addModal('donation-tiers', {nonprofit: vm.nonprofit});
			}
		},
		watch: {
			nonprofit: {
				handler() {
					const vm = this;
					vm.setPageTitle(vm.pageTitle);
				},
				deep: true
			}
		},
		components: {
			'layout-footer': ComponentFooter,
			'layout-header': ComponentHeader,
			'layout-hero': ComponentHero,
		}
	};
</script>