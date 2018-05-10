<!--
  ~ Copyright 2018 Firespring, Inc.
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
    <input v-model.lazy="localValue" v-on:input="format" type="text" :name="name" :id="id" :class="{'has-error': hasError}" v-if="isInternetExplorer" ref="input">
    <input v-model.lazy="localValue" type="text" :name="name" :id="id" v-money="options" :class="{'has-error': hasError}" v-else>
</template>

<script>
	const numeral = require('numeral');

	module.exports = {
		data: function () {
			return {
				localValue: this.value ? this.value : '0.00',

				options: {
					precision: 2,
					masked: true,
					thousands: '',
				}
			}
		},
		computed: {
			isInternetExplorer: function () {
				return (navigator.appVersion.indexOf("MSIE 10") > -1) || (navigator.userAgent.indexOf("Trident") > -1 && navigator.userAgent.indexOf("rv:11") > -1);
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
			hasError: {
				type: Boolean,
				default: false
			}
		},
		mounted: function () {
			this.format();
		},
		watch: {
			value: function (val) {
				this.localValue = val;
			},
			localValue: function () {
				this.$emit('input', this.localValue);
				this.$refs.moneyInput.dispatchEvent(new Event('input'));
			}
		},
		methods: {
			format: function () {
				const vue = this;

				let value = vue.$refs.input.value;
				value = value.replace(/\D/g, '');
				value = numeral(value / 100).format('0.00');

				vue.localValue = value;
				vue.$refs.input.value = value;
			},
		}
	};
</script>