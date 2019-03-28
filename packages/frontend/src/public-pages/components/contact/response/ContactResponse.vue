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

        <layout-hero :presentedBy="true">
            <h1 slot="title">Thank You for Contacting {{ eventTitle }}</h1>
        </layout-hero>

        <main class="main">
            <api-error v-model="apiError"></api-error>
            <div class="wrapper wrapper--sm">
                <div v-html="response" style="margin: 0 0 1.5rem;"></div>
                <router-link :to="{ name: 'homepage' }"> Click here to return to the home page.</router-link>
            </div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
</template>

<script>
	import * as Settings from './../../../helpers/settings';
	import * as Utils from './../../../helpers/utils';
	import ComponentFooter from './../../layout/Footer.vue';
	import ComponentHeader from './../../layout/Header.vue';
	import ComponentHero from './../../layout/Hero.vue';
	import ComponentSponsors from './../../layout/Sponsors.vue';

	export default {
		data: function () {
			return {
				contents: [],
				apiError: {},
			};
		},
		computed: {
			response: function () {
				const response = _.find(this.contents, {key: 'CONTACT_RESPONSE_TEXT'});
				return response ? response.value : null;
			},
			eventTitle: function () {
				return Settings.eventTitle();
			}
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				axios.get(API_URL + 'contents' + Utils.generateQueryString({
					keys: 'CONTACT_RESPONSE_TEXT'
				})).then(function (response) {
					vue.contents = response.data;
				}).catch(function (err) {
					vue.apiError = err.response.data.errors;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + 'contents' + Utils.generateQueryString({
				keys: 'CONTACT_RESPONSE_TEXT'
			})).then(function (response) {
				vue.contents = response.data;
				next();
			}).catch(function (err) {
				vue.apiError = err.response.data.errors;
				next();
			});
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle(vue.eventTitle + ' - Thank You');
		},
		components: {
			'layout-footer': ComponentFooter,
			'layout-header': ComponentHeader,
			'layout-hero': ComponentHero,
			'layout-sponsors': ComponentSponsors,
		}
	};
</script>