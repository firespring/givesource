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
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="1"
            >
            <span>Animal-Related</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="2"
            >
            <span>Arts, Culture &amp; Humanities</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="3"
            >
            <span>Children &amp; Families</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="4"
            >
            <span>Civil Rights, Social Action &amp; Advocacy</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="5"
            >
            <span>Community Improvement &amp; Capacity Building</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="6"
            >
            <span>Crime &amp; Legal-Related</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="7"
            >
            <span>Diseases, Disorders &amp; Medical Disciplines</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="8"
            >
            <span>Education-Early Childhood</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="9"
            >
            <span>Education-Higher Education</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="10"
            >
            <span>Education-K-12</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="11"
            >
            <span>Environment</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="12"
            >
            <span>Food, Agriculture &amp; Nutrition</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="13"
            >
            <span>Health Care</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="14"
            >
            <span>Housing &amp; Shelter</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="15"
            >
            <span>Human Services</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="16"
            >
            <span>International, Foreign Affairs &amp; National Security</span>
          </label>
        </li>
      </ul>
    </div>

    <div class="grid-item">
      <ul class="list-plain list-checkbox">
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="17"
            >
            <span>Library &amp; Literacy Programs</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="18"
            >
            <span>Medical Research</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="19"
            >
            <span>Mental Health &amp; Crisis Intervention</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="20"
            >
            <span>Mutual &amp; Membership Benefit</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="21"
            >
            <span>Older Adults</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="22"
            >
            <span>Philanthropy, Voluntarism &amp; Grantmaking Foundations</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="23"
            >
            <span>Politics &amp; Public Administration</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="24"
            >
            <span>Public &amp; Societal Benefit</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="25"
            >
            <span>Public Safety, Disaster Preparedness &amp; Relief</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="26"
            >
            <span>Recreation &amp; Sports</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="27"
            >
            <span>Religion-Related</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="28"
            >
            <span>Science &amp; Technology</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="29"
            >
            <span>Veterans Support</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="30"
            >
            <span>Women</span>
          </label>
        </li>
        <li>
          <label>
            <input
              v-model="localValue"
              type="checkbox"
              name="categories"
              :value="31"
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
    value: { type: Array, default: () => [] }
  },
  data: function () {
    return {
      localValue: []
    }
  },
  watch: {
    value: function (newVal) {
      this.localValue = newVal
    },
    localValue: function () {
      this.emitter.emit('input', this.localValue)
    }
  }
}
</script>
