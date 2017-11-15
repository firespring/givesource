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
    <div>
        <layout-hero :presentedBy="true">
            <h1 slot="title">Register for Give To Our City Day</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">

                <p>
                    We invite nonprofit organizations in the Greater Area to join Give To City Day by registering to participate.
                    Nonprofits must register in order to participate in the event. For nonprofit eligibility information,
                    <router-link :to="{ name: 'about' }">please visit the About page</router-link>
                    .
                </p>

                <form v-on:submit="submit">
                    <fieldset>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="orglegalName">Organization Legal Name</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="formData.legalName" type="text" name="legalName" id="orglegalName" maxlength="200">
                            </div>
                        </div>


                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="taxId">Tax ID</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="formData.taxId" type="text" name="taxId" id="taxId" maxlength="200">
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="firstName">Contact Name</label>
                            </div>
                            <div class="form-item__control">
                                <div class="grid">
                                    <div class="grid-item">
                                        <input v-model="formData.firstName" type="text" name="firstName" id="firstName" maxlength="200">
                                    </div>
                                    <div class="grid-item">
                                        <input v-model="formData.lastName" type="text" name="lastName" id="lastName" maxlength="200">
                                    </div>
                                </div>
                                <div v-if="formErrors.firstName || formErrors.lastName" class="notes notes--below notes--error">
                                    You must enter a first name and last name
                                </div>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="contactEmail">Contact Email</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="formData.email" type="text" name="email" id="contactEmail" maxlength="200">
                            </div>
                        </div>

                        <div class="form-item form-item--address form-item--required">
                            <div class="form-item__label">
                                <label>Organization Address</label>
                            </div>

                            <div class="form-item__control">


                                <div class="has-floating-label js-floating-label">
                                    <input v-model="formData.address1" type="text" name="address1" id="address1">
                                    <label for="address1">Address Line 1</label>
                                </div>


                                <div class="has-floating-label js-floating-label">
                                    <input v-model="formData.address2" type="text" name="address2" id="address2">
                                    <label for="address2">Address Line 2</label>
                                </div>


                                <div class="has-floating-label js-floating-label">
                                    <input v-model="formData.address3" type="text" name="address3" id="address3">
                                    <label for="address3">Address Line 3</label>
                                </div>


                                <div class="city-state-zip">

                                    <div class="city-state-zip__city">
                                        <input v-model="formData.city" type="text" name="city" id="city" maxlength="200">
                                    </div>

                                    <div class="c-form-control-grid__item c-form-item--required u-flex-collapse" id="addressGroupDefaultCountryOptions-US">
                                        <state-select v-model="formData.state" name="state" id="state" placeholder="State"></state-select>
                                    </div>

                                    <div class="city-state-zip__zip">
                                        <input v-model="formData.zip" type="text" name="zip" id="zip" maxlength="200">
                                        <!--<input type="text" name="orgZip" id="orgZip" placeholder="ZIP" required>-->
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="orgPhone">Organization Phone Number</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="formData.phone" type="text" name="phone" id="orgPhone" maxlength="200">
                                <!--<input type="tel" name="orgPhone" id="orgPhone" required>-->
                            </div>
                        </div>

                        <div class="form-item">
                            <div class="form-item__label">
                                Organization Categories (Check up to 3)
                            </div>
                            <div class="form-item__control">
                                <div v-if="formErrors.categories" class="notes notes--above notes--error">
                                    {{ formErrors.categories }}
                                </div>
                                <forms-nonprofit-category v-model="formData.categories"></forms-nonprofit-category>
                            </div>
                        </div>
                    </fieldset>

                    <div class="form-actions flex justify-center items-center">
                        <button type="submit" class="btn btn--blue btn--round">Register Now</button>
                    </div>
                </form>
            </div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
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
					categories: [],
					firstName: '',
					lastName: '',
					email: '',
				},

				formErrors: {},
			}
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle('Give To Our City - Register');
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
					categories: {
						label: '',
						presence: {
							message: 'You must select at least one category'
						},
						length: {
							minimum: 1,
							maximum: 3,
							tooLong: 'You can only select up to three categories'
						}
					},
					city: {
						presence: true,
					},
					state: {
						presence: true,
					},
					zip: {
						label: 'Zip',
						presence: true,
					},
					phone: {
						label: 'Organization Phone Number',
						presence: true,
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

				//vue.addModal('spinner');
				vue.registerNonprofit();

				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.registerNonprofit();
				}
			},
			registerNonprofit: function () {
				const vue = this;

				axios.post(API_URL + 'nonprofits/registerPublicPage', {
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
						category1: vue.formData.categories.length >= 1 ? vue.formData.categories[0] : null,
						category2: vue.formData.categories.length >= 2 ? vue.formData.categories[1] : null,
						category3: vue.formData.categories.length >= 3 ? vue.formData.categories[2] : null,

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
						//vue.$router.push({name: 'register-response'});
						console.log("GO TO REGISTER RESPONSE");
					}
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			},
		},
		components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('../layout/Hero.vue'),
			'layout-sponsors': require('../layout/Sponsors.vue'),
			'state-select': require('../forms/SelectState.vue'),
			'forms-nonprofit-category': require('./../forms/NonprofitCategory.vue'),
		}
	};
</script>