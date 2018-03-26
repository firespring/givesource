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
                        <h1 class="o-page-header-title" v-if="nonprofit.legalName">Manage {{ nonprofit.legalName }}'s Organization Info</h1>
                    </div>
                </div>

                <div class="o-page-header" v-else>
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Manage Organization Info</h1>
                    </div>
                </div>

                <form v-on:submit="submit">

                    <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
                        <div class="c-page-section__main">

                            <div class="c-form-item c-form-item--text c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.legalName }" v-if="isAdmin">
                                <div class="c-form-item__label">
                                    <label for="legalName" class="c-form-item-label-text">Legal Name</label>
                                </div>
                                <div class="c-form-item__control">
                                    <input v-model="formData.legalName" type="text" name="legalName" id="legalName" maxlength="200" :class="{ 'has-error': formErrors.legalName }"
                                           v-auto-focus>
                                    <div v-if="formErrors.legalName" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.legalName }}
                                    </div>
                                </div>
                            </div>

                            <div class="c-form-item c-form-item--text c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.taxId }">
                                <div class="c-form-item__label">
                                    <label for="taxId" class="c-form-item-label-text">Tax ID</label>
                                </div>
                                <div class="c-form-item__control">
                                    <input v-model="formData.taxId" type="text" name="taxId" id="taxId" :class="{ 'has-error': formErrors.taxId }" v-auto-focus>
                                    <div v-if="formErrors.taxId" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.taxId }}
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item c-form-item--control-group c-form-item--control-group--address">
                                <div class="c-form-item__label">
                                    <div class="c-form-item-label-text">Address</div>
                                </div>

                                <div class="c-form-item__control u-margin-top-thick">
                                    <div class="c-form-control-grid">
                                        <div class="c-form-control-grid__item c-form-item--required">
                                            <div class="has-floating-label js-floating-label" v-floating-label>
                                                <input v-model="formData.address1" type="text" name="address1" id="address1" :class="{ 'has-error': formErrors.address1 }">
                                                <label for="address1">Address Line 1</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="formErrors.address1" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                        {{ formErrors.address1 }}
                                    </div>

                                    <div class="c-form-control-grid">
                                        <div class="c-form-control-grid__item">
                                            <div class="has-floating-label js-floating-label" v-floating-label>
                                                <input v-model="formData.address2" type="text" name="address2" id="address2" :class="{ 'has-error': formErrors.address2 }">
                                                <label for="address2">Address Line 2</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="formErrors.address2" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                        {{ formErrors.address2 }}
                                    </div>

                                    <div class="c-form-control-grid">
                                        <div class="c-form-control-grid__item">
                                            <div class="has-floating-label js-floating-label" v-floating-label>
                                                <input v-model="formData.address3" type="text" name="address3" id="address3" :class="{ 'has-error': formErrors.address3 }">
                                                <label for="address3">Address Line 3</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="formErrors.address3" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                        {{ formErrors.address3 }}
                                    </div>

                                    <div class="c-form-control-grid">
                                        <div class="c-form-control-grid__item c-form-item--required">
                                            <div class="has-floating-label js-floating-label" v-floating-label>
                                                <input v-model="formData.city" type="text" name="city" id="city" :class="{ 'has-error': formErrors.city }">
                                                <label for="city">City</label>
                                            </div>
                                        </div>

                                        <div class="c-form-control-grid__item c-form-item--required u-flex-collapse" id="addressGroupDefaultCountryOptions-US">
                                            <state-select v-model="formData.state" name="state" id="state" placeholder="State"
                                                          :class="{ 'has-error': formErrors.state }"></state-select>
                                        </div>

                                        <div class="c-form-control-grid__item c-form-item--required" style="flex: 1 0 11rem; max-width: 11rem;">
                                            <div class="has-floating-label js-floating-label" v-floating-label>
                                                <input v-model="formData.zip" type="text" name="zip" id="zip" :class="{ 'has-error': formErrors.zip }">
                                                <label for="zip">ZIP Code</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="formErrors.city || formErrors.state || formErrors.zip"
                                         class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                        <span v-if="formErrors.city">{{ formErrors.city }}. </span><span v-if="formErrors.state">{{ formErrors.state }}. </span><span
                                            v-if="formErrors.zip">{{ formErrors.zip }}.</span>
                                    </div>

                                </div>

                            </div>

                            <div class="c-form-item c-form-item--text c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.phone }">
                                <div class="c-form-item__label">
                                    <label for="legalName" class="c-form-item-label-text">Phone #</label>
                                </div>
                                <div class="c-form-item__control">
                                    <div class="u-control-icon u-control-icon--tel">
                                        <input v-model="formData.phone" type="text" name="phone" id="phone" :class="{ 'has-error': formErrors.phone }">
                                    </div>
                                    <div v-if="formErrors.phone" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.phone }}
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item c-form-item--select">
                                <p>
                                    Specify up to 3 categories that describe this nonprofit.
                                </p>
                                <div class="c-form-item__control">
                                    <div class="c-form-control-grid">
                                        <div class="c-form-control-grid__item u-flex u-items-center" style="flex: 1 0 8rem; max-width: 8rem;">
                                            <label for="category1" class="c-form-item-label-text">Category #1</label>
                                        </div>
                                        <div class="c-form-control-grid__item">
                                            <category-select v-model="formData.category1" name="category1" id="category1" :options="category1Options"
                                                             :class="{ 'has-error': formErrors.category1 }"></category-select>
                                        </div>
                                    </div>
                                    <div v-if="formErrors.category1" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                        {{ formErrors.category1 }}
                                    </div>

                                    <div class="c-form-control-grid">
                                        <div class="c-form-control-grid__item u-flex u-items-center" style="flex: 1 0 8rem; max-width: 8rem;">
                                            <label for="category2" class="c-form-item-label-text">Category #2</label>
                                        </div>
                                        <div class="c-form-control-grid__item">
                                            <category-select v-model="formData.category2" name="category2" id="category2" :options="category2Options" :allowEmpty="true"
                                                             :class="{ 'has-error': formErrors.category2 }"></category-select>
                                        </div>
                                    </div>
                                    <div v-if="formErrors.category2" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                        {{ formErrors.category2 }}
                                    </div>

                                    <div class="c-form-control-grid">
                                        <div class="c-form-control-grid__item u-flex u-items-center" style="flex: 1 0 8rem; max-width: 8rem;">
                                            <label for="category3" class="c-form-item-label-text">Category #3</label>
                                        </div>
                                        <div class="c-form-control-grid__item">
                                            <category-select v-model="formData.category3" name="category3" id="category3" :options="category3Options" :allowEmpty="true"
                                                             :class="{ 'has-error': formErrors.category3 }"></category-select>
                                        </div>
                                    </div>
                                    <div v-if="formErrors.category3" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                        {{ formErrors.category3 }}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    <footer class="c-form-actions">
                        <button type="submit" class="c-btn">Save Changes</button>
                        <router-link :to="{ name: 'nonprofit-settings-list' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                    </footer>

                </form>

            </div>
        </main>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				nonprofit: {},
				loaded: false,

				formData: {
					legalName: '',
					taxId: '',
					address1: '',
					address2: '',
					address3: '',
					city: '',
					state: '',
					zip: '',
					phone: '',
					category1: '',
					category2: '',
					category3: ''
				},

				categoryOptions: [
					{value: 1, text: 'Animal-Related'},
					{value: 2, text: 'Arts, Culture & Humanities'},
					{value: 3, text: 'Children & Families'},
					{value: 4, text: 'Civil Rights, Social Action & Advocacy'},
					{value: 5, text: 'Community Improvement & Capacity Building'},
					{value: 6, text: 'Crime & Legal-Related'},
					{value: 7, text: 'Diseases, Disorders & Medical Disciplines'},
					{value: 8, text: 'Education-Early Childhood'},
					{value: 9, text: 'Education-Higher Education'},
					{value: 10, text: 'Education-K-12'},
					{value: 11, text: 'Environment'},
					{value: 12, text: 'Food, Agriculture & Nutrition'},
					{value: 13, text: 'Health Care'},
					{value: 14, text: 'Housing & Shelter'},
					{value: 15, text: 'Human Services'},
					{value: 16, text: 'International, Foreign Affairs & National Security'},
					{value: 17, text: 'Library & Literacy Programs'},
					{value: 18, text: 'Medical Research'},
					{value: 19, text: 'Mental Health & Crisis Intervention'},
					{value: 20, text: 'Mutual & Membership Benefit'},
					{value: 21, text: 'Older Adults'},
					{value: 22, text: 'Philanthropy, Voluntarism & Grantmaking Foundations'},
					{value: 23, text: 'Politics & Public Administration'},
					{value: 24, text: 'Public & Societal Benefit'},
					{value: 25, text: 'Public Safety, Disaster Preparedness & Relief'},
					{value: 26, text: 'Recreation & Sports'},
					{value: 27, text: 'Religion-Related'},
					{value: 28, text: 'Science & Technology'},
					{value: 29, text: 'Veterans Support'},
					{value: 30, text: 'Women'},
					{value: 31, text: 'Youth Development'}
				],

				// Errors
				formErrors: {},
                apiError: {},
			}
		},
		computed: {
			isAdmin: function () {
				return this.isSuperAdminUser() || this.isAdminUser();
			},
			category1Options: function () {
				const vue = this;
				return _.forEach(_.cloneDeep(vue.categoryOptions), function (option) {
					if (option.value === vue.formData.category2 || option.value === vue.formData.category3) {
						option.disabled = true;
					}
				});
			},
			category2Options: function () {
				const vue = this;
				return _.forEach(_.cloneDeep(vue.categoryOptions), function (option) {
					if (option.value === vue.formData.category1 || option.value === vue.formData.category3) {
						option.disabled = true;
					}
				});
			},
			category3Options: function () {
				const vue = this;
				return _.forEach(_.cloneDeep(vue.categoryOptions), function (option) {
					if (option.value === vue.formData.category1 || option.value === vue.formData.category2) {
						option.disabled = true;
					}
				});
			}
		},
		props: [
			'nonprofitUuid'
		],
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
					vue.nonprofit = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(function (response) {
				vue.nonprofit = response.data;
				next();
			}).catch(function () {
				next();
			});
		},
		created: function () {
			const vue = this;

			vue.addModal('spinner');
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
			nonprofit: {
				handler: function () {
					const vue = this;

					vue.formData = vue.sync(vue.formData, vue.nonprofit);
					vue.loaded = true;
					vue.removeModal('spinner');
				},
				deep: true
			}
		},
		methods: {
			getConstraints: function () {
				const vue = this;

				const constraints = {
					taxId: {
						presence: true,
					},
					address1: {
						label: 'Address line 1',
						presence: true,
					},
					address2: {
						label: 'Address line 2',
						presence: false,
					},
					address3: {
						label: 'Address line 3',
						presence: false,
					},
					city: {
						presence: true,
					},
					state: {
						presence: true,
					},
					zip: {
						label: 'Zip code',
						presence: true,
					},
					phone: {
						label: 'Phone #',
						presence: true,
					},
					category1: {
						label: 'Category #1',
						presence: true,
					},
					category2: {
						label: 'Category #2',
						presence: false,
					},
					category3: {
						label: 'Category #3',
						presence: false,
					}
				};

				if (vue.isAdmin) {
					constraints.legalName = {
						presence: true,
					}
				}

				return constraints;
			},
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('spinner');

				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.updateNonprofit();
				}
			},
			updateNonprofit: function () {
				const vue = this;

				const params = vue.getUpdatedParameters(vue.formData, vue.nonprofit);
				if (Object.keys(params).length === 0) {
					vue.clearModals();
					vue.$router.push({name: 'nonprofit-settings-list'});
					return;
				}
				vue.$request.patch('nonprofits/' + vue.nonprofitUuid, params).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						vue.$router.push({name: 'nonprofit-settings-list'});
					}
				}).catch(function (err) {
					vue.clearModals();
                    vue.apiError = err.response.data.errors;
				});
			},
		},
		components: {
			'category-select': require('./../../../forms/SelectNonprofitCategory.vue'),
			'state-select': require('./../../../forms/SelectState.vue')
		}
	};
</script>