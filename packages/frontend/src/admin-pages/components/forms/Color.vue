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
    <input v-if="isDesktop" v-model="localValue" type="text" :name="name" :id="id" ref="input">
    <input v-else v-model="localValue" type="color" :name="name" :id="id">
</template>

<script>
	require('@claviska/jquery-minicolors');

	export default {
		data() {
			return {
				localValue: ''
			};
		},
		computed: {
			isDesktop() {
				return !/Mobi/.test(navigator.userAgent);
			}
		},
		props: {
			value: {},
			id: {
				type: String,
				default: null,
			},
			name: {
				type: String,
				default: null
			},
			defaultColor: {
				type: String,
				default: null
			}
		},
		mounted() {
			const vm = this;

			if (vm.isDesktop) {
				const options = {
					change(value) {
						vm.localValue = value;
					},
				};
				if (vm.defaultColor) {
					options.defaultValue = vm.defaultColor;
				}
				$(vm.$refs.input).minicolors(options);
			}
		},
		watch: {
			localValue(value, oldValue) {
				const vm = this;
				if (value === oldValue) {
					return;
				}
				vm.$emit('input', value);
			},
			value(value, oldValue) {
				const vm = this;
				if (value === oldValue) {
					return;
				}
				vm.localValue = value;
				$(vm.$refs.input).minicolors('value', vm.value);
			}
		}
	};
</script>