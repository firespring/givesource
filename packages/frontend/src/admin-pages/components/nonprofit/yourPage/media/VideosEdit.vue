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
        <navigation :nonprofitUuid="nonprofitUuid"></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">
                <api-error v-model="apiError"></api-error>

                <div class="o-page-header" v-if="isAdmin">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofits-list' }">Nonprofits</router-link></span>
                            <span v-if="nonprofit.legalName"><router-link :to="{ name: 'nonprofit-your-page'}">Manage {{ nonprofit.legalName }}'s Donation Page</router-link></span>
                            <span v-else><router-link :to="{ name: 'nonprofit-your-page'}">Manage Donation Page</router-link></span>
                            <span><router-link :to="{ name: 'nonprofit-your-page', query: { tab: 'media' }}">Manage Image & Videos</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title" v-if="nonprofit.legalName">{{ nonprofit.legalName }} - Edit Video</h1>
                    </div>
                </div>

                <div class="o-page-header" v-else>
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofit-your-page'}">Manage Donation Page</router-link></span>
                            <span><router-link :to="{ name: 'nonprofit-your-page', query: { tab: 'media' }}">Manage Image & Videos</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Edit Video</h1>
                    </div>
                </div>

                <div class="o-app-main-content">

                    <form v-on:submit.prevent="submit">
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
                                            <input v-model="formData.url" type="url" name="url" id="url" placeholder="https://" :class="{ 'has-error': formErrors.url }"
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

                                <!--<div class="c-form-item c-form-item&#45;&#45;text" :class="{ 'c-form-item&#45;&#45;has-error': formErrors.caption }">-->
                                    <!--<div class="c-form-item__label">-->
                                        <!--<label for="caption" class="c-form-item-label-text">Caption (100 characters or less)</label>-->
                                    <!--</div>-->
                                    <!--<div class="c-form-item__control">-->
                                        <!--<input v-model="formData.caption" type="text" name="caption" id="caption" maxlength="100" :class="{ 'has-error': formErrors.caption }">-->
                                        <!--<div v-if="formErrors.caption" class="c-notes c-notes&#45;&#45;below c-notes&#45;&#45;bad c-form-control-error">-->
                                            <!--{{ formErrors.caption }}-->
                                        <!--</div>-->
                                    <!--</div>-->
                                <!--</div>-->
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
	import ComponentVideo from './../../../media/Video.vue';

	const MediaHelper = require('./../../../../helpers/media');

	export default {
		data() {
			return {
				slide: {},
				nonprofit: {},

				// Form Data
				formData: {
					url: '',
					caption: '',
				},

				// Errors
				formErrors: {},
				apiError: {},
			};
		},
		computed: {
			isAdmin() {
				return this.isSuperAdminUser() || this.isAdminUser();
			},
		},
		props: [
			'nonprofitUuid'
		],
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(response => {
					vm.nonprofit = response.data;
					return vm.$request.get('nonprofits/' + to.params.nonprofitUuid + '/slides/' + to.params.slideUuid);
				}).then(response => {
					vm.slide = response.data;
					vm.apiError = err.response.data.errors;
				});
			});
		},
		beforeRouteUpdate(to, from, next) {
			const vm = this;

			vm.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(response => {
				vm.nonprofit = response.data;
				return vm.$request.get('nonprofits/' + to.params.nonprofitUuid + '/slides/' + to.params.slideUuid);
			}).then(response => {
				vm.slide = response.data;
				next();
			}).catch(err => {
				vm.apiError = err.response.data.errors;
				next();
			});
		},
		watch: {
			formData: {
				handler() {
					const vm = this;
					if (Object.keys(vm.formErrors).length) {
						vm.slide = vm.validate(vm.formData, vm.getConstraints());
					}
				},
				deep: true
			},
			slide: {
				handler() {
					const vm = this;
					vm.formData = vm.sync(vm.formData, vm.slide);
				},
				deep: true
			}
		},
		methods: {
			getConstraints() {
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
				};
			},
			submit() {
				const vm = this;

				vm.addModal('spinner');
				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
				} else {
					vm.updateNonprofitSlide();
				}
			},
			updateNonprofitSlide() {
				const vm = this;

				const params = vm.getUpdatedParameters(vm.formData, vm.slide);
				if (Object.keys(params).length === 0) {
					vm.clearModals();
					vm.$router.push({name: 'nonprofit-your-page', query: {tab: 'media'}});
					return;
				}

				MediaHelper.getVideoData(vm.formData.url).then(videoData => {
					if (params.hasOwnProperty('url')) {
						params['embedUrl'] = videoData.embedUrl;
						params['externalId'] = videoData.id;
						params['thumbnail'] = videoData.thumbnail;
					}
					return vm.$request.patch('nonprofits/' + vm.nonprofitUuid + '/slides/' + vm.slide.uuid, params);
				}).then(response => {
					vm.clearModals();
					if (response.data.errorMessage) {
						vm.apiError = vm.formatErrorMessageResponse(response);
						vm.scrollToError('.c-alert');
					} else {
						vm.$router.push({name: 'nonprofit-your-page', query: {tab: 'media'}});
					}
				}).catch(err => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});
			}
		},
		components: {
			'media-video': ComponentVideo,
		}
	};
</script>