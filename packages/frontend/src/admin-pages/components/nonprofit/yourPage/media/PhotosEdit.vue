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
                        <h1 class="o-page-header-title" v-if="nonprofit.legalName">{{ nonprofit.legalName }} - Edit Image</h1>
                    </div>
                </div>

                <div class="o-page-header" v-else>
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofit-your-page'}">Manage Donation Page</router-link></span>
                            <span><router-link :to="{ name: 'nonprofit-your-page', query: { tab: 'media' }}">Manage Image & Videos</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Edit Image</h1>
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
                                    <div class="c-alert c-alert--expand c-alert--neutral u-flex u-justify-center">
                                        <div class="c-alert__body u-flex u-flex-column u-items-center">
                                            <img :src="imageUrl" :alt="formData.caption" style="width: auto; max-height: 443px;">
                                            <div class="c-btn-group u-margin-top-thin">
                                                <a :href="imageUrl" target="_blank" rel="noreferrer noopener" role="button"
                                                   class="c-btn c-btn--sm c-btn--icon c-btn--flat c-btn--reverse">
                                                    <i class="fa fa-search" aria-hidden="true"></i>View Image
                                                </a>
                                                <input v-on:change="onFileChange" ref="fileInput" type="file" name="fileUpload" id="fileUpload" class="u-none" accept="image/*">
                                                <a v-on:click.prevent="replaceImage" href="#" role="button" class="c-btn c-btn--sm c-btn--icon c-btn--flat c-btn--reverse">
                                                    <i class="fa fa-refresh" aria-hidden="true"></i>Replace Image
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!--<div class="c-form-item c-form-item&#45;&#45;text" :class="{ 'c-form-item&#45;&#45;has-error': formErrors.caption }">-->
                                    <!--<div class="c-form-item__label">-->
                                        <!--<label for="caption" class="c-form-item-label-text">Caption (100 characters or less)</label>-->
                                    <!--</div>-->
                                    <!--<div class="c-form-item__control">-->
                                        <!--<input v-model="formData.caption" type="text" name="caption" id="caption" maxlength="100" :class="{ 'has-error': formErrors.caption }"-->
                                               <!--v-auto-focus>-->
                                        <!--<div v-if="formErrors.caption" class="c-notes c-notes&#45;&#45;below c-notes&#45;&#45;bad c-form-control-error">-->
                                            <!--{{ formErrors.caption }}-->
                                        <!--</div>-->
                                    <!--</div>-->
                                <!--</div>-->
                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button v-on:click.prevent="save" type="submit" class="c-btn">Save Changes</button>
                            <button v-on:click.prevent="cancel" type="submit" class="c-btn c-btn--text c-btn--neutral">Cancel</button>
                        </footer>

                    </form>
                </div>

            </div>
        </main>
    </div>
</template>

