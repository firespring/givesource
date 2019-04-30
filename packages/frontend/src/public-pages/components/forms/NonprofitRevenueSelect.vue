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
    <select v-model="localValue" :name="name" :id="id" ref="input">
        <option :disabled="disablePlaceholder" :value="0" v-if="placeholder">{{ placeholder }}</option>
        <option v-for="revenue in revenues" :value="revenue.value">{{ revenue.text }}</option>
    </select>
</template>

<script>
	export default {
		data: function () {
			return {
				localValue: this.value || 0,

				revenues: [
					{value: 1, text: 'Less than $100,000'},
					{value: 2, text: '$100,000-$249,999'},
					{value: 3, text: '$250,000-$499,999'},
					{value: 4, text: '$500,000-$1 Million'},
					{value: 5, text: '$1 Million-$2.5 Million'},
					{value: 6, text: '$2.5 Million-$5 Million'},
					{value: 7, text: '$5 Million-$10 Million'},
					{value: 8, text: '$10 Million-$20 Million'},
					{value: 9, text: '$20 Million-$50 Million'},
					{value: 10, text: 'More than $50 Million'},
					{value: 11, text: 'N/A'}
				]
			};
		},
		props: {
			value: {},
			name: {
				type: String,
				default: 'nonprofitRevenue'
			},
			id: {
				type: String,
				default: 'nonprofitRevenue'
			},
			placeholder: {
				type: String,
				default: null
			},
			disablePlaceholder: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			value: function (newVal) {
				this.localValue = newVal;
			},
			localValue: function () {
				this.$emit('input', this.localValue);
			}
		}
	};
</script>