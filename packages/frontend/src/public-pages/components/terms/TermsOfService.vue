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
        <layout-header></layout-header>

        <layout-hero :presentedBy="true">
            <h1 slot="title">Terms of Service</h1>
        </layout-hero>

        <main class="main">
            <api-error v-model="apiError"></api-error>
            <div class="wrapper wrapper--sm" v-html="terms"></div>
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
	import ComponentHeader from './../layout/Header.vue';
	import ComponentHero from './../layout/Hero.vue';
	import ComponentSponsors from './../layout/Sponsors.vue';

	export default {
		data() {
			return {
				contents: [],
				apiError: {},
			};
		},
		computed: {
			terms() {
				const terms = _.find(this.contents, {key: 'TERMS_TEXT'});
				return terms ? terms.value : null;
			},
			eventTitle() {
				return Settings.eventTitle();
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				axios.get(API_URL + 'contents' + Utils.generateQueryString({
					keys: 'TERMS_TEXT'
				})).then(response => {
					vm.contents = response.data;
				}).catch(err => {
					vm.apiError = err.response.data.errors;
				});
			});
		},
		beforeRouteUpdate(to, from, next) {
			const vm = this;

			axios.get(API_URL + 'contents' + Utils.generateQueryString({
				keys: 'TERMS_TEXT'
			})).then(response => {
				vm.contents = response.data;
				next();
			}).catch(err => {
				vm.apiError = err.response.data.errors;
				next();
			});
		},
		beforeMount() {
			const vm = this;

			vm.setBodyClasses('page');
			vm.setPageTitle(vm.eventTitle + ' - Terms of Service');
		},
		components: {
			'layout-footer': ComponentFooter,
			'layout-header': ComponentHeader,
			'layout-hero': ComponentHero,
			'layout-sponsors': ComponentSponsors,
		}
	};
</script>