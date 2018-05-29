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
        <navigation></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">

                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'sponsor-tiers-list' }">Tiers</router-link></span>
                            <span><router-link :to="{ name: 'sponsors-list' }">{{ sponsorTier.name }}</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Edit Sponsor</h1>
                    </div>
                </div>

                <div class="o-app-main-content">
                    <form v-on:submit="submit">
                        <api-error v-model="apiError"></api-error>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--text c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.name }">
                                    <div class="c-form-item__label">
                                        <label for="name" class="c-form-item-label-text">Name</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input v-model="formData.name" type="text" name="name" id="name" :class="{ 'has-error': formErrors.name }" maxlength="90" v-auto-focus>
                                        <div v-if="formErrors.name" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.name }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--url" :class="{ 'c-form-item--has-error': formErrors.url }">
                                    <div class="c-form-item__label">
                                        <label for="url" class="c-form-item-label-text">URL</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="u-control-icon u-control-icon--url">
                                            <input v-model="formData.url" type="url" name="url" id="url" placeholder="https://">
                                            <div v-if="formErrors.url" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                                {{ formErrors.url }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--select" :class="{ 'c-form-item--has-error': formErrors.sponsorTierUuid }">
                                    <div class="c-form-item__label">
                                        <label for="sponsorTier" class="c-form-item-label-text">Tier</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-sponsor-tier v-model="formData.sponsorTierUuid" :sponsorTiers="sponsorTiers" id="sponsorTier" name="sponsorTier"
                                                            class="u-width-auto" :class="{ 'c-form-item--has-error': formErrors.sponsorTierUuid }"></forms-sponsor-tier>
                                        <div v-if="formErrors.sponsorTierUuid" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.sponsorTierUuid }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--file">
                                    <div class="c-form-item__label">
                                        <label for="fileFieldDefault" class="c-form-item-label-text">Logo</label>
                                        <div class="c-notes">
                                            If no logo is uploaded, one will be automatically generated based on the sponsor's name.
                                        </div>
                                    </div>
                                    <forms-image-upload v-model="formData.file"></forms-image-upload>
                                    <div v-if="formErrors.file" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.file }}
                                    </div>
                                </div>

                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Save Changes</button>
                            <router-link :to="{name:'sponsors-list'}" class="c-btn c-btn--text c-btn--neutral">Cancel</router-link>
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
				file: {},
				sponsor: {},
				sponsorTier: {},
				sponsorTiers: [],

				// Form Data
				formData: {
					file: null,
					name: '',
					sponsorTierUuid: this.sponsorTierUuid,
					url: '',
				},

				// Errors
				formErrors: {},
                apiError: {},
			};
		},
		props: {
			sponsorUuid: null,
			sponsorTierUuid: null,
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('sponsor-tiers').then(function (response) {
					response.data.sort(function (a, b) {
						return a.sortOrder - b.sortOrder;
					});
					vue.sponsorTiers = response.data;
					return vue.$request.get('sponsor-tiers/' + vue.sponsorTierUuid + '/sponsors/' + vue.sponsorUuid);
				}).then(function (response) {
					vue.sponsor = response.data;
					vue.sponsorTier = _.find(vue.sponsorTiers, {uuid: vue.sponsor.sponsorTierUuid});
					return (vue.sponsor.fileUuid) ? vue.$request.get('files/' + vue.sponsor.fileUuid) : Promise.resolve();
				}).then(function (response) {
					if (response) {
						vue.file = response.data;
					}
				}).catch(function(err){
                    vue.apiError = err.response.data.errors;
                });
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.$request.get('sponsor-tiers').then(function (response) {
				response.data.sort(function (a, b) {
					return a.sortOrder - b.sortOrder;
				});
				vue.sponsorTiers = response.data;
				return vue.$request.get('sponsor-tiers/' + vue.sponsorTierUuid + '/sponsors/' + vue.sponsorUuid);
			}).then(function (response) {
				vue.sponsor = response.data;
				vue.sponsorTier = _.find(vue.sponsorTiers, {uuid: vue.sponsor.sponsorTierUuid});
				return (vue.sponsor.fileUuid) ? vue.$request.get('files/' + vue.sponsor.fileUuid) : Promise.resolve();
			}).then(function (response) {
				if (response) {
					vue.file = response.data;
				}
				next();
			}).catch(function (err) {
                vue.apiError = err.response.data.errors;
				next();
			});
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
			},
			sponsor: {
				handler: function () {
					const vue = this;
					vue.formData = vue.sync(vue.formData, vue.sponsor);
				},
				deep: true
			},
			file: function () {
				const vue = this;
				vue.formData.file = vue.file;
			}
		},
		methods: {
			getConstraints: function () {
				return {
					file: {
						presence: false,
						image: true,
					},
					name: {
						presence: true,
					},
					sponsorTierUuid: {
						label: 'Tier',
						presence: true,
					},
					url: {
						presence: false,
						url: true,
					}
				};
			},
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('spinner');

				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.updateSponsor();
				}
			},
			updateSponsor: function () {
				const vue = this;

				let promise = Promise.resolve();
				if (vue.formData.file instanceof File) {
					if (vue.file.hasOwnProperty('uuid')) {
						promise = vue.$request.delete('files/' + vue.file.uuid);
					}

					promise = promise.then(function () {
						return vue.$request.post('files', {
							content_type: vue.formData.file.type,
							filename: vue.formData.file.name
						});
					}).then(function (response) {
						vue.file = response.data.file;
						const signedUrl = response.data.upload_url;

						const defaultHeaders = JSON.parse(JSON.stringify(axios.defaults.headers));
						let instance = axios.create();
						instance.defaults.headers.common['Content-Type'] = vue.formData.file.type || 'application/octet-stream';
						instance.defaults.headers.put['Content-Type'] = vue.formData.file.type || 'application/octet-stream';
						axios.defaults.headers = defaultHeaders;
						return instance.put(signedUrl, vue.formData.file);
					});
				}

				promise.then(function () {
					const params = vue.getUpdatedParameters(vue.formData, vue.sponsor);
					if (vue.file.hasOwnProperty('uuid')) {
						params.fileUuid = vue.file.uuid;
					}

					return vue.$request.patch('sponsor-tiers/' + vue.sponsorTierUuid + '/sponsors/' + vue.sponsorUuid, params);
				}).then(function () {
					vue.$store.commit('generateCacheKey');
					vue.clearModals();
					vue.$router.push({name: 'sponsors-list'});
				}).catch(function (err) {
					vue.clearModals();
                    vue.apiError = err.response.data.errors;
				});
			}
		},
		components: {
			'forms-image-upload': require('./../../../forms/ImageUpload.vue'),
			'forms-sponsor-tier': require('./../../../forms/SponsorTier.vue')
		}
	};
</script>