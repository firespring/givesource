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
    <div class="page-hero" :style="mastheadStyle">
        <div class="page-hero__spotlight" v-if="hasSpotlightSlot">
            <slot name="spotlight"></slot>
        </div>

        <div class="page-hero__title" :class="{ wrapper: wrap, 'wrapper--sm': wrap }">
            <slot name="logo"></slot>
            <slot name="title"></slot>
        </div>

        <div class="page-hero__message" v-if="hasMessageSlot">
            <slot></slot>
        </div>

        <div class="presented-by" v-if="presentedBy && foundationLogoUrl">

            <div class="items-center">
                Presented by
                <div class="presented-by__logo">
                    <a v-if="foundationUrl" :href="foundationUrl" target="_blank" rel="noopener noreferrer"><img alt="Foundation Logo" :src="foundationLogoUrl"></a>
                    <img v-else alt="Foundation Logo" :src="foundationLogoUrl">
                </div>
            </div>

        </div>
    </div>
</template>

<script>
	module.exports = {
		computed: {
			mastheadStyle: function () {
				const vue = this;
				return {
					'background-image': 'url(' + vue.backgroundImageUrl + ')'
				}
			},
			backgroundImageUrl: function () {
				const vue = this;
				let url = '/assets/temp/hero.jpg';
				const mastheadPath = vue.$store.getters.setting('MASTHEAD_IMAGE');
				if (mastheadPath) {
					url = vue.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + mastheadPath;
				}
				return url;
			},
			hasSpotlightSlot: function () {
				return this.$slots.spotlight;
			},
			hasMessageSlot: function () {
				return this.$slots.default;
			},
			foundationLogoUrl: function () {
				const vue = this;
				const logo = vue.$store.getters.setting('FOUNDATION_LOGO');
				return logo ? vue.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + logo : false;
			},
			foundationUrl: function () {
				const vue = this;
				return vue.$store.getters.setting('FOUNDATION_URL') ? vue.$store.getters.setting('FOUNDATION_URL') : false;
			}
		},
		props: {
			presentedBy: {
				type: Boolean,
				default: false
			},
			wrap: {
				type: Boolean,
				default: false
			}
		}
	};
</script>