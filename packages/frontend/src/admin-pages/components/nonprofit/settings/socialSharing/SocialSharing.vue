<!--
  ~ Copyright 2018 Firespring, Inc.
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
                            <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title" v-if="nonprofit.legalName">Manage {{ nonprofit.legalName }}'s Social Sharing Settings</h1>
                    </div>
                </div>

                <div class="o-page-header" v-else>
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Donation Notifications</h1>
                    </div>
                </div>

                <form v-on:submit.prevent="submit">
                    <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                        <header class="c-page-section__header">
                            <div class="c-page-section-header-text">
                                <h2 class="c-page-section-title">Content For Social Sharing</h2>
                                <div class="c-notes c-notes--below">
                                    This content will be used when someone clicks the "share" buttons, or share the url of your page.
                                </div>
                            </div>
                        </header>

                        <div class="c-page-section__main">

                            <div class="c-form-item c-form-item--file c-form-item--file-picker" :class="{ 'c-form-item--has-error': formErrors.socialSharingImage }">
                                <div class="c-form-item__label">
                                    <label for="socialSharingImage" class="c-form-item-label-text">Social Image</label>
                                </div>
                                <forms-image-upload v-model="formData.socialSharingImage" name="socialSharingImage" id="socialSharingImage"></forms-image-upload>
                                <div v-if="formErrors.socialSharingImage" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                    {{ formErrors.socialSharingImage }}
                                </div>
                            </div>

                            <div class="c-form-item c-form-item--textarea" :class="{ 'c-form-item--has-error': formErrors.socialSharingDescription }">
                                <div class="c-form-item__label">
                                    <label for="socialSharingDescription" class="c-form-item-label-text">Social Sharing Description</label>
                                </div>
                                <div class="c-form-item__control">
                                        <textarea v-model="formData.socialSharingDescription" name="socialSharingDescription" id="socialSharingDescription"
                                                  :class="{ 'has-error': formErrors.socialSharingDescription }"></textarea>
                                    <div v-if="formErrors.socialSharingDescription" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.socialSharingDescription }}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    <footer class="c-form-actions">
                        <button type="submit" class="c-btn">Save Changes</button>
                        <router-link :to="{ name: 'settings-list' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                    </footer>
                </form>

            </div>
        </main>
    </div>
</template>

<script>
	import ComponentSelectNonprofitCategory from './../../../forms/SelectNonprofitCategory.vue';
	import ComponentImageUpload from './../../../forms/ImageUpload.vue';
	import ComponentSelectState from './../../../forms/SelectState.vue';

	export default {
		data() {
			return {
				nonprofit: {},
				loaded: false,

				formData: {
					socialSharingDescription: '',
					socialSharingFileUuid: '',
					socialSharingImage: null,
				},

				// Errors
				formErrors: {},
				apiError: {},
			}
		},
		computed: {
			isAdmin() {
				return this.isSuperAdminUser() || this.isAdminUser();
			}
		},
		props: [
			'nonprofitUuid'
		],
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(response => {
					vm.nonprofit = response.data;
				});
			});
		},
		beforeRouteUpdate(to, from, next) {
			const vm = this;

			vm.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(response => {
				vm.nonprofit = response.data;
			}).catch(() => {
				next();
			});
		},
		created: function () {
			this.addModal('spinner');
		},
		watch: {
			formData: {
				handler() {
					const vm = this;
					if (Object.keys(vm.formErrors).length) {
						vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
					}
				},
				deep: true
			},
			nonprofit: {
				handler() {
					const vm = this;

					vm.formData = vm.sync(vm.formData, vm.nonprofit);
					if (!_.isEmpty(vm.formData.socialSharingFileUuid)) {
						vm.$request.get('files/' + vm.formData.socialSharingFileUuid).then(response => {
							vm.formData.socialSharingImage = response.data;
						}).catch(() => {
							vm.formData.socialSharingImage = null;
						});
					} else {
						vm.formData.socialSharingImage = null;
					}
					vm.loaded = true;
					vm.removeModal('spinner');
				},
				deep: true
			}
		},
		methods: {
			getConstraints() {
				return {
					socialSharingDescription: {
						presence: false
					},
					socialSharingImage: {
						presence: false,
						image: true,
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
					vm.updateNonprofit();
				}
			},
			updateNonprofit: function () {
				const vm = this;

				vm.getUpdatedNonprofitParams().then(updatedParams => {
					let promise = Promise.resolve();
					const originalSocialSharingFileUuid = vm.nonprofit.socialSharingFileUuid;

					if (Object.keys(updatedParams).length) {
						promise = promise.then(() => {
							return vm.$request.patch('nonprofits/' + vm.nonprofit.uuid, updatedParams).then(response => {
								if (response.data.errorMessage) {
									console.log(response.data);
								}
								vm.$emit('updateNonprofit', response.data);
							})
						});
					}

					if (updatedParams.hasOwnProperty('socialSharingFileUuid') && !_.isEmpty(originalSocialSharingFileUuid)) {
						promise = promise.then(() => {
							return vm.$request.delete('files/' + originalSocialSharingFileUuid);
						});
					}

					promise.then(() => {
						vm.clearModals();
						vm.$router.push({name: 'nonprofit-settings-list'});
					});

					return promise;
				}).catch(err => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});
			},
			getUpdatedNonprofitParams: function () {
				const vm = this;
				let promise = Promise.resolve();

				if (vm.formData.socialSharingImage instanceof File) {
					promise = promise.then(() => {
						return vm.uploadImage('socialSharingImage').then(uploadedFile => {
							vm.$store.commit('generateCacheKey');
							vm.formData.socialSharingFileUuid = uploadedFile && uploadedFile.hasOwnProperty('uuid') ? uploadedFile.uuid : '';
						});
					});
				} else if (_.isPlainObject(vm.formData.socialSharingImage) && vm.formData.socialSharingImage.hasOwnProperty('uuid')) {
					vm.formData.socialSharingFileUuid = vm.formData.socialSharingImage.uuid;
				} else {
					vm.formData.socialSharingFileUuid = '';
				}

				promise = promise.then(() => {
					const params = vm.getUpdatedParameters(vm.formData, vm.nonprofit);
					delete params.socialSharingImage;
					return params;
				});

				return promise;
			},
			uploadImage(key) {
				const vm = this;
				let file = null;
				let promise = Promise.resolve();
				if (vm.formData[key]) {
					promise = promise.then(() => {
						return vm.$request.post('files', {
							content_type: vm.formData[key].type,
							filename: vm.formData[key].name
						});
					}).then(response => {
						file = response.data.file;
						const signedUrl = response.data.upload_url;

						const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers));
						let instance = axios.create();
						instance.defaults.headers.common['Content-Type'] = vm.formData[key].type || 'application/octet-stream';
						instance.defaults.headers.put['Content-Type'] = vm.formData[key].type || 'application/octet-stream';
						axios.defaults.headers = defaultHeaders;
						return instance.put(signedUrl, vm.formData[key]);
					}).then(() => {
						return file;
					});
				}
				return promise;
			},
		},
		components: {
			'category-select': ComponentSelectNonprofitCategory,
			'forms-image-upload': ComponentImageUpload,
			'state-select': ComponentSelectState,
		}
	};
</script>