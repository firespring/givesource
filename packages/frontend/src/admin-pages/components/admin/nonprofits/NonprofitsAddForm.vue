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
    <form v-on:submit="submit">

        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
            <div class="c-page-section__main">

                <div class="c-form-item c-form-item--text c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.legalName }">
                    <div class="c-form-item__label">
                        <label for="legalName" class="c-form-item-label-text">Legal Name</label>
                    </div>
                    <div class="c-form-item__control">
                        <input v-model="formData.legalName" type="text" name="legalName" id="legalName" maxlength="200" :class="{ 'has-error': formErrors.legalName }" v-auto-focus>
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
                        <input v-model="formData.taxId" type="text" name="taxId" id="taxId" maxlength="200" :class="{ 'has-error': formErrors.taxId }">
                        <div v-if="formErrors.taxId" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                            {{ formErrors.taxId }}
                        </div>
                    </div>
                </div>

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
                                <state-select v-model="formData.state" name="state" id="state" placeholder="State" :class="{ 'has-error': formErrors.state }"></state-select>
                            </div>
                            <div class="c-form-control-grid__item c-form-item--required" style="flex: 1 0 11rem; max-width: 11rem;">
                                <div class="has-floating-label js-floating-label" v-floating-label>
                                    <input v-model="formData.zip" type="text" name="zip" id="zip" :class="{ 'has-error': formErrors.zip }">
                                    <label for="zip">ZIP Code</label>
                                </div>
                            </div>
                        </div>

                        <div v-if="formErrors.city || formErrors.state || formErrors.zip" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                            <span v-if="formErrors.city">{{ formErrors.city }}. </span><span v-if="formErrors.state">{{ formErrors.state }}. </span><span
                                v-if="formErrors.zip">{{ formErrors.zip }}.</span>
                        </div>
                    </div>
                </div>

                <div class="c-form-item c-form-item--text c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.phone }">
                    <div class="c-form-item__label">
                        <label for="phone" class="c-form-item-label-text">Phone #</label>
                    </div>
                    <div class="c-form-item__control">
                        <input v-model="formData.phone" type="text" name="phone" id="phone" :class="{ 'has-error': formErrors.phone }">
                        <div v-if="formErrors.phone" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                            {{ formErrors.phone }}
                        </div>
                    </div>
                </div>

                <hr class="expand">

                <div class="c-form-item c-form-item--text c-form-item--required">
                    <div class="c-form-item__label">
                        <label for="firstName" class="c-form-item-label-text">Primary Admin Name</label>
                    </div>
                    <div class="c-form-item__control">
                        <div class="c-form-control-grid">
                            <div class="c-form-control-grid__item">
                                <div class="has-floating-label js-floating-label" v-floating-label>
                                    <input v-model="formData.firstName" type="text" name="firstName" id="firstName" :class="{ 'has-error': formErrors.firstName }">
                                    <label for="firstName">First Name</label>
                                </div>
                            </div>
                            <div class="c-form-control-grid__item">
                                <div class="has-floating-label js-floating-label" v-floating-label>
                                    <input v-model="formData.lastName" type="text" name="lastName" id="lastName" :class="{ 'has-error': formErrors.lastName }">
                                    <label for="lastName">Last Name</label>
                                </div>
                            </div>
                        </div>
                        <div v-if="formErrors.firstName || formErrors.lastName" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                            <span v-if="formErrors.firstName">{{ formErrors.firstName }}. </span><span v-if="formErrors.lastName">{{ formErrors.lastName }}.</span>
                        </div>
                    </div>
                </div>

                <div class="c-form-item c-form-item--email c-form-item--required">
                    <div class="c-form-item__label">
                        <label for="email" class="c-form-item-label-text">Primary Admin Email</label>
                    </div>
                    <div class="c-form-item__control">
                        <div class="u-control-icon u-control-icon--email">
                            <input v-model="formData.email" type="email" name="email" id="email" :class="{ 'has-error': formErrors.email }">
                        </div>
                        <div v-if="formErrors.email" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                            {{ formErrors.email }}
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
            <button type="submit" class="c-btn">Save Nonprofit</button>
            <router-link :to="{ name: 'nonprofits-list' }" class="c-btn c-btn--text c-btn--neutral">Cancel </router-link>
        </footer>

    </form>
