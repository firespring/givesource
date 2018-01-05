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
            <h1 slot="title">Give To Our City Day Toolkits</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">
                
                <ul>
                    <li v-for="resource in resources" :key="resource.uuid">
                        <a :href="getResourceLink(resource)" target="_blank" rel="noopener noreferrer">{{ getResourceValue(resource, 'TOOLKIT_RESOURCE_LIST_ITEM_TITLE') }}</a>
                        <span v-if="getResourceValue(resource, 'TOOLKIT_RESOURCE_LIST_ITEM_DESCRIPTION', false)">-</span>
                        {{ getResourceValue(resource, 'TOOLKIT_RESOURCE_LIST_ITEM_DESCRIPTION') }}
                    </li>
                </ul>

                <div v-html="text" style="margin: 0 0 1.5rem;"></div>
                
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
			};
		},
		computed: {
			resources: function () {
				return _.filter(this.contents, {key: 'TOOLKIT_RESOURCE_LIST'});
            },
			text: function () {
				const text = _.find(this.contents, {key: 'TOOLKIT_ADDITIONAL_TEXT'});
				return text ? text.value : null;
			},
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				axios.get(API_URL + 'contents' + Utils.generateQueryString({
					keys: ['TOOLKIT_RESOURCE_LIST', 'TOOLKIT_ADDITIONAL_TEXT']
				})).then(function (response) {
					response.data.sort(function (a, b) {
						return a.sortOrder - b.sortOrder;
                    });
					vue.contents = response.data;
				}).then(function () {
					let promise = Promise.resolve();
					vue.contents.forEach(function (content) {
						if (content.type === 'COLLECTION') {
							const fileIndex = _.findIndex(content.value, {key: 'TOOLKIT_RESOURCE_LIST_ITEM_FILE'});
							if (content.value[fileIndex].value) {
								promise = promise.then(function () {
									return axios.get(API_URL + 'files/' + content.value[fileIndex].value).then(function (response) {
										content.value[fileIndex].value = response.data;
                                    });
                                });
                            }
                        }
                    });
					return promise;
                });
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + 'contents' + Utils.generateQueryString({
				keys: ['TOOLKIT_RESOURCE_LIST', 'TOOLKIT_ADDITIONAL_TEXT']
			})).then(function (response) {
				response.data.sort(function (a, b) {
					return a.sortOrder - b.sortOrder;
				});
				vue.contents = response.data;
			}).then(function () {
				let promise = Promise.resolve();
				vue.contents.forEach(function (content) {
					if (content.type === 'COLLECTION') {
						const fileIndex = _.findIndex(content.value, {key: 'TOOLKIT_RESOURCE_LIST_ITEM_FILE'});
						if (content.value[fileIndex].value) {
							promise = promise.then(function () {
								return axios.get(API_URL + 'files/' + content.value[fileIndex].value).then(function (response) {
									content.value[fileIndex].value = response.data;
								});
							});
						}
					}
				});
				return promise;
			}).then(function () {
				next();
			}).catch(function (err) {
				console.log(err);
				next();
			});
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle('Give To Our City - Toolkits');
		},
        methods: {
	        getResourceValue: function (resource, contentKey) {
				const content = _.find(resource.value, {key: contentKey});
				return content ? content.value : null;
            },
            getResourceLink: function (resource) {
	        	const vue = this;

	        	const type = vue.getResourceValue(resource, 'TOOLKIT_RESOURCE_LIST_ITEM_TYPE', 'FILE');
	        	if (type === 'FILE') {
			        return vue.$store.getters.setting('UPLOADS_CLOUDFRONT_URL') + '/' + vue.getResourceValue(resource, 'TOOLKIT_RESOURCE_LIST_ITEM_FILE').path;
                } else {
	        		return vue.getResourceValue(resource, 'TOOLKIT_RESOURCE_LIST_ITEM_LINK');
                }
            },
        },
		components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('../layout/Hero.vue'),
			'layout-sponsors': require('../layout/Sponsors.vue'),
		}
	};
</script>