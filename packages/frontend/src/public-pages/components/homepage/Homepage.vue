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
    <div>
        <layout-hero :presentedBy="true" :wrap="true">
            <img v-show="homepageSpotlightUrl" slot="spotlight" :alt="eventTitle" :src="homepageSpotlightUrl">

            <h1 slot="title">{{ getContentValue('HOMEPAGE_TITLE') }}</h1>

            <div v-html="getContentValue('HOMEPAGE_MASTHEAD_TEXT')"></div>
        </layout-hero>

        <main class="main">
            <div class="wrapper">

                <metrics :matchFundEnabled="getContentValue('HOMEPAGE_MATCH_IS_ENABLED', false)"
                         :matchFundButtonText="getContentValue('HOMEPAGE_MATCH_BUTTON', 'Love Them All')"
                         :matchFundDetails="getContentValue('HOMEPAGE_MATCH_DETAILS')"
                         :matchFundNonprofit="matchFundNonprofit"
                         :registerButtonText="getContentValue('HOMEPAGE_REGISTER_BUTTON', 'Register Your Nonprofit Today')"
                         :registerDetails="getContentValue('HOMEPAGE_REGISTER_DETAILS')"></metrics>

                <div class="main__content">
                    <div class="main__content-text wrapper wrapper--sm" v-html="getContentValue('HOMEPAGE_MAIN_TEXT')"></div>

                    <leaderboard></leaderboard>

                </div>
            </div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
</template>

<script>
	import * as Settings from './../../helpers/settings';
	import * as Utils from './../../helpers/utils';
	import ComponentFooter from './../layout/Footer.vue';
	import ComponentHero from './../layout/Hero.vue';
	import ComponentLeaderboard from './Leaderboard.vue';
	import ComponentMetrics from './Metrics.vue';
	import ComponentSponsors from './../layout/Sponsors.vue';

	const fetchData = function () {
		let promise = Promise.resolve();
		let settings = {};
		let contents = [];
		let matchFundNonprofit = null;

		promise = promise.then(function () {
			return axios.get(API_URL + 'settings' + Utils.generateQueryString({
				keys: [
					'DATE_DONATIONS_END',
					'DATE_DONATIONS_START',
					'MATCH_FUND_NONPROFIT_UUID'
				]
			})).then(function (response) {
				response.data.forEach(function (setting) {
					settings[setting.key] = setting.value;
				});
			})
		});

		promise = promise.then(function () {
			return axios.get(API_URL + 'contents' + Utils.generateQueryString({
				keys: [
					'HOMEPAGE_TITLE',
					'HOMEPAGE_MASTHEAD_TEXT',
					'HOMEPAGE_MAIN_TEXT',
					'HOMEPAGE_POST_EVENT_TEXT',
					'HOMEPAGE_REGISTER_BUTTON',
					'HOMEPAGE_REGISTER_DETAILS',
					'HOMEPAGE_MATCH_IS_ENABLED',
					'HOMEPAGE_MATCH_BUTTON',
					'HOMEPAGE_MATCH_DETAILS',
					'HOMEPAGE_SPOTLIGHT'
				],
			})).then(function (response) {
				contents = response.data;
			});
		});

		promise = promise.then(function () {
			let subPromise = Promise.resolve();
			contents.forEach(function (content) {
				if (content.type === 'FILE') {
					subPromise = subPromise.then(function () {
						return axios.get(API_URL + 'files/' + content.value).then(function (response) {
							content.value = response.data;
						});
					});
				}
			});
			return subPromise;
		});

		promise = promise.then(function () {
			if (settings.MATCH_FUND_NONPROFIT_UUID) {
				return axios.get(API_URL + 'nonprofits/' + settings.MATCH_FUND_NONPROFIT_UUID).then(function (response) {
					matchFundNonprofit = response.data;
				});
			} else {
				return Promise.resolve();
			}
		});

		promise = promise.then(function () {
			return {
				contents: contents,
				matchFundNonprofit: matchFundNonprofit,
				settings: settings
			};
		});

		return promise;
	};

	export default {
		data: function () {
			return {
				contents: [],
				nonprofits: [],
				matchFundNonprofit: null,

				settings: {
					DATE_DONATIONS_END: null,
					DATE_DONATIONS_START: null,
					MATCH_FUND_NONPROFIT_UUID: null
				}
			}
		},
		computed: {
			eventTitle: function () {
				return Settings.eventTitle();
			},
			homepageSpotlightUrl: function () {
				const vue = this;
				let url = false;
				let file = vue.getContentValue('HOMEPAGE_SPOTLIGHT', false);
				if (_.isPlainObject(file) && file.hasOwnProperty('path')) {
					url = vue.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + file.path;
				}
				return url;
			}
		},
		beforeRouteEnter: function (to, from, next) {
			fetchData().then(function (data) {
				next(function (vue) {
					vue.settings = data.settings;
					vue.contents = data.contents;
					vue.matchFundNonprofit = data.matchFundNonprofit;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			fetchData().then(function (data) {
				vue.settings = data.settings;
				vue.contents = data.contents;
				vue.matchFundNonprofit = data.matchFundNonprofit;
				next();
			});
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('home', 'home--live');
			vue.setPageTitle(vue.eventTitle);
		},
		methods: {
			getContentValue: function (contentKey, defaultValue) {
				const vue = this;

				const content = _.find(vue.contents, {key: contentKey});
				return content ? content.value : defaultValue ? defaultValue : null;
			},
		},
		components: {
			'layout-footer': ComponentFooter,
			'layout-hero': ComponentHero,
			'layout-sponsors': ComponentSponsors,
			'leaderboard': ComponentLeaderboard,
			'metrics': ComponentMetrics,
		}
	};
</script>