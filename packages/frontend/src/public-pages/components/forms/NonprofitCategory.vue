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
  <div class="grid">
    <div class="grid-item">
      <ul class="list-plain list-checkbox">
        <li>
          <label for="animalCategory">
            <input
              id="animalCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="1"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Animal-Related</span>
          </label>
        </li>
        <li>
          <label for="artsCategory">
            <input
              id="artsCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="2"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Arts, Culture &amp; Humanities</span>
          </label>
        </li>
        <li>
          <label for="childCategory">
            <input
              id="childCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="3"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Children &amp; Families</span>
          </label>
        </li>
        <li>
          <label for="civilCategory">
            <input
              id="civilCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="4"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Civil Rights, Social Action &amp; Advocacy</span>
          </label>
        </li>
        <li>
          <label for="communityCategory">
            <input
              id="communityCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="5"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Community Improvement &amp; Capacity Building</span>
          </label>
        </li>
        <li>
          <label for="crimeCategory">
            <input
              id="crimeCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="6"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Crime &amp; Legal-Related</span>
          </label>
        </li>
        <li>
          <label for="diseasesCategory">
            <input
              id="diseasesCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="7"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Diseases, Disorders &amp; Medical Disciplines</span>
          </label>
        </li>
        <li>
          <label for="earlyEducationCategory">
            <input
              id="earlyEducationCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="8"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Education-Early Childhood</span>
          </label>
        </li>
        <li>
          <label for="higherEducationCategory">
            <input
              id="higherEducationCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="9"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Education-Higher Education</span>
          </label>
        </li>
        <li>
          <label for="k12EducationCategory">
            <input
              id="k12EducationCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="10"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Education-K-12</span>
          </label>
        </li>
        <li>
          <label for="environmentCategories">
            <input
              id="environmentCategories"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="11"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Environment</span>
          </label>
        </li>
        <li>
          <label for="foodAgCategory">
            <input
              id="foodAgCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="12"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Food, Agriculture &amp; Nutrition</span>
          </label>
        </li>
        <li>
          <label for="healthCategory">
            <input
              id="healthCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="13"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Health Care</span>
          </label>
        </li>
        <li>
          <label for="housingCategory">
            <input
              id="housingCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="14"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Housing &amp; Shelter</span>
          </label>
        </li>
        <li>
          <label for="humanServiceCategory">
            <input
              id="humanServiceCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="15"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Human Services</span>
          </label>
        </li>
        <li>
          <label for="nationalSecurityCategory">
            <input
              id="nationalSecurityCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="16"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>International, Foreign Affairs &amp; National Security</span>
          </label>
        </li>
      </ul>
    </div>

    <div class="grid-item">
      <ul class="list-plain list-checkbox">
        <li>
          <label for="libraryCategory">
            <input
              id="libraryCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="17"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Library &amp; Literacy Programs</span>
          </label>
        </li>
        <li>
          <label for="medicalCategory">
            <input
              id="medicalCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="18"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Medical Research</span>
          </label>
        </li>
        <li>
          <label for="mentalHealthCategory">
            <input
              id="mentalHealthCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="19"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Mental Health &amp; Crisis Intervention</span>
          </label>
        </li>
        <li>
          <label for="mutualBenefitCategory">
            <input
              id="mutualBenefitCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="20"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Mutual &amp; Membership Benefit</span>
          </label>
        </li>
        <li>
          <label for="olderAdultsCategory">
            <input
              id="olderAdultsCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="21"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Older Adults</span>
          </label>
        </li>
        <li>
          <label for="philanthropyCategory">
            <input
              id="philanthropyCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="22"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Philanthropy, Voluntarism &amp; Grant-making Foundations</span>
          </label>
        </li>
        <li>
          <label for="publicAdminCategory">
            <input
              id="publicAdminCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="23"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Politics &amp; Public Administration</span>
          </label>
        </li>
        <li>
          <label for="publicBenefitCategory">
            <input
              id="publicBenefitCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="24"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Public &amp; Societal Benefit</span>
          </label>
        </li>
        <li>
          <label for="publicSafetyCategory">
            <input
              id="publicSafetyCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="25"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Public Safety, Disaster Preparedness &amp; Relief</span>
          </label>
        </li>
        <li>
          <label for="recreationCategory">
            <input
              id="recreationCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="26"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Recreation &amp; Sports</span>
          </label>
        </li>
        <li>
          <label for="religionCategory">
            <input
              id="religionCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="27"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Religion-Related</span>
          </label>
        </li>
        <li>
          <label for="sciTechCategory">
            <input
              id="sciTechCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="28"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Science &amp; Technology</span>
          </label>
        </li>
        <li>
          <label for="veteransCategory">
            <input
              id="veteransCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="29"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Veterans Support</span>
          </label>
        </li>
        <li>
          <label for="womenCategory">
            <input
              id="womenCategory"
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="30"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Women</span>
          </label>
        </li>
        <li>
          <label for="youthDevCategory">
            <input
              id=""
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="31"
              :aria-describedby="groupLabel + ' ' + errorLabel"
            >
            <span>Youth Development</span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: { type: Array, default: () => [] },
    groupLabel: { type: String, default: '' },
    errorLabel: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  data: function () {
    return {
      localValue: []
    }
  },
  watch: {
    modelValue: {
      handler (newVal) {
        this.localValue = newVal
      }
    },
    localValue: {
      handler () {
        this.$emit('update:modelValue', this.localValue)
      }
    }
  }
}
</script>
