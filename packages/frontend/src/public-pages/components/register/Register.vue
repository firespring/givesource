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
                    <router-link :to="{ name: 'about' }">please visit the About page</router-link>.
                </p>

                <form v-on:submit="submit">
                    <fieldset>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="orgLegalName">Organization Legal Name</label>
                            </div>
                            <div class="form-item__control">
                                <input type="text" name="orgLegalName" id="orgLegalName" required>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="taxId">Tax ID</label>
                            </div>
                            <div class="form-item__control">
                                <input type="text" name="taxId" id="taxId" required>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="contactNameFirst">Contact Name</label>
                            </div>
                            <div class="form-item__control">
                                <div class="grid">
                                    <div class="grid-item">
                                        <input type="text" name="contactNameFirst" id="contactNameFirst" placeholder="First Name" required>
                                    </div>
                                    <div class="grid-item">
                                        <input type="text" name="contactNameLast" id="contactNameLast" placeholder="Last Name" required>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="contactEmail">Contact Email</label>
                            </div>
                            <div class="form-item__control">
                                <input type="email" name="contactEmail" id="contactEmail" required>
                            </div>
                        </div>

                        <div class="form-item form-item--address form-item--required">
                            <div class="form-item__label">
                                <label>Organization Address</label>
                            </div>

                            <div class="form-item__control">


                                <div class="has-floating-label js-floating-label" v-floating-label>
                                    <input v-model="formData.address1" type="text" name="address1" id="address1">
                                    <label for="address1">Address Line 1</label>
                                </div>


                                <div class="has-floating-label js-floating-label" v-floating-label>
                                    <input v-model="formData.address2" type="text" name="address2" id="address2">
                                    <label for="address2">Address Line 2</label>
                                </div>


                                <div class="has-floating-label js-floating-label" v-floating-label>
                                    <input v-model="formData.address3" type="text" name="address3" id="address3">
                                    <label for="address3">Address Line 3</label>
                                </div>


                                <div class="city-state-zip">

                                    <div class="city-state-zip__city">
                                        <input type="text" name="orgCity" id="orgCity" placeholder="City" required>
                                    </div>

                                    <div class="city-state-zip__state select-wrap">
                                        <select name="orgState" id="orgState" required>
                                            <option value="">State</option>
                                            <option value="" disabled="disabled">-----</option>
                                            <option value="AL">Alabama</option>
                                            <option value="AK">Alaska</option>
                                            <option value="AZ">Arizona</option>
                                            <option value="AR">Arkansas</option>
                                            <option value="CA">California</option>
                                            <option value="CO">Colorado</option>
                                            <option value="CT">Connecticut</option>
                                            <option value="DE">Delaware</option>
                                            <option value="FL">Florida</option>
                                            <option value="GA">Georgia</option>
                                            <option value="HI">Hawaii</option>
                                            <option value="ID">Idaho</option>
                                            <option value="IL">Illinois</option>
                                            <option value="IN">Indiana</option>
                                            <option value="IA">Iowa</option>
                                            <option value="KS">Kansas</option>
                                            <option value="KY">Kentucky</option>
                                            <option value="LA">Louisiana</option>
                                            <option value="ME">Maine</option>
                                            <option value="MD">Maryland</option>
                                            <option value="MA">Massachusetts</option>
                                            <option value="MI">Michigan</option>
                                            <option value="MN">Minnesota</option>
                                            <option value="MS">Mississippi</option>
                                            <option value="MO">Missouri</option>
                                            <option value="MT">Montana</option>
                                            <option value="NE">Nebraska</option>
                                            <option value="NV">Nevada</option>
                                            <option value="NH">New Hampshire</option>
                                            <option value="NJ">New Jersey</option>
                                            <option value="NM">New Mexico</option>
                                            <option value="NY">New York</option>
                                            <option value="NC">North Carolina</option>
                                            <option value="ND">North Dakota</option>
                                            <option value="OH">Ohio</option>
                                            <option value="OK">Oklahoma</option>
                                            <option value="OR">Oregon</option>
                                            <option value="PA">Pennsylvania</option>
                                            <option value="RI">Rhode Island</option>
                                            <option value="SC">South Carolina</option>
                                            <option value="SD">South Dakota</option>
                                            <option value="TN">Tennessee</option>
                                            <option value="TX">Texas</option>
                                            <option value="UT">Utah</option>
                                            <option value="VT">Vermont</option>
                                            <option value="VA">Virginia</option>
                                            <option value="WA">Washington</option>
                                            <option value="WV">West Virginia</option>
                                            <option value="WI">Wisconsin</option>
                                            <option value="WY">Wyoming</option>
                                        </select>
                                    </div>

                                    <div class="city-state-zip__zip">
                                        <input type="text" name="orgZip" id="orgZip" placeholder="ZIP" required>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="orgPhone">Organization Phone Number</label>
                            </div>
                            <div class="form-item__control">
                                <input type="tel" name="orgPhone" id="orgPhone" required>
                            </div>
                        </div>

                        <div class="form-item">
                            <div class="form-item__label">
                                Organization Categories (Check up to 3)
                            </div>
                            <div class="form-item__control">
                                <div class="grid">
                                    <div class="grid-item">
                                        <ul class="list-plain list-checkbox">
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="1">
                                                    <span>Animal-Related</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="2">
                                                    <span>Arts, Culture &amp; Humanities</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="3">
                                                    <span>Children &amp; Families</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="4">
                                                    <span>Civil Rights, Social Action &amp; Advocacy</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="5">
                                                    <span>Community Improvement &amp; Capacity Building</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="6">
                                                    <span>Crime &amp; Legal-Related</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="7">
                                                    <span>Diseases, Disorders &amp; Medical Disciplines</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="8">
                                                    <span>Education-Early Childhood</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="9">
                                                    <span>Education-Higher Education</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="10">
                                                    <span>Education-K-12</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="11">
                                                    <span>Environment</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="12">
                                                    <span>Food, Agriculture &amp; Nutrition</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="13">
                                                    <span>Health Care</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="14">
                                                    <span>Housing &amp; Shelter</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="15">
                                                    <span>Human Services</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="16">
                                                    <span>International, Foreign Affairs &amp; National Security</span>
                                                </label>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="grid-item">
                                        <ul class="list-plain list-checkbox">
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="17">
                                                    <span>Library &amp; Literacy Programs</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="18">
                                                    <span>Medical Research</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="19">
                                                    <span>Mental Health &amp; Crisis Intervention</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="20">
                                                    <span>Mutual &amp; Membership Benefit</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="21">
                                                    <span>Older Adults</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="22">
                                                    <span>Philanthropy, Voluntarism &amp; Grantmaking Foundations</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="23">
                                                    <span>Politics &amp; Public Administration</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="24">
                                                    <span>Public &amp; Societal Benefit</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="25">
                                                    <span>Public Safety, Disaster Preparedness &amp; Relief</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="26">
                                                    <span>Recreation &amp; Sports</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="27">
                                                    <span>Religion-Related</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="28">
                                                    <span>Science &amp; Technology</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="29">
                                                    <span>Veterans Support</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="30">
                                                    <span>Women</span>
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" name="category[]" value="31">
                                                    <span>Youth Development</span>
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
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
					firstName: '',
					lastName: '',
					email: '',
				},
			}
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle('Give To Our City - Register');
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

//		        vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
//		        if (Object.keys(vue.formErrors).length) {
//			        vue.clearModals();
//		        } else {
//			        vue.registerNonprofit();
//		        }
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
				        phone: vue.formData.phone
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
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('../layout/Hero.vue'),
			'layout-sponsors': require('../layout/Sponsors.vue'),
		}
	};
</script>