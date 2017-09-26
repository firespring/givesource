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
                        <h1 class="o-page-header-title" v-if="nonprofit.legalName">{{ nonprofit.legalName }} - Edit Video</h1>
                    </div>
                </div>

                <div class="o-page-header" v-else>
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofit-your-page'}">Your Page </router-link></span>
                            <span><router-link :to="{ name: 'nonprofit-your-page', query: { tab: 'media' }}">Manage Image & Videos</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Edit Video</h1>
                    </div>
                </div>

                <div class="o-app-main-content">

                    <form v-on:submit="submit">
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
                            <div class="c-page-section__main">

                                <div class="c-form-item">
                                    <div class="c-form-item__label">
                                        <strong>Preview</strong>
                                    </div>
                                    <media-video :url="formData.url" :width="770" :height="443"></media-video>
                                </div>

                                <div class="c-form-item c-form-item--url" :class="{ 'c-form-item--has-error': formErrors.url }">
                                    <div class="c-form-item__label">
                                        <label for="url" class="c-form-item-label-text">Video URL</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="u-control-icon u-control-icon--url">
                                            <input v-model="formData.url" type="url" name="url" id="url" placeholder="http://" :class="{ 'has-error': formErrors.url }" v-auto-focus>
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
                            <button type="submit" class="c-btn">Save Changes</button>
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
				slide: {},
                nonprofit: {},

                // Form Data
                formData: {
					url: '',
                    caption: '',
                },

				// Errors
				formErrors: {}
			}
		},
		computed: {
			isAdmin: function () {
				return this.isSuperAdminUser() || this.isAdminUser();
			},
		},
		props: [
			'nonprofitUuid'
		],
		beforeRouteEnter: function (to, from, next) {
			next(function (vm) {
				axios.get(API_URL + '/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
					vm.nonprofit = response.data;
					return axios.get(API_URL + 'nonprofits/' + to.params.nonprofitUuid + '/slides/' + to.params.slideUuid);
				}).then(function (response) {
					vm.slide = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + '/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
				vue.nonprofit = response.data;
				return axios.get(API_URL + 'nonprofits/' + to.params.nonprofitUuid + '/slides/' + to.params.slideUuid);
			}).then(function (response) {
				vue.slide = response.data;
			}).then(function () {
				next();
			}).catch(function () {
				console.log(err);
				next();
			});
		},
		watch: {
			formData: {
				handler: function () {
					const vue = this;
					if (Object.keys(vue.formErrors).length) {
						vue.slide = vue.validate(vue.formData, vue.getConstraints());
					}
				},
				deep: true
			},
            slide: {
				handler: function () {
					const vue = this;
					vue.formData = vue.sync(vue.formData, vue.slide);
                },
                deep: true
            }
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
				const vue = this;

				vue.addModal('spinner');
				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.updateNonprofitSlide();
				}
			},
			updateNonprofitSlide: function () {
				const vue = this;

				const params = vue.getUpdatedParameters(vue.formData, vue.slide);
                if (Object.keys(params).length === 0) {
					vue.clearModals();
	                vue.$router.push({name: 'nonprofit-your-page', query: {tab: 'media'}});
	                return;
                }

				MediaHelper.getVideoData(vue.formData.url).then(function (videoData) {
					if (params.hasOwnProperty('url')) {
						params['embedUrl'] = videoData.embedUrl;
						params['externalId'] = videoData.id;
						params['thumbnail'] = videoData.thumbnail;
					}
					return axios.patch(API_URL + 'nonprofits/' + vue.nonprofitUuid + '/slides/' + vue.slide.uuid, params);
				}).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						vue.$router.push({name: 'nonprofit-your-page', query: {tab: 'media'}});
					}
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			}
		},
		components: {
			'media-video': require('../../../media/Video.vue')
		}
	};
</script>