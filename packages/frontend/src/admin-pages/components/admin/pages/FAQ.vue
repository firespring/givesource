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
                            <h1 class="o-page-header-title">FAQ</h1>
                        </div>
                    </div>

                    <section class="c-page-section c-page-section--border c-page-section--shadow">

                        <header class="c-page-section__header">
                            <div class="c-page-section-header-text">
                                <h2 class="c-page-section-title" id="section-segmented">Questions &amp; Answers</h2>
                                <div class="c-notes c-notes--below">
                                    Manage your list of frequently asked questions and their answers.
                                </div>
                            </div>
                        </header>

                        <div class="c-page-section__main">

                            <faq-list-table :contents="contents" v-on:hasError="hasError"></faq-list-table>

                            <div class="c-table-footer">
                                <div class="c-table-footer__actions">
                                    <a v-on:click.prevent="addQuestion" href="#" role="button" class="c-btn c-btn--good c-btn--icon c-btn--sm">
                                        <i class="fa fa-plus-circle" aria-hidden="true"></i>Add Question
                                    </a>
                                </div>
                            </div>
                        </div>

                    </section>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
	import ComponentFAQListTable from './faq/FAQListTable.vue';

	export default {
		data() {
			return {
				contents: [],
				loaded: false,
				apiError: {},
			};
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$request.get('contents', {
					keys: ['FAQ_LIST']
				}).then(response => {
					response.data.sort((a, b) => {
						return a.sortOrder - b.sortOrder;
					});
					vm.contents = response.data;
					vm.loaded = true;
				});
			});
		},
		beforeRouteUpdate(to, from, next) {
			const vm = this;

			vm.loaded = false;
			vm.$request.get('contents', {
				keys: ['FAQ_LIST']
			}).then(response => {
				response.data.sort((a, b) => {
					return a.sortOrder - b.sortOrder;
				});
				vm.contents = response.data;
				vm.loaded = true;
				next();
			}).catch(() => {
				next();
			});
		},
		created() {
			const vm = this;

			vm.bus.$on('addFAQList', data => {
				vm.contents.push(data);
			});

			vm.bus.$on('deleteFAQList', data => {
				vm.contents = _.reject(vm.contents, {uuid: data.uuid});
			});

			vm.bus.$on('updateFAQList', data => {
				const index = _.findIndex(vm.contents, {uuid: data.uuid});
				vm.contents[index > -1 ? index : vm.contents.length] = data;
			});
		},
		beforeDestroy() {
			const vm = this;

			vm.bus.$off('addFAQList');
			vm.bus.$off('deleteFAQList');
			vm.bus.$off('updateFAQList');
		},
		methods: {
			addQuestion() {
				const vm = this;
				vm.addModal('pages-faq-add-question-modal');
			},
			hasError(err) {
				const vm = this;
				vm.apiError = err.response.data.errors;
			},
		},
		components: {
			'faq-list-table': ComponentFAQListTable,
		}
	};
</script>