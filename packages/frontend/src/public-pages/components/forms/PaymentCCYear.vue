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
        <option v-for="year in range" :value="year">{{ year }}</option>
    </select>
</template>

<script>
	export default {
		data: function () {
			return {
				localValue: this.value ? this.value : new Date().getFullYear(),
			}
		},
		computed: {
			range: function () {
				const range = [];
				let year = new Date().getFullYear();
				for (let i = 0; i < this.years; i++) {
					range.push(year);
					year += 1;
				}
				return range;
			}
		},
		props: {
			value: {},
			id: {
				type: String,
				default: null
			},
			name: {
				type: String,
				default: null
			},
			years: {
				type: Number,
				default: 10
			}
		},
		mounted: function () {
			this.$emit('input', this.localValue);
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