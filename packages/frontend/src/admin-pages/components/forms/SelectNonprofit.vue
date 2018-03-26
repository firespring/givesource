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
    <select v-model="localValue" :id="id" :name="name" class="combobox" :data-placeholder="placeholder" ref="select" :class="{'has-error': hasError}">
        <option value=""></option>
        <option v-for="nonprofit in nonprofits" :value="nonprofit.uuid">{{ nonprofit.legalName }}</option>
    </select>
</template>

<script>
	require('chosen-js');

	module.exports = {
		data: function () {
			return {
				localValue: '',
			};
		},
		computed: {
			selectedValue: function () {
				return this.localValue;
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
			placeholder: {
				type: String,
				default: 'Select a nonprofit'
			},
			nonprofits: {
				type: Array,
				default: function () {
					return [];
				}
			},
			hasError: {
				type: Boolean,
				default: false
			}
		},
		mounted: function () {
			const vue = this;

			$(vue.$refs.select).chosen({
				allow_single_deselect: true,
				width: '100%'
			}).change(function () {
				vue.localValue = $(this).val();
			});
		},
		watch: {
			localValue: function (value, oldValue) {
				const vue = this;
				if (value === oldValue) {
					return;
				}
				vue.$emit('input', vue.selectedValue);
			},
			value: function (value, oldValue) {
				const vue = this;
				if (value === oldValue) {
					return;
				}
				vue.localValue = value;
				$(vue.$refs.select).val(value);
				$(vue.$refs.select).trigger("chosen:updated");
			},
			nonprofits: function () {
				const vue = this;
				vue.$nextTick(function () {
					$(vue.$refs.select).trigger("chosen:updated");
				});
			}
		}
	};
</script>