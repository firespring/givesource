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
        <option v-for="option in options" :value="option.value">{{ option.text }}</option>
    </select>
</template>

<script>
	export default {
		data: function () {
			return {
				localValue: this.value || 0,

				options: [
					{value: 1, text: '0'},
					{value: 2, text: '1-4'},
					{value: 3, text: '5-9'},
					{value: 4, text: '10-19'},
					{value: 5, text: '20-49'},
					{value: 6, text: '50-99'},
					{value: 7, text: '100-249'},
					{value: 8, text: '250-499'},
					{value: 9, text: '500-999'},
					{value: 10, text: '1,000-4,999'},
					{value: 11, text: '5,000-9,999'},
					{value: 12, text: '10,000+'}
				]
			};
		},
		props: {
			value: {},
			name: {
				type: String,
				default: 'nonprofitNumberOfEmployees'
			},
			id: {
				type: String,
				default: 'nonprofitNumberOfEmployees'
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