</template>

<script>
	module.exports = {
		data: function () {
			return {
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
					category3: '',
					firstName: '',
					lastName: '',
					email: '',
				},

				categoryOptions: [
					{value: '1', text: 'Animal-Related'},
					{value: '2', text: 'Arts, Culture & Humanities'},
					{value: '3', text: 'Children & Families'},
					{value: '4', text: 'Community Improvement & Capacity Building'},
					{value: '5', text: 'Crime & Legal-Related'},
					{value: '6', text: 'Diseases, Disorders & Medical Disciplines'},
					{value: '7', text: 'Education-Early Childhood'},
					{value: '8', text: 'Education-Higher Education'},
					{value: '9', text: 'Education-K-12'},
					{value: '10', text: 'Environment'},
					{value: '11', text: 'Food, Agriculture & Nutrition'},
					{value: '12', text: 'Health Care'},
					{value: '13', text: 'Housing & Shelter'},
					{value: '14', text: 'Human Services'},
					{value: '15', text: 'International, Foreign Affairs & National Security'},
					{value: '16', text: 'Library & Literacy Programs'},
					{value: '17', text: 'Medical Research'},
					{value: '18', text: 'Mental Health & Crisis Intervention'},
					{value: '19', text: 'Mutual & Membership Benefit'},
					{value: '20', text: 'Older Adults'},
					{value: '21', text: 'Philanthropy, Voluntarism & Grantmaking Foundations'},
					{value: '22', text: 'Politics & Public Administration'},
					{value: '23', text: 'Public & Societal Benefit'},
					{value: '24', text: 'Public Safety, Disaster Preparedness & Relief'},
					{value: '25', text: 'Recreation & Sports'},
					{value: '26', text: 'Religion-Related'},
					{value: '27', text: 'Science & Technology'},
					{value: '28', text: 'Veterans Support'},
					{value: '29', text: 'Women'},
					{value: '30', text: 'Youth Development'}
				],

				formErrors: {}
			}
		},
		computed: {
			category1Options: function () {
				const vue = this;
				return _.remove(_.clone(vue.categoryOptions, true), function (option) {
					return option.value !== vue.formData.category2 && option.value !== vue.formData.category3;
				});
			},
			category2Options: function () {
				const vue = this;
				return _.remove(_.clone(vue.categoryOptions, true), function (option) {
					return option.value !== vue.formData.category1 && option.value !== vue.formData.category3;
				});
			},
			category3Options: function () {
				const vue = this;
				return _.remove(_.clone(vue.categoryOptions, true), function (option) {
					return option.value !== vue.formData.category1 && option.value !== vue.formData.category2;
				});
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
		methods: {
			getConstraints: function () {
				return {
					legalName: {
						presence: true,
					},
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
					},
					firstName: {
						presence: true,
					},
					lastName: {
						presence: true,
					},
					email: {
						label: 'Email address',
						presence: true,
						email: true,
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
					vue.scrollToError();
				} else {
					vue.registerNonprofit();
				}
			},
			registerNonprofit: function () {
				const vue = this;

				axios.post(API_URL + 'nonprofits/register', {
					nonprofit: {
						legalName: vue.formData.legalName,
						taxId: vue.formData.taxId,
						address1: vue.formData.address1,
						address2: vue.formData.address2,
						address3: vue.formData.address3,
						city: vue.formData.city,
						state: vue.formData.state,
						zip: vue.formData.zip,
						phone: vue.formData.phone,
						category1: vue.formData.category1,
						category2: vue.formData.category2,
						category3: vue.formData.category3,
					},
					user: {
						firstName: vue.formData.firstName,
						lastName: vue.formData.lastName,
						email: vue.formData.email
					}
				}).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						vue.$router.push({name: 'nonprofits-list'});
					}
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			},
		},
		components: {
			'category-select': require('../../forms/SelectNonprofitCategory.vue'),
			'state-select': require('../../forms/SelectState.vue'),
		}
	};
</script>