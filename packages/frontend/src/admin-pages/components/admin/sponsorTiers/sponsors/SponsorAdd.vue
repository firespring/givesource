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

                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'sponsor-tiers-list' }">Tiers</router-link></span>
                            <span><router-link :to="{ name: 'sponsors-list' }">{{ sponsorTier.name }}</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Add Sponsor</h1>
                    </div>
                </div>

                <div class="o-app-main-content">
                    <form v-on:submit="submit">
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
                            <button v-on:click="save('add')" type="submit" class="c-btn">Save &amp; Add Another</button>
                            <button v-on:click="save('close')" type="submit" class="c-btn">Save &amp; Finish</button>
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
				sponsorTiers: [],
				sponsorTier: {},

				// Form Data
				formData: {
					file: null,
					name: null,
					sponsorTierUuid: this.sponsorTierUuid ? this.sponsorTierUuid : null,
					url: null,
				},

				// Errors
				formErrors: {},
			};
		},
		props: {
			sponsorTierUuid: null,
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vm) {
				axios.get(API_URL + 'sponsor-tiers').then(function (response) {
					response.data.sort(function (a, b) {
						return a.sortOrder - b.sortOrder;
					});
					vm.sponsorTiers = response.data;
					vm.sponsorTier = _.find(vm.sponsorTiers, {uuid: to.params.sponsorTierUuid});
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + 'sponsor-tiers').then(function (response) {
				response.data.sort(function (a, b) {
					return a.sortOrder - b.sortOrder;
				});
				vue.sponsorTiers = response.data;
				next();
			}).catch(function (err) {
				console.log(err);
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
			},
			save: function (action) {
				const vue = this;

				vue.addModal('spinner');

				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.addSponsor(action);
				}
			},
			addSponsor: function (action) {
				const vue = this;

				let file = null;
				let promise = Promise.resolve();
				if (vue.formData.file) {
					promise = promise.then(function () {
						return axios.post(API_URL + 'files', {
							content_type: vue.formData.file.type,
							filename: vue.formData.file.name
						});
					}).then(function (response) {
						file = response.data.file;
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
					return axios.post(API_URL + 'sponsor-tiers/' + vue.formData.sponsorTierUuid + '/sponsors', {
						fileUuid: file && file.hasOwnProperty('uuid') ? file.uuid : null,
						name: vue.formData.name,
						sponsorTierUuid: vue.formData.sponsorTierUuid,
						url: vue.formData.url
					});
				}).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						if (action === 'add') {
							vue.formData = {
								file: null,
								name: null,
								sponsorTierUuid: vue.sponsorTierUuid,
								url: null
							};
						} else {
							vue.$router.push({name: 'sponsors-list'});
						}
					}
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			}
		},
		components: {
			'forms-image-upload': require('./../../../forms/ImageUpload.vue'),
			'forms-sponsor-tier': require('./../../../forms/SponsorTier.vue')
		}
	};
</script>