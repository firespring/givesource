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
    <div class="o-app">
        <navigation></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">
                <div class="o-app-main-content">

                    <div class="o-page-header">
                        <div class="o-page-header__text">
                            <nav class="o-page-header-nav c-breadcrumb">
                                <span><router-link :to="{name: 'pages-list'}">Pages</router-link></span>
                            </nav>
                            <h1 class="o-page-header-title">Toolkit</h1>
                        </div>
                    </div>

                    <form v-on:submit="submit">

                        <section class="c-page-section c-page-section--border c-page-section--shadow">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title" id="section-segmented">Resource List</h2>
                                    <div class="c-notes c-notes--below">
                                        Manage your list of event resources (e.g., downloadable files and useful links)
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <toolkit-list-table :contents="resourceContents"></toolkit-list-table>

                                <div class="c-table-footer">
                                    <div class="c-table-footer__actions">
                                        <a v-on:click="addResource" href="#" role="button" class="c-btn c-btn--good c-btn--icon c-btn--sm">
                                            <i class="fa fa-plus-circle" aria-hidden="true"></i>Add Resource
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Additional Text</h2>
                                    <div class="c-notes c-notes--below">
                                        Add additional information about your event that people might find useful, such as event contacts (names, emails, phone numbers) and links to social media.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--rich-text">
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.TOOLKIT_ADDITIONAL_TEXT.value" :loaded="loaded" id="additionalText"></forms-ckeditor>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Save Changes</button>
                            <router-link :to="{name: 'pages-list'}" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                        </footer>

                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				contents: [],
				original: [],
				loaded: false,

				// Form Data
				formData: {
					TOOLKIT_ADDITIONAL_TEXT: {
						key: 'TOOLKIT_ADDITIONAL_TEXT',
						type: 'RICH_TEXT',
						value: ''
					}
				},

				// Errors
				formErrors: {},
			};
		},
		computed: {
			resourceContents: function () {
				return _.filter(this.contents, {key: 'TOOLKIT_RESOURCE_LIST'});
			}
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('contents', {
					keys: ['TOOLKIT_RESOURCE_LIST', 'TOOLKIT_ADDITIONAL_TEXT']
				}).then(function (response) {
					response.data.sort(function (a, b) {
						return a.sortOrder - b.sortOrder;
					});
					vue.contents = response.data;
					vue.original = JSON.parse(JSON.stringify(response.data));
					vue.loaded = true;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.loaded = false;
			vue.$request.get('contents', {
				keys: ['TOOLKIT_RESOURCE_LIST', 'TOOLKIT_ADDITIONAL_TEXT']
			}).then(function (response) {
				response.data.sort(function (a, b) {
					return a.sortOrder - b.sortOrder;
				});
				vue.contents = response.data;
				vue.original = JSON.parse(JSON.stringify(response.data));
				vue.loaded = true;
				next();
			}).catch(function () {
				next();
			});
		},
		created: function () {
			const vue = this;

			vue.bus.$on('addToolkitResourceList', function (data) {
				vue.contents.push(data);
			});

			vue.bus.$on('deleteToolkitResourceList', function (data) {
				vue.contents = _.reject(vue.contents, {uuid: data.uuid});
			});

			vue.bus.$on('updateToolkitResourceList', function (data) {
				const index = _.findIndex(vue.contents, {uuid: data.uuid});
				vue.contents[index > -1 ? index : vue.contents.length] = data;
			});
		},
		beforeDestroy: function () {
			const vue = this;

			vue.bus.$off('addToolkitResourceList');
			vue.bus.$off('deleteToolkitResourceList');
			vue.bus.$off('updateToolkitResourceList');
		},
		watch: {
			contents: {
				handler: function () {
					const vue = this;
					if (vue.contents.length) {
						Object.keys(vue.formData).forEach(function (key) {
							const content = _.find(vue.contents, {key: key});
							if (content) {
								vue.formData[key] = content;
							}
						});
					}
				},
				deep: true
			}
		},
		methods: {
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('spinner');
				vue.updateContents();
			},
			updateContents: function () {
				const vue = this;

				const created = [];
				const changed = _.differenceWith(vue.contents, vue.original, _.isEqual);
				const toUpdate = _.reject(changed, {value: ''});
				const toDelete = _.filter(changed, {value: ''});
				Object.keys(vue.formData).forEach(function (key) {
					if (!_.find(vue.original, {key: key}) && vue.formData[key].value !== '') {
						created.push(vue.formData[key]);
					}
				});

				let promise = Promise.resolve();
				if (created.length) {
					created.forEach(function (content) {
						promise = promise.then(function () {
							return vue.$request.post('contents', content);
						});
					});
				}

				if (toUpdate.length) {
					promise = promise.then(function () {
						return vue.$request.patch('contents', {
							contents: toUpdate.map(function (content) {
								return _.pick(content, ['key', 'sortOrder', 'type', 'uuid', 'value']);
							}),
						});
					});
				}

				if (toDelete.length) {
					promise = promise.then(function () {
						return vue.$request.delete('contents', {
							contents: toDelete
						});
					});
				}

				promise.then(function () {
					vue.clearModals();
					vue.$router.push({name: 'pages-list'});
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			},
			addResource: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('pages-toolkit-add-resource-modal');
			}
		},
		components: {
			'forms-ckeditor': require('./../../forms/Ckeditor.vue'),
			'toolkit-list-table': require('./toolkit/ToolkitListTable.vue')
		}
	};
</script>