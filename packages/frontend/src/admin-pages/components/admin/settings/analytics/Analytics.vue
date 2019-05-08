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

                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Google Analytics Settings</h1>
                    </div>
                </div>

                <div class="o-app-main-content">

                    <form v-on:submit.prevent="submit">
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Google Analytics</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--text" :class="{ 'c-form-item--has-error': formErrors.GOOGLE_ANALYTICS_TRACKING_ID }">
                                    <div class="c-form-item__label">
                                        <label for="trackingId" class="c-form-item-label-text">Tracking ID</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input v-model="formData.GOOGLE_ANALYTICS_TRACKING_ID" type="text" name="trackingId" id="trackingId" maxlength="200"
                                               :class="{ 'has-error': formErrors.GOOGLE_ANALYTICS_TRACKING_ID }" v-auto-focus>
                                        <div v-if="formErrors.GOOGLE_ANALYTICS_TRACKING_ID" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.GOOGLE_ANALYTICS_TRACKING_ID }}
                                        </div>
                                        <div class="c-notes c-notes--below">
                                            <a href="https://support.google.com/analytics/answer/1008080?hl=en" target="_blank">Click here</a> for instructions to get your Google
                                            Analytics tracking ID. If you don't have a Google Analytics account, <a href="https://www.google.com/analytics/" target="_blank">sign up
                                            for a free account</a>.
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
            </div>
        </main>
    </div>
</template>

<script>
	import Request from './../../../../helpers/request';

	export default {
		data() {
			return {
				settings: [],

				// Form Data
				formData: {
					GOOGLE_ANALYTICS_TRACKING_ID: ''
				},

				// Errors
				formErrors: {}

			};
		},
		beforeRouteEnter(to, from, next) {
			const fetchData = () => {
				const request = new Request();
				let settings = null;
				let promise = Promise.resolve();

				promise = promise.then(() => {
					return request.get('settings', {
						keys: ['GOOGLE_ANALYTICS_TRACKING_ID']
					}).then(response => {
						settings = response.data;
					});
				});

				promise = promise.then(() => {
					return {
						settings: settings
					};
				});

				return promise;
			};

			fetchData().then(data => {
				next(vm => {
					vm.settings = data.settings;
				});
			});
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
			settings: {
				handler() {
					const vm = this;
					if (vm.settings.length) {
						Object.keys(vm.formData).forEach(key => {
							const setting = _.find(vm.settings, {key: key});
							if (setting) {
								vm.formData[key] = setting.value;
							}
						});
					}
				},
				deep: true
			}
		},
		methods: {
			getConstraints() {
				return {
					GOOGLE_ANALYTICS_TRACKING_ID: {
						label: 'Tracking ID',
						presence: false
					},
				};
			},
			submit(event) {
				const vm = this;

				vm.addModal('spinner');

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
					vm.scrollToError();
				} else {
					vm.updateSettings();
				}
			},
			updateSettings() {
				const vm = this;

				vm.getSettingsToUpdate().then(settings => {
					let promise = Promise.resolve();
					const toUpdate = _.reject(settings, {value: ''});
					const toDelete = _.filter(settings, {value: ''});

					if (toUpdate.length) {
						promise = promise.then(() => {
							return vm.$request.patch('settings', {
								settings: toUpdate
							});
						});
					}

					if (toDelete.length) {
						promise = promise.then(() => {
							return vm.$request.delete('settings', {
								settings: toDelete
							});
						})
					}

					return promise;

				}).then(() => {
					vm.clearModals();
					vm.$router.push({name: 'settings-list'});
				}).catch(err => {
					vm.clearModals();
					console.log(err);
				});

			},
			getSettingsToUpdate() {
				const vm = this;
				return new Promise((resolve, reject) => {
					const settings = [];
					Object.keys(vm.formData).forEach(key => {
						settings.push({
							key: key,
							value: vm.formData[key]
						});
					});
					resolve(settings);
				});
			}
		}
	};
</script>