<script>
	export default {
		data() {
			return {
				file: {},
				newFile: null,
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
			imageUrl() {
				return this.file.hasOwnProperty('path') ? this.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + this.file.path : false;
			}
		},
		props: [
			'nonprofitUuid',
			'slideUuid'
		],
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
			slide: {
				handler() {
					const vm = this;
					vm.formData = vm.sync(vm.formData, vm.slide);
				},
				deep: true
			},
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(response => {
					vm.nonprofit = response.data;
					return vm.$request.get('nonprofits/' + to.params.nonprofitUuid + '/slides/' + to.params.slideUuid);
				}).then(response => {
					vm.slide = response.data;
					if (vm.slide.fileUuid) {
						return vm.$request.get('files/' + vm.slide.fileUuid);
					} else {
						return Promise.resolve(null);
					}
				}).then(response => {
					if (response) {
						vm.file = response.data;
					}
				}).catch(err => {
					vm.apiError = err.response.data.errors;
					next();
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
				if (vm.slide.fileUuid) {
					return vm.$request.get('files/' + vm.slide.fileUuid);
				} else {
					return Promise.resolve(null);
				}
			}).then(response => {
				if (response) {
					vm.file = response.data;
				}
				next();
			}).catch(err => {
				vm.apiError = err.response.data.errors;
				next();
			});
		},
		created() {
			const vm = this;

			vm.bus.$on('photoEditorSave-Edit', (data, file) => {
				vm.uploadFile(data, file);
			});
		},
		beforeDestroy() {
			const vm = this;

			vm.bus.$off('photoEditorSave-Edit');
		},
		methods: {
			getConstraints() {
				return {
					caption: {
						presence: false,
						length: {
							maximum: 100
						}
					}
				}
			},
			submit() {
				// do nothing
			},
			save() {
				const vm = this;

				vm.addModal('spinner');

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
				} else {
					vm.updateNonprofitSlide();
				}
			},
			cancel() {
				const vm = this;

				if (vm.newFile) {
					vm.addModal('spinner');
					vm.$request.delete('files/' + vm.newFile.uuid).then(() => {
						vm.clearModals();
						vm.newFile = null;
						vm.$router.push({name: 'nonprofit-your-page', query: {tab: 'media'}});
					}).catch(err => {
						vm.clearModals();
						vm.apiError = err.response.data.errors;
					});
				} else {
					vm.$router.push({name: 'nonprofit-your-page', query: {tab: 'media'}});
				}
			},
			replaceImage() {
				const vm = this;

				if (vm.newFile) {
					vm.$request.delete('files/' + vm.newFile.uuid).then(() => {
						vm.newFile = null;
					}).catch(err => {
						vm.apiError = err.response.data.errors;
					});
				}

				vm.$refs.fileInput.click();
			},
			onFileChange(event) {
				const vm = this;

				const extensions = ['gif', 'jpeg', 'jpg', 'png'];
				const files = event.target.files || event.dataTransfer.files;
				if (files.length && files[0] instanceof File && extensions.indexOf(files[0].name.toLowerCase().split('.').pop()) > -1) {
					vm.addModal('photo-editor', {
						file: files[0],
						listener: 'photoEditorSave-Edit',
						width: 770,
						height: 443
					});
					vm.addModal('spinner');
				}
			},
			uploadFile(fileData, file) {
				const vm = this;

				vm.addModal('spinner');

				vm.$request.post('files', {
					content_type: fileData.type,
					filename: fileData.name
				}).then(response => {
					vm.newFile = response.data.file;
					const signedUrl = response.data.upload_url;

					const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers));
					let instance = axios.create();
					instance.defaults.headers.common['Content-Type'] = fileData.type || 'application/octet-stream';
					instance.defaults.headers.put['Content-Type'] = fileData.type || 'application/octet-stream';
					axios.defaults.headers = defaultHeaders;
					return instance.put(signedUrl, file);
				}).then(() => {
					vm.clearModals();
					vm.file = vm.newFile;
				}).catch(err => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});
			},
			updateNonprofitSlide() {
				const vm = this;
				const params = {};

				if (vm.newFile) {
					params['fileUuid'] = vm.newFile.uuid;
				}

				if (vm.formData.caption !== vm.slide.caption) {
					params['caption'] = vm.formData.caption;
				}

				if (Object.keys(params).length === 0) {
					vm.clearModals();
					return vm.$router.push({name: 'nonprofit-your-page', query: {tab: 'media'}});
				}

				vm.$request.patch('nonprofits/' + vm.nonprofitUuid + '/slides/' + vm.slideUuid, params).then(() => {
					if (vm.newFile) {
						return vm.$request.delete('files/' + vm.slide.fileUuid);
					}
				}).then(() => {
					vm.$store.commit('generateCacheKey');
					vm.clearModals();
					vm.$router.push({name: 'nonprofit-your-page', query: {tab: 'media'}});
				}).catch(err => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});
			},
		}
	};
</script>