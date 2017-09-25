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
        <navigation :nonprofitUuid="nonprofitUuid"></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">

                <div class="o-page-header" v-if="isAdmin">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofits-list' }">Nonprofits</router-link></span>
                            <span><router-link :to="{ name: 'nonprofit-your-page'}">Your Page </router-link></span>
                            <span><router-link :to="{ name: 'nonprofit-your-page', query: { tab: 'media' }}">Manage Image & Videos</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title" v-if="nonprofit.legalName">{{ nonprofit.legalName }} - Add Video</h1>
                    </div>
                </div>

                <div class="o-page-header" v-else>
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofit-your-page'}">Your Page </router-link></span>
                            <span><router-link :to="{ name: 'nonprofit-your-page', query: { tab: 'media' }}">Manage Image & Videos</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Add Video</h1>
                    </div>
                </div>

                <div class="o-app-main-content">
                    <form v-on:submit="submit">
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--url" :class="{ 'c-form-item--has-error': formErrors.url }">
                                    <div class="c-form-item__label">
                                        <label for="url" class="c-form-item-label-text">Video URL</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="u-control-icon u-control-icon--url">
                                            <input v-model="formData.url" type="url" name="url" id="url" placeholder="http://" :class="{ 'has-error': formErrors.url }"
                                                   v-auto-focus>
                                        </div>
                                        <div v-if="formErrors.url" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.url }}
                                        </div>
                                        <div class="c-notes c-notes--below">
                                            Only YouTube and Vimeo URLs are allowed.
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--text" :class="{ 'c-form-item--has-error': formErrors.caption }">
                                    <div class="c-form-item__label">
                                        <label for="caption" class="c-form-item-label-text">Caption (100 characters or less)</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input v-model="formData.caption" type="text" name="caption" id="caption" :class="{ 'has-error': formErrors.caption }">
                                        <div v-if="formErrors.caption" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.caption }}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button v-on:click="save('add')" type="submit" class="c-btn" :disabled="disableSaveAndNextButton">Save &amp; Add Another</button>
                            <button v-on:click="save('close')" type="submit" class="c-btn" :disabled="disableSaveButton">Save &amp; Finish</button>
                            <router-link :to="{ name: 'nonprofit-your-page', query: { tab: 'media' }}" class="c-btn c-btn--text c-btn--neutral">Cancel</router-link>
                        </footer>

                    </form>

                </div>
            </div>
        </main>
    </div>
</template>

<script>
    const MediaHelper = require('./../../../../helpers/media');

	module.exports = {
		data: function () {
			return {
				slides: [],
				loadedSlides: false,
                maxSlides: 8,
                nonprofit: {},

				// Form Data
				formData: {
					url: '',
					caption: '',
				},

				formErrors: {}
			}
		},
		props: [
			'nonprofitUuid',
		],
		computed: {
			isAdmin: function () {
				return this.isSuperAdminUser() || this.isAdminUser();
			},
			disableSaveButton: function () {
				const vue = this;
				return !vue.loadedSlides || (vue.slides.length >= vue.maxSlides);
			},
            disableSaveAndNextButton: function () {
				const vue = this;
	            return !vue.loadedSlides || (vue.slides.length >= vue.maxSlides - 1);
            }
		},
		watch: {
			formData: {
				handler: function () {
					const vue = this;
					if (Object.keys(vue.formErrors).length) {
						vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
					}
				},
				deep: true
			}
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vm) {
				axios.get(API_URL + '/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
					vm.nonprofit = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + '/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
				vue.nonprofit = response.data;
			}).then(function () {
				next();
			}).catch(function () {
				next();
			});
		},
		beforeMount: function () {
			const vue = this;

			axios.get(API_URL + 'nonprofits/' + vue.nonprofitUuid + '/slides').then(function (response) {
				if (response.data.errorMessage) {
					console.log(response.data);
				} else {
					vue.slides = response.data;
					vue.loadedSlides = true;
				}
			}).catch(function (err) {
				console.log(err);
			});
		},
		methods: {
			getConstraints: function () {
				return {
					url: {
						presence: true,
						url: true,
						label: 'Video URL',
						format: {
							pattern: MediaHelper.VIDEO_REGEX,
							message: "must be a Youtube or Vimeo URL."
						}
					},
					caption: {
						presence: false,
						length: {
							maximum: 100
						}
					}
				}
			},
			submit: function (event) {
				event.preventDefault();
			},
			save: function (action) {
				const vue = this;

				vue.addModal('spinner');
				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.addNonprofitSlide(action);
				}
			},
			addNonprofitSlide: function (action) {
				const vue = this;

				MediaHelper.getVideoData(vue.formData.url).then(function (videoData) {
					return axios.post(API_URL + 'nonprofits/' + vue.nonprofitUuid + '/slides', {
						caption: vue.formData.caption,
						embedUrl: videoData.embedUrl,
						externalId: videoData.id,
						thumbnail: videoData.thumbnail,
						type: videoData.type,
						url: vue.formData.url,
					});
                }).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
					    vue.slides.push(response.data);
					}

					if (action === 'add') {
						vue.formData.url = '';
						vue.formData.caption = '';
					} else {
						vue.$router.push({name: 'nonprofit-your-page', query: {tab: 'media'}});
                    }
                }).catch(function (err) {
                	console.log(err);
                });
			}
		}
	};
</script>