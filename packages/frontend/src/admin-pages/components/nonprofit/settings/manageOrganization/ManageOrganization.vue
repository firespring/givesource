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
        <navigation :nonprofitUuid="nonprofitUuid"></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">
                <div class="o-page-header">
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
                            <div class="c-form-item c-form-item--text c-form-item--required">

                                <div class="c-form-item c-form-item--text c-form-item--required">
                                    <div class="c-form-item__label">
                                        <label for="taxId" class="c-form-item-label-text">Tax ID</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input v-model="taxId" type="text" name="taxId" id="taxId" maxlength="200" value="">
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
                                                <input v-model="address1" type="text" name="address1" id="address1">
                                                <label for="address1">Address Line 1</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="c-form-control-grid">
                                        <div class="c-form-control-grid__item">
                                            <div class="has-floating-label js-floating-label" v-floating-label>
                                                <input v-model="address2" type="text" name="address2" id="address2">
                                                <label for="address2">Address Line 2</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="c-form-control-grid">
                                        <div class="c-form-control-grid__item">
                                            <div class="has-floating-label js-floating-label" v-floating-label>
                                                <input v-model="address3" type="text" name="address3" id="address3">
                                                <label for="address3">Address Line 3</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="c-form-control-grid">
                                        <div class="c-form-control-grid__item c-form-item--required">
                                            <div class="has-floating-label js-floating-label" v-floating-label>
                                                <input v-model="city" type="text" name="city" id="city">
                                                <label for="city">City</label>
                                            </div>
                                        </div>

                                        <div class="c-form-control-grid__item c-form-item--required u-flex-collapse" id="addressGroupDefaultCountryOptions-US">
                                            <state-select :selected.sync="state" name="state" id="state"></state-select>
                                        </div>

                                        <div class="c-form-control-grid__item c-form-item--required" style="flex: 1 0 11rem; max-width: 11rem;">
                                            <div class="has-floating-label js-floating-label" v-floating-label>
                                                <input v-model="zip" type="text" name="zip" id="zip">
                                                <label for="zip">ZIP Code</label>
                                            </div>
                                        </div>
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
                                            <select v-model="category1" name="category1" id="category1">
                                                <option disabled value="">No category selected</option>
                                                <option disabled value="">-----</option>
                                                <option value="Animal-Related">Animal-Related</option>
                                                <option value="Arts, Culture & Humanities">Arts, Culture &amp; Humanities</option>
                                                <option value="Children & Families">Children &amp; Families</option>
                                                <option value="Civil Rights, Social Action & Advocacy">Civil Rights, Social Action &amp; Advocacy</option>
                                                <option value="Community Improvement & Capacity Building">Community Improvement &amp; Capacity Building</option>
                                                <option value="Crime & Legal-Related">Crime &amp; Legal-Related</option>
                                                <option value="Diseases, Disorders & Medical Disciplines">Diseases, Disorders &amp; Medical Disciplines</option>
                                                <option value="Education-Early Childhood">Education-Early Childhood</option>
                                                <option value="Education-Higher Education">Education-Higher Education</option>
                                                <option value="Education-K-12">Education-K-12</option>
                                                <option value="Environment">Environment</option>
                                                <option value="Food, Agriculture & Nutrition">Food, Agriculture &amp; Nutrition</option>
                                                <option value="Health Care">Health Care</option>
                                                <option value="Housing & Shelter">Housing &amp; Shelter</option>
                                                <option value="Human Services">Human Services</option>
                                                <option value="International, Foreign Affairs & National Security">International, Foreign Affairs &amp; National Security</option>
                                                <option value="Library & Literacy Programs">Library &amp; Literacy Programs</option>
                                                <option value="Medical Research">Medical Research</option>
                                                <option value="Mental Health & Crisis Intervention">Mental Health &amp; Crisis Intervention</option>
                                                <option value="Mutual & Membership Benefit">Mutual &amp; Membership Benefit</option>
                                                <option value="Older Adults">Older Adults</option>
                                                <option value="Philanthropy, Voluntarism & Grantmaking Foundations">Philanthropy, Voluntarism &amp; Grantmaking Foundations</option>
                                                <option value="Politics & Public Administration">Politics &amp; Public Administration</option>
                                                <option value="Public & Societal Benefit">Public &amp; Societal Benefit</option>
                                                <option value="Public Safety, Disaster Preparedness & Relief">Public Safety, Disaster Preparedness &amp; Relief</option>
                                                <option value="Recreation & Sports">Recreation &amp; Sports</option>
                                                <option value="Religion-Related">Religion-Related</option>
                                                <option value="Science & Technology">Science &amp; Technology</option>
                                                <option value="Veterans Support">Veterans Support</option>
                                                <option value="Women">Women</option>
                                                <option value="Youth Development">Youth Development</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="c-form-control-grid">

                                        <div class="c-form-control-grid__item u-flex u-items-center" style="flex: 1 0 8rem; max-width: 8rem;">
                                            <label for="category2" class="c-form-item-label-text">Category #2</label>
                                        </div>

                                        <div class="c-form-control-grid__item">
                                            <select v-model="category2" name="category2" id="category2">
                                                <option disabled value="">No category selected</option>
                                                <option disabled value="">-----</option>
                                                <option value="Animal-Related">Animal-Related</option>
                                                <option value="Arts, Culture & Humanities">Arts, Culture &amp; Humanities</option>
                                                <option value="Children & Families">Children &amp; Families</option>
                                                <option value="Civil Rights, Social Action & Advocacy">Civil Rights, Social Action &amp; Advocacy</option>
                                                <option value="Community Improvement & Capacity Building">Community Improvement &amp; Capacity Building</option>
                                                <option value="Crime & Legal-Related">Crime &amp; Legal-Related</option>
                                                <option value="Diseases, Disorders & Medical Disciplines">Diseases, Disorders &amp; Medical Disciplines</option>
                                                <option value="Education-Early Childhood">Education-Early Childhood</option>
                                                <option value="Education-Higher Education">Education-Higher Education</option>
                                                <option value="Education-K-12">Education-K-12</option>
                                                <option value="Environment">Environment</option>
                                                <option value="Food, Agriculture & Nutrition">Food, Agriculture &amp; Nutrition</option>
                                                <option value="Health Care">Health Care</option>
                                                <option value="Housing & Shelter">Housing &amp; Shelter</option>
                                                <option value="Human Services">Human Services</option>
                                                <option value="International, Foreign Affairs & National Security">International, Foreign Affairs &amp; National Security</option>
                                                <option value="Library & Literacy Programs">Library &amp; Literacy Programs</option>
                                                <option value="Medical Research">Medical Research</option>
                                                <option value="Mental Health & Crisis Intervention">Mental Health &amp; Crisis Intervention</option>
                                                <option value="Mutual & Membership Benefit">Mutual &amp; Membership Benefit</option>
                                                <option value="Older Adults">Older Adults</option>
                                                <option value="Philanthropy, Voluntarism & Grantmaking Foundations">Philanthropy, Voluntarism &amp; Grantmaking Foundations</option>
                                                <option value="Politics & Public Administration">Politics &amp; Public Administration</option>
                                                <option value="Public & Societal Benefit">Public &amp; Societal Benefit</option>
                                                <option value="Public Safety, Disaster Preparedness & Relief">Public Safety, Disaster Preparedness &amp; Relief</option>
                                                <option value="Recreation & Sports">Recreation &amp; Sports</option>
                                                <option value="Religion-Related">Religion-Related</option>
                                                <option value="Science & Technology">Science &amp; Technology</option>
                                                <option value="Veterans Support">Veterans Support</option>
                                                <option value="Women">Women</option>
                                                <option value="Youth Development">Youth Development</option>
                                            </select>
                                        </div>

                                    </div>

                                    <div class="c-form-control-grid">

                                        <div class="c-form-control-grid__item u-flex u-items-center" style="flex: 1 0 8rem; max-width: 8rem;">
                                            <label for="category3" class="c-form-item-label-text">Category #3</label>
                                        </div>

                                        <div class="c-form-control-grid__item">
                                            <select v-model="category3" name="category3" id="category3">
                                                <option disabled value="">No category selected</option>
                                                <option disabled value="">-----</option>
                                                <option value="Animal-Related">Animal-Related</option>
                                                <option value="Arts, Culture & Humanities">Arts, Culture &amp; Humanities</option>
                                                <option value="Children & Families">Children &amp; Families</option>
                                                <option value="Civil Rights, Social Action & Advocacy">Civil Rights, Social Action &amp; Advocacy</option>
                                                <option value="Community Improvement & Capacity Building">Community Improvement &amp; Capacity Building</option>
                                                <option value="Crime & Legal-Related">Crime &amp; Legal-Related</option>
                                                <option value="Diseases, Disorders & Medical Disciplines">Diseases, Disorders &amp; Medical Disciplines</option>
                                                <option value="Education-Early Childhood">Education-Early Childhood</option>
                                                <option value="Education-Higher Education">Education-Higher Education</option>
                                                <option value="Education-K-12">Education-K-12</option>
                                                <option value="Environment">Environment</option>
                                                <option value="Food, Agriculture & Nutrition">Food, Agriculture &amp; Nutrition</option>
                                                <option value="Health Care">Health Care</option>
                                                <option value="Housing & Shelter">Housing &amp; Shelter</option>
                                                <option value="Human Services">Human Services</option>
                                                <option value="International, Foreign Affairs & National Security">International, Foreign Affairs &amp; National Security</option>
                                                <option value="Library & Literacy Programs">Library &amp; Literacy Programs</option>
                                                <option value="Medical Research">Medical Research</option>
                                                <option value="Mental Health & Crisis Intervention">Mental Health &amp; Crisis Intervention</option>
                                                <option value="Mutual & Membership Benefit">Mutual &amp; Membership Benefit</option>
                                                <option value="Older Adults">Older Adults</option>
                                                <option value="Philanthropy, Voluntarism & Grantmaking Foundations">Philanthropy, Voluntarism &amp; Grantmaking Foundations</option>
                                                <option value="Politics & Public Administration">Politics &amp; Public Administration</option>
                                                <option value="Public & Societal Benefit">Public &amp; Societal Benefit</option>
                                                <option value="Public Safety, Disaster Preparedness & Relief">Public Safety, Disaster Preparedness &amp; Relief</option>
                                                <option value="Recreation & Sports">Recreation &amp; Sports</option>
                                                <option value="Religion-Related">Religion-Related</option>
                                                <option value="Science & Technology">Science &amp; Technology</option>
                                                <option value="Veterans Support">Veterans Support</option>
                                                <option value="Women">Women</option>
                                                <option value="Youth Development">Youth Development</option>
                                            </select>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>
                    </section>

                    <footer class="c-form-actions">
                        <button type="submit" class="c-btn">Save Changes</button>
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
				taxId: '',
				address1: '',
				address2: '',
				address3: '',
				city: '',
				state: '',
				zip: '',
				category1: '',
				category2: '',
				category3: ''
			}
		},
        props: [
        	'nonprofitUuid'
        ],
		components: {
			'state-select': require('../../../forms/SelectState.vue')
		},
		methods: {
			validateForm: function () {
				// TODO: validate form
			},
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.updateNonprofit();
			},
			updateNonprofit: function () {
				const vue = this;

				vue.addModal('spinner');
				axios.patch(API_URL + 'nonprofits/' + vue.user.nonprofitUuid, {
						taxId: vue.taxId,
						address1: vue.address1,
						address2: vue.address2,
						address3: vue.address3,
						city: vue.city,
						state: vue.state,
						zip: vue.zip,
						category1: vue.category1,
						category2: vue.category2,
						category3: vue.category3
				}).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
                    } else {
						vue.$router.push({name: 'nonprofits-settings-list'});
                    }
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			},
		}
	};
</script>