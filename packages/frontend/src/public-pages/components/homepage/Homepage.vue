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
        <layout-hero :presentedBy="true" :wrap="true">
            <h1 slot="title">{{ getContentValue('HOMEPAGE_TITLE') }}</h1>

            <div v-html="getContentValue('HOMEPAGE_MASTHEAD_TEXT')"></div>
        </layout-hero>

        <main class="main">
            <div class="wrapper">

                <metrics :dateDonationsEnd="settings.DATE_DONATIONS_END"
                         :dateDonationsStart="settings.DATE_DONATIONS_START"
                         :dateEvent="settings.DATE_EVENT"
                         :dateRegistrationsEnd="settings.DATE_REGISTRATIONS_END"
                         :dateRegistrationsStart="settings.DATE_REGISTRATIONS_END"
                         :displayMatchFund="getContentValue('HOMEPAGE_MATCH_IS_ENABLED', false)"
                         :eventTimezone="settings.EVENT_TIMEZONE"
                         :eventTitle="settings.EVENT_TITLE"
                         :matchFundButtonText="getContentValue('HOMEPAGE_MATCH_BUTTON', 'Love Them All')"
                         :matchFundDetails="getContentValue('HOMEPAGE_MATCH_DETAILS')"
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
	import * as Utils from './../../helpers/utils';

	module.exports = {
		data: function () {
			return {
				contents: [],
				spotlightImage: '/assets/temp/logo-gtld.png',
				nonprofits: [],

				settings: {
					DATE_DONATIONS_END: null,
					DATE_DONATIONS_START: null,
					DATE_EVENT: null,
					DATE_REGISTRATIONS_END: null,
					DATE_REGISTRATIONS_START: null,
					EVENT_TIMEZONE: null,
					EVENT_TITLE: null,
				}
			}
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				axios.get(API_URL + 'settings' + Utils.generateQueryString({
					keys: Object.keys(vue.settings)
				})).then(function (response) {
					response.data.forEach(function (setting) {
						if (vue.settings.hasOwnProperty(setting.key)) {
							vue.settings[setting.key] = setting.value;
						}
					});
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
                        ],
                    }));
				}).then(function (response) {
					vue.contents = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + 'settings' + Utils.generateQueryString({
				keys: Object.keys(vue.formData)
			})).then(function (response) {
				response.data.forEach(function (setting) {
					if (vue.settings.hasOwnProperty(setting.key)) {
						vue.settings[setting.key] = setting.value;
					}
				});
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
					],
				}));
			}).then(function (response) {
				vue.contents = response.data;
				next();
			}).catch(function () {
				next();
			});
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('home', 'home--live');
			vue.setPageTitle('Give To Our City - May 18th, 2018');
		},
        methods: {
			getContentValue: function (contentKey, defaultValue) {
				const vue = this;

				const content = _.find(vue.contents, {key: contentKey});
				return content ? content.value : defaultValue ? defaultValue : null;
            },
        },
		components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('../layout/Hero.vue'),
			'layout-sponsors': require('../layout/Sponsors.vue'),
			'leaderboard': require('./Leaderboard.vue'),
			'metrics': require('./Metrics.vue'),
		}
	};
</script>