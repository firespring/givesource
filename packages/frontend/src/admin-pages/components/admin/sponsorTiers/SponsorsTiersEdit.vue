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
                            <span><router-link :to="{ name: 'sponsor-tiers-list' }">Tiers</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Edit Sponsor Tier</h1>
                    </div>
                </div>

                <div class="o-app-main-content">
                    <api-error v-model="apiError"></api-error>
                    <form v-on:submit.prevent="submit">
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--text c-form-item--required"  :class="{ 'c-form-item--has-error': formErrors.name }">
                                    <div class="c-form-item__label">
                                        <label for="name" class="c-form-item-label-text">Name</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input v-model="formData.name" type="text" name="name" id="name" :class="{ 'has-error': formErrors.name }" v-auto-focus>
                                        <div v-if="formErrors.name" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.name }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--radio">
                                    <div class="c-form-item__label">
                                        <div class="c-form-item-label-text" id="logoSize">Logo Size</div>
                                        <div class="c-notes">
                                            Specify the size of this tier's logos when they're displayed on your website. For example, if you're creating a "Featured Sponsors" tier, you can make its logos larger than your other tiers.
                                        </div>
                                    </div>

                                    <div class="c-form-item__control">
                                        <div v-if="formErrors.size" class="c-notes c-notes--above c-notes--bad c-form-control-error">
                                            {{ formErrors.size }}
                                        </div>
                                        <ul class="c-input-list c-input-list--radio" aria-labelledby="logoSize">
                                            <li>
                                                <input v-model="formData.size" type="radio" name="logoSize" id="logoSize-1" value="LARGE">
                                                <label for="logoSize-1">Large</label>
                                            </li>
                                            <li>
                                                <input v-model="formData.size" type="radio" name="logoSize" id="logoSize-2"value="DEFAULT">
                                                <label for="logoSize-2">Default</label>
                                            </li>
                                            <li>
                                                <input v-model="formData.size" type="radio" name="logoSize" id="logoSize-3"value="SMALL">
                                                <label for="logoSize-3">Small</label>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Save Changes</button>
                            <router-link :to="{name:'sponsor-tiers-list'}" class="c-btn c-btn--text c-btn--neutral">Cancel</router-link>
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
				sponsorTier: {},

				// Form Data
				formData: {
					name: '',
					size: '',
				},

                // Errors
                formErrors: {},
                apiError: {},
			};
		},
		props: [
			'sponsorTierUuid'
		],
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$request.get('sponsor-tiers/' + vm.sponsorTierUuid).then(response => {
					vm.sponsorTier = response.data;
				}).catch(err => {
                    vm.apiError = err.response.data.errors;
                 });
			});
		},
		beforeRouteUpdate(to, from, next) {
			const vm = this;

			vm.$request.get('sponsor-tiers/' + vm.sponsorTierUuid).then(response => {
				vm.sponsorTier = response.data;
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
						vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
					}
				},
				deep: true
			},
			sponsorTier: {
				handler() {
					const vm = this;
					vm.formData = vm.sync(vm.formData, vm.sponsorTier);
				},
				deep: true
			}
		},
		methods: {
			getConstraints() {
				return {
					name: {
						presence: true,
					},
					size: {
						label: 'Logo size',
						presence: true,
						inclusion: ['LARGE', 'DEFAULT', 'SMALL'],
					},
				};
			},
			submit() {
				const vm = this;

				vm.addModal('spinner');

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
				} else {
					vm.updateSponsorTier();
				}
			},
			updateSponsorTier() {
				const vm = this;

				const params = vm.getUpdatedParameters(vm.formData, vm.sponsorTier);
				if (Object.keys(params).length === 0) {
					vm.clearModals();
					return;
				}

				vm.$request.patch('sponsor-tiers/' + vm.sponsorTierUuid, params).then(response => {
					vm.clearModals();
					if (response.data.errorMessage) {
						vm.apiError = vm.formatErrorMessageResponse(response);
						vm.scrollToError('.c-alert');
					} else {
						vm.$router.push({name: 'sponsor-tiers-list'});
					}
				}).catch(err => {
					vm.clearModals();
                    vm.apiError = err.response.data.errors;
				});
			}
		}
	};
</script>