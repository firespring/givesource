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
            <h1 slot="title">Frequently Asked Questions</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">

                <ol>
                    <li v-for="(content, index) in contents" :key="content.uuid + '-link'">
                        <a :href="'#faq' + (index + 1)">{{ getContentValue(content, 'FAQ_LIST_ITEM_QUESTION') }}</a>
                    </li>
                </ol>

                <hr>

                <div v-for="(content, index) in contents" :key="content.uuid">
                    <h2 :id="'faq' + (index + 1)">{{ getContentValue(content, 'FAQ_LIST_ITEM_QUESTION') }}</h2>
                    <div v-html="getContentValue(content, 'FAQ_LIST_ITEM_ANSWER')" style="margin: 0 0 1.5rem;"></div>
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

	module.exports = {
		data: function () {
			return {
				contents: [],
			};
		},
		computed: {
			eventTitle: function () {
				return Settings.eventTitle();
			}
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				axios.get(API_URL + 'contents' + Utils.generateQueryString({
					keys: 'FAQ_LIST'
				})).then(function (response) {
					response.data.sort(function (a, b) {
						return a.sortOrder - b.sortOrder;
					});
					vue.contents = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + 'contents' + Utils.generateQueryString({
				keys: 'FAQ_LIST'
			})).then(function (response) {
				response.data.sort(function (a, b) {
					return a.sortOrder - b.sortOrder;
				});
				vue.contents = response.data;
				next();
			}).catch(function (err) {
				console.log(err);
				next();
			});
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle(vue.eventTitle + ' - Frequently Asked Questions');
		},
		methods: {
			getContentValue: function (content, contentKey) {
				const item = _.find(content.value, {key: contentKey});
				return item ? item.value : null;
			}
		},
		components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('../layout/Hero.vue'),
			'layout-sponsors': require('../layout/Sponsors.vue'),
		}
	};
</script>