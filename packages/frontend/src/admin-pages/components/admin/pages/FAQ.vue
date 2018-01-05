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
                            <h1 class="o-page-header-title">Terms</h1>
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

                            <faq-list-table :contents="contents"></faq-list-table>

                            <div class="c-table-footer">
                                <div class="c-table-footer__actions">
                                    <a v-on:click="addQuestion" href="#" role="button" class="c-btn c-btn--good c-btn--icon c-btn--sm">
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
	module.exports = {
		data: function () {
			return {
				contents: [],
				loaded: false,
			};
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('contents', {
					keys: ['FAQ_LIST']
				}).then(function (response) {
					response.data.sort(function (a, b) {
						return a.sortOrder - b.sortOrder;
					});
					vue.contents = response.data;
					vue.loaded = true;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.loaded = false;
			vue.$request.get('contents', {
				keys: ['FAQ_LIST']
			}).then(function (response) {
				response.data.sort(function (a, b) {
					return a.sortOrder - b.sortOrder;
				});
				vue.contents = response.data;
				vue.loaded = true;
				next();
			}).catch(function () {
				next();
			});
		},
		created: function () {
			const vue = this;

			vue.bus.$on('addFAQList', function (data) {
				vue.contents.push(data);
			});

			vue.bus.$on('deleteFAQList', function (data) {
				vue.contents = _.reject(vue.contents, {uuid: data.uuid});
			});

			vue.bus.$on('updateFAQList', function (data) {
				const index = _.findIndex(vue.contents, {uuid: data.uuid});
				vue.contents[index > -1 ? index : vue.contents.length] = data;
			});
		},
		beforeDestroy: function () {
			const vue = this;

			vue.bus.$off('addFAQList');
			vue.bus.$off('deleteFAQList');
			vue.bus.$off('updateFAQList');
		},
		methods: {
			addQuestion: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('pages-faq-add-question-modal');
			}
		},
		components: {
			'faq-list-table': require('./faq/FAQListTable.vue')
		}
	};
</script>