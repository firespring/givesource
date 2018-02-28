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

        <layout-hero :presentedBy="true">
            <h1 slot="title">About {{ eventTitle }}</h1>
        </layout-hero>

        <main class="main">
            <api-error v-model="apiError"></api-error>
            <div class="wrapper wrapper--sm" v-html="about"></div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
</template>

<script>
	import * as Settings from './../../helpers/settings';
	import * as Utils from './../../helpers/utils';

	module.exports = {
		data: function () {
			return {
				contents: [],
                apiError: {},
			};
		},
		computed: {
			about: function () {
				const about = _.find(this.contents, {key: 'ABOUT_TEXT'});
				return about ? about.value : null;
			},
			eventTitle: function () {
				return Settings.eventTitle();
			},
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				axios.get(API_URL + 'contents' + Utils.generateQueryString({
					keys: 'ABOUT_TEXT'
				})).then(function (response) {
					vue.contents = response.data;
				}).catch(function (err){
                    vue.apiError = err.response.data.errors;
                });
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + 'contents' + Utils.generateQueryString({
				keys: 'ABOUT_TEXT'
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
			vue.setPageTitle(vue.eventTitle + ' - About');
		},
		components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('../layout/Hero.vue'),
			'layout-sponsors': require('../layout/Sponsors.vue'),
		}
	};
</script>