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
    <div class="o-app">
        <navigation></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">
                <div class="o-app-main-content">
                    <api-error v-model="apiError"></api-error>

                    <div class="o-page-header">
                        <div class="o-page-header__text">
                            <nav class="o-page-header-nav c-breadcrumb">
                                <span><router-link :to="{name: 'pages-list'}">Pages</router-link></span>
                            </nav>
                            <h1 class="o-page-header-title">Terms</h1>
                        </div>
                    </div>

                    <form v-on:submit.prevent="submit">

                        <section class="c-page-section c-page-section--border c-page-section--shadow">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Page Text</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--rich-text">
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.TERMS_TEXT.value" :loaded="loaded" id="pageText" type="advanced"></forms-ckeditor>
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
	import ComponentCKEditor from './../../forms/Ckeditor.vue';

	export default {
		data() {
			return {
				contents: [],
				original: [],
				loaded: false,

				// Form Data
				formData: {
					TERMS_TEXT: {
						key: 'TERMS_TEXT',
						type: 'RICH_TEXT',
						value: ''
					}
				},

				// Errors
				formErrors: {},
				apiError: {},
			};
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$request.get('contents', {
					keys: Object.keys(vm.formData)
				}).then(response => {
					vm.contents = response.data;
					vm.original = JSON.parse(JSON.stringify(response.data));
					vm.loaded = true;
				}).catch(err => {
					vm.apiError = err.response.data.errors;
				});
			});
		},
		beforeRouteUpdate(to, from, next) {
			const vm = this;

			vm.loaded = false;
			vm.$request.get('contents', {
				keys: Object.keys(vm.formData)
			}).then(response => {
				vm.contents = response.data;
				vm.original = JSON.parse(JSON.stringify(response.data));
				vm.loaded = true;
				next();
			}).catch(err => {
				vm.apiError = err.response.data.errors;
				next();
			});
		},
		watch: {
			contents: {
				handler() {
					const vm = this;
					if (vm.contents.length) {
						Object.keys(vm.formData).forEach(key => {
							const content = _.find(vm.contents, {key: key});
							if (content) {
								vm.formData[key] = content;
							}
						});
					}
				},
				deep: true
			}
		},
		methods: {
			submit() {
				const vm = this;

				vm.addModal('spinner');
				vm.updateContents();
			},
			updateContents() {
				const vm = this;

				const created = [];
				const changed = _.differenceWith(vm.contents, vm.original, _.isEqual);
				const toUpdate = _.reject(changed, {value: ''});
				const toDelete = _.filter(changed, {value: ''});
				Object.keys(vm.formData).forEach(key => {
					if (!_.find(vm.original, {key: key}) && vm.formData[key].value !== '') {
						created.push(vm.formData[key]);
					}
				});

				let promise = Promise.resolve();
				if (created.length) {
					created.forEach(content => {
						promise = promise.then(() => {
							return vm.$request.post('contents', content);
						});
					});
				}

				if (toUpdate.length) {
					promise = promise.then(() => {
						return vm.$request.patch('contents', {
							contents: toUpdate.map(content => {
								return _.pick(content, ['key', 'sortOrder', 'type', 'uuid', 'value']);
							}),
						});
					});
				}

				if (toDelete.length) {
					promise = promise.then(() => {
						return vm.$request.delete('contents', {
							contents: toDelete
						});
					});
				}

				promise.then(() => {
					vm.clearModals();
					vm.$router.push({name: 'pages-list'});
				}).catch(err => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});
			}
		},
		components: {
			'forms-ckeditor': ComponentCKEditor,
		}
	};
</script>