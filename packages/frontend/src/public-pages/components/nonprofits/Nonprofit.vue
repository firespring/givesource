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
            <img slot="logo" width="320" height="140" alt="Cheshire County Hygiene Services logo" src="/assets/temp/sponsors/cheshire-county-hygiene-services.png">
            <h1 slot="title">{{ nonprofit.legalName }}</h1>
        </layout-hero>

        <!-- BEGIN page main -->
        <main class="main">

            <div class="wrapper">

                <div class="donation-wrapper nonprofit-campaign">
                    <div class="nonprofit-campaign__header">

                        <div class="nonprofit-campaign__donation">
                            <div class="donation-metrics">
                                <div class="donation-metrics__raised">
                                    <div class="num">{{ formatMoney(nonprofit.donationsSubtotal) }}</div>
                                    <div class="caption">Raised</div>
                                </div>

                                <div class="donation-metrics__donations">
                                    <div class="num">{{ nonprofit.donationsCount }}</div>
                                    <div class="caption">Donations</div>
                                </div>
                            </div>

                            <div class="donation-text">
                                {{ nonprofit.shortDescription }}
                            </div>

                            <div class="donation-action">
                                <a v-on:click="openDonations" href="#" class="btn btn--green btn--lg btn--block donation-trigger">Donate</a>
                            </div>

                            <div class="donation-share">
                                <a href="#" class="btn btn--xs btn--dark btn--icon btn--facebook"><i class="fa fa-facebook" aria-hidden="true"></i><span>Share</span></a>
                                <a href="#" class="btn btn--xs btn--dark btn--icon btn--twitter"><i class="fa fa-twitter" aria-hidden="true"></i><span>Tweet</span></a>
                                <a href="#" class="btn btn--xs btn--dark btn--icon btn--linkedin"><i class="fa fa-linkedin" aria-hidden="true"></i><span>Share</span></a>
                                <a href="#" class="btn btn--xs btn--dark btn--icon"><i class="fa fa-envelope" aria-hidden="true"></i><span>Email</span></a>
                            </div>

                        </div>

                        <div ref="slider" class="nonprofit-campaign__slider" style="overflow: hidden;">
                            <div v-for="(slide, index) in slides" class="slide" style="display: flex; align-items: center;">
                                <img v-if="slide.type === 'IMAGE'" alt="" :src="slide.url">
                                <iframe v-else :src="slide.embedUrl" width="770" height="443" style="max-width: 100%;" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>

                    <div ref="sliderNav" class="nonprofit-campaign__slider-nav"></div>

                    <div class="nonprofit-campaign__content">
                        <div v-html="nonprofit.longDescription" class="wrapper wrapper--sm"></div>
                    </div>
                </div>
            </div>
        </main>

        <layout-footer></layout-footer>
    </div>
</template>

<script>
    require('fireSlider.js/dist/jquery.fireSlider.velocity');

	module.exports = {
		data: function () {
			return {
				nonprofit: {},
				slides: []
			}
		},
        props: [
        	'slug'
        ],
        beforeMount: function () {
			const vue = this;

	        vue.setBodyClasses('donation', 'donation--nonprofit');
        },
		beforeRouteEnter: function (to, from, next) {
			next(function (vm) {
				vm.nonprofit = to.meta.nonprofit;
				vm.slides = to.meta.slides;
				vm.tiers = to.meta.tiers;
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.nonprofit = to.meta.nonprofit;
			vue.slides = to.meta.slides;
			vue.tiers = to.meta.tiers;
			next();
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
	        openDonations: function (event) {
	        	event.preventDefault();
	        	const vue = this;

	        	vue.addModal('donation-tiers', { nonprofit: vue.nonprofit, tiers: vue.tiers });
            }
        },
        components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('./../layout/Hero.vue')
        }
	};
</